<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Models\Course\Course;
use App\Models\CoursesStudent;
use App\Models\Sale\Cart;
use App\Models\Sale\Sale;
use App\Models\Sale\SaleDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class MercadoPagoController extends Controller
{
    public function __construct()
    {
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

            $carts = Cart::with('course')
                ->with('user')
                ->where('user_id', $user->id)
                ->get();

            if ($carts->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'error' => 'El carrito está vacío.',
                ], 400);
            }

            $items = $carts->map(function ($cart) {
                if (!$cart->course) {
                    throw new \Exception("El curso asociado al carrito con ID {$cart->id} no existe.");
                }

                return [
                    "id" => $cart->course->id,
                    "title" => $cart->course->title,
                    "quantity" => 1,
                    "currency_id" => "PEN",
                    "unit_price" => $cart->total,
                ];
            })->toArray();

            $payer = [
                "name" => $user->name,
                "surname" => $user->surname ?? '',
                "email" => $user->email,
                "phone" => [
                    "area_code" => "51",
                    "number" => "",
                ],
                "identification" => [
                    "type" => "",
                    "number" => "",
                ],
                "address" => [
                    "zip_code" => "",
                    "street_name" => "",
                    "street_number" => null,
                ],
                "date_created" => $user->created_at->toIso8601String(),
                "last_purchase" => null,
            ];

            $external_reference = Str::uuid()->toString();

            $productIds = $carts->pluck('course_id')->toArray();
            Cache::put("product_ids_{$external_reference}", $productIds, now()->addHours(1));


            $preference_data = [
                "items" => $items,
                "payer" => $payer,
                "back_urls" => [
                    "success" => url('api/ecommerce/pago/success') . "?user_id={$user->id}&reference={$external_reference}&product_ids=" . implode(',', $productIds),
                    "failure" => url('api/ecommerce/pago/failure') . "?user_id={$user->id}&reference={$external_reference}",
                    "pending" => url('api/ecommerce/pago/pending') . "?user_id={$user->id}&reference={$external_reference}",
                ],
                "auto_return" => "approved",
                "external_reference" => $external_reference,
            ];

            $client = new PreferenceClient();
            $preference = $client->create($preference_data);

            Cache::put("cart_{$external_reference}", $carts, now()->addHours(1));
            return response()->json($preference);
        } catch (MPApiException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'error_detail' => $e->getApiResponse()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Ha ocurrido un error inesperado.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    public function success(Request $request)
    {
        $paymentId = $request->input('payment_id');
        $status = $request->input('status');
        $externalReference = $request->input('reference');
        $userId = $request->input('user_id');
        $productIds = $request->input('product_ids');

        try {
            DB::beginTransaction();

            $user = User::findOrFail($userId);
            $carts = Cache::get("cart_{$externalReference}");
            $cachedProductIds = Cache::get("product_ids_{$externalReference}");

            if (!$carts || $carts->isEmpty()) {
                throw new \Exception('No se encontró información del carrito.');
            }

            if ($productIds !== implode(',', $cachedProductIds)) {
                throw new \Exception('Los IDs de productos no coinciden con los almacenados.');
            }

            $totalAmount = $carts->sum('total');

            $sale = Sale::create([
                'user_id' => $user->id,
                'method_payment' => 'MercadoPago',
                'currency_total' => 'PEN',
                'currency_payment' => 'PEN',
                'total' => $totalAmount,
                'n_transaccion' => $paymentId,
            ]);

            if (!$sale->save()) {
                throw new \Exception('No se pudo guardar la venta.');
            }

            foreach ($carts as $key => $cart) {
                $saleDetail = new SaleDetail([
                    'sale_id' => $sale->id,
                    'course_id' => $cart->course_id,
                    'total' => $cart->total,
                ]);

                if (!$saleDetail->save()) {
                    throw new \Exception('No se pudo guardar el detalle de la venta.');
                }
                CoursesStudent::create([
                    "course_id" => $cart->course_id,
                    "user_id" => $sale->user_id,
                ]);

                Cart::where('id', $cart->id)->delete();
            }

            DB::commit();
            Cache::forget("cart_{$externalReference}");
            Cache::forget("product_ids_{$externalReference}");

            /*return response()->json([
                'success' => true,
                'message' => 'Pago procesado con éxito y compra registrada',
                'payment_id' => $paymentId,
                'status' => $status,
                'sale_id' => $sale->id
            ]);*/
            //return redirect()->away("http://localhost:4200/payment-success?payment_id={$paymentId}&status={$status}&sale_id={$sale->id}");
            return redirect()->away("http://localhost:4200");
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pago: ' . $e->getMessage(),
                'payment_id' => $paymentId,
                'product_ids' => $productIds,
                'status' => $status
            ], 500);
        }
    }

    public function failure(Request $request)
    {
        $paymentId = $request->input('payment_id');
        $status = $request->input('status');
        $externalReference = $request->input('external_reference');

        return response()->json([
            'success' => false,
            'message' => 'El pago ha fallado',
            'payment_id' => $paymentId,
            'status' => $status
        ]);
    }

    public function pending(Request $request)
    {
        $paymentId = $request->input('payment_id');
        $status = $request->input('status');
        $externalReference = $request->input('external_reference');

        return response()->json([
            'success' => true,
            'message' => 'El pago está pendiente',
            'payment_id' => $paymentId,
            'status' => $status
        ]);
    }
}