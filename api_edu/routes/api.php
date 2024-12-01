<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Tienda\CartController;
use App\Http\Controllers\Tienda\HomeController;
use App\Http\Controllers\Tienda\CheckoutController;
use App\Http\Controllers\Admin\Course\ClaseGController;
use App\Http\Controllers\Admin\Course\CourseGController;
use App\Http\Controllers\Tienda\ProfileClientController;
use App\Http\Controllers\Admin\Course\SeccionGController;
use App\Http\Controllers\Admin\Course\CategorieController;
use App\Http\Controllers\Tienda\MercadoPagoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login_tienda', [AuthController::class, 'login_tienda']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});

Route::group([
    'middleware' => 'api',
], function () {
    Route::resource('/users', UserController::class);
    Route::post('/users/{id}', [UserController::class, "update"]);

    Route::resource('/categorie', CategorieController::class);
    Route::post('/categorie/{id}', [CategorieController::class, "update"]);

    Route::get('/course/config', [CourseGController::class, "config"]);
    Route::resource('/course', CourseGController::class);
    Route::post('/course/upload_video/{id}', [CourseGController::class, "upload_video"]);
    Route::post('/course/{id}', [CourseGController::class, "update"]);

    Route::resource('/course-section', SeccionGController::class);

    Route::resource('/course-clases', ClaseGController::class);
    Route::post('/course-clases-file', [ClaseGController::class, "addFiles"]);
    Route::delete('/course-clases-file/{id}', [ClaseGController::class, "removeFiles"]);
    Route::post('/course-clases/upload_video/{id}', [ClaseGController::class, "upload_video"]);
});

Route::group(["prefix" => "ecommerce"], function () {
    Route::get("home", [HomeController::class, "home"]);
    Route::get("course-detail/{slug}", [HomeController::class, "course_detail"]);

    Route::group([
        'middleware' => 'api',
<<<<<<< HEAD
    ], function () {
        Route::resource('/cart', CartController::class);
        Route::post('/checkout', [CheckoutController::class, "store"]);
        Route::post('/profile', [ProfileClientController::class, "profile"]);
        Route::post('/create-preference', [MercadoPagoController::class, 'createPreference']);
        Route::post('/process-payment', [MercadoPagoController::class, 'processPayment']);
        Route::get('/pago/success', [MercadoPagoController::class, 'success'])->name('pago.success');
=======
    ], function ($router) {
        Route::get("course_leason/{slug}",[HomeController::class,"course_leason"]);
    Route::resource('/cart',CartController::class);
    Route::post('/checkout',[CheckoutController::Class,"store"]);
    Route::post('/profile',[ProfileClientController::Class,"profile"]);
    //Route::post('/create-payment', [PaymentController::class, 'createPayment']);
>>>>>>> 2fe0ea8fc66cba6a468de9065424362ebf0517c7
    });

    Route::get("course_leason/{slug}", [HomeController::class, "course_leason"]);
    Route::resource('/cart', CartController::class);
    Route::post('/checkout', [CheckoutController::class, "store"]);
    Route::post('/profile', [ProfileClientController::class, "profile"]);
});
