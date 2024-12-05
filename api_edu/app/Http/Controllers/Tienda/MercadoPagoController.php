<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Models\Sale\Cart;
use Illuminate\Http\Request;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

class MercadoPagoController extends Controller
{
    public function __construct()
    {
        // Mover la configuración al constructor
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
    }

    public function createPreference(Request $request)
    {

        try {
            $user = auth('api')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado.',
                ], 401);
            }

            // Obtener el carrito asociado al usuario
            $carts = Cart::with('course')
                ->with('user') // Carga la relación con los cursos
                ->where('user_id', $user->id)
                ->get();

            if ($carts->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'error' => 'El carrito está vacío.',
                ], 400);
            }


            // Crear los items a partir del carrito
            $items = $carts->map(function ($cart) {
                if (!$cart->course) {
                    throw new \Exception("El curso asociado al carrito con ID {$cart->id} no existe.");
                }

                return [
                    "id" => $cart->course->id,          // ID del curso
                    "title" => $cart->course->title,     // Nombre del curso
                    "quantity" => 1,                    // Cantidad (puedes ajustarlo)
                    "currency_id" => "PEN",             // Moneda
                    "unit_price" => $cart->total,       // Precio total del carrito
                ];
            })->toArray();

            // Crear los datos del usuario para el campo payer
        $payer = [
            "name" => $user->name,
            "surname" => $user->surname ?? '', // Opcional si el modelo no tiene este campo
            "email" => $user->email,
            "phone" => [
                "area_code" => "51", // Proporcionar si está disponible
                "number" => "",    // Proporcionar si está disponible
            ],
            "identification" => [
                "type" => "",      // DNI, CE, etc.
                "number" => "",    // Número del documento
            ],
            "address" => [
                "zip_code" => "",         // Código postal
                "street_name" => "",      // Nombre de la calle
                "street_number" => null,  // Número de la calle
            ],
            "date_created" => $user->created_at->toIso8601String(),
            "last_purchase" => null, // Proporcionar si hay un registro de última compra
        ];

            // Crear la preferencia de pago con MercadoPago

            $preference_data = [
                "items" => $items,
                "payer" => $payer,
                "back_urls" => [
                    "success" => url('/pago/success'),
                    "failure" => url('/pago/failure'),
                    "pending" => url('/pago/pending'),
                ],
                "auto_return" => "approved",
            ];

            $client = new PreferenceClient();
            $preference = $client->create($preference_data);

            return response()->json($preference);
        } catch (MPApiException $e) {
            // Manejo del error de la API de MercadoPago
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'error_detail' => $e->getApiResponse()
            ], 500);
        } catch (\Exception $e) {
            // Manejo de otros errores
            return response()->json([
                'success' => false,
                'error' => 'Ha ocurrido un error inesperado.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    public function success(Request $request)
{
    $paymentId = $request->query('payment_id'); // MercadoPago envía el ID del pago como query string

    if (!$paymentId) {
        return redirect('/error')->with('error', 'No se encontró el identificador del pago.');
    }

    return view('tienda.success', compact('paymentId'));
}

}