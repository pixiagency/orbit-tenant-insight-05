<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Central\Api\AuthController as  centralAuthController;
use App\Http\Controllers\Central\Api\PaymentController;
use App\Http\Controllers\Central\Api\SettingController;
use App\Http\Controllers\Central\Api\SubscriptionController;


// dd('hi');
// //////////// landlord routes
foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->name('central.')->group(function () {
        Route::group(['prefix' => 'authentication', 'middleware' => 'guest', 'name' => 'authentication.'], function () {
            Route::post('signup', [centralAuthController::class, 'signup'])->name('signup');
            Route::post('login', [centralAuthController::class, 'login'])->name('login');
            Route::get('hi', fn() => \Illuminate\Support\Facades\DB::getDatabaseName());
        });

        Route::post('subscriptions/subscribe', [SubscriptionController::class, 'subscribe']);
        Route::post('tiers/buy', [\App\Http\Controllers\Central\Api\TierController::class, 'buy'])->name('tiers.buy')->middleware('auth:sanctum');
        Route::apiResource('tiers', \App\Http\Controllers\Central\Api\TierController::class);
        Route::apiResource('modules', \App\Http\Controllers\Central\Api\ModuleController::class);
        // Route::apiResource('activation-codes', \App\Http\Controllers\Central\Api\ActivationCodeController::class);


        Route::get('tenants', [\App\Http\Controllers\Central\Api\TenantController::class, 'index'])->name('tenants.index')->middleware('auth:sanctum');

        //auth routes
        Route::group(['prefix' => 'dashboard', 'middleware' => 'auth:sanctum'], function () {

            Route::resource('packages', \App\Http\Controllers\Central\Api\PackageController::class);
            Route::get('/settings', [SettingController::class, 'show']);
            Route::put('/settings', [SettingController::class, 'update']);
            Route::resource('clients', \App\Http\Controllers\Central\Api\ClientController::class);
            Route::get('/locations/countries', [\App\Http\Controllers\Central\Api\LocationController::class, 'getCountries']);
            Route::get('/locations/countries/{countryId}/cities', [\App\Http\Controllers\Central\Api\LocationController::class, 'getCities']);

            //subscription routes
            Route::get('/subscriptions/activation-method', [SubscriptionController::class, 'getActivationMethod']);
            Route::get('/subscriptions/payment-status', [SubscriptionController::class, 'getPaymentStatus']);
            Route::get('/subscriptions/subscription-status', [SubscriptionController::class, 'getSubscriptionStatus']);
            Route::apiResource('subscriptions', SubscriptionController::class);

            Route::get('activation-codes/statistics', [\App\Http\Controllers\Central\Api\ActivationCodeController::class, 'statistics']);
            Route::apiResource('activation-codes', \App\Http\Controllers\Central\Api\ActivationCodeController::class);
            Route::apiResource('discount-codes', \App\Http\Controllers\Central\Api\DiscountCodeController::class);
            Route::apiResource('invoices', \App\Http\Controllers\Central\Api\InvoiceController::class);

            //payment routes
            Route::post('payment/process', [PaymentController::class, 'paymentProcess']);
            Route::get('payment/callback', [PaymentController::class, 'callback']);

            Route::post('logout', [centralAuthController::class, 'logout'])->name('logout.post');
        });
    });
}


// //////////// tenant routes
Route::middleware([
    'api',
    \Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain::class,
    \Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::get('/test', fn() => \Illuminate\Support\Facades\DB::getDatabaseName());

    Route::group(['prefix' => 'authentication', 'middleware' => 'guest', 'name' => 'authentication.'], function () {
        Route::post('/login', [AuthController::class, 'login'])->name('tenant.login');
        Route::post('/signup', [AuthController::class, 'signup'])->name('tenant.signup');
    });

    Route::prefix('contacts/import')->group(function () {
        Route::post('/preview', [\App\Http\Controllers\Api\ContactController::class, 'importPreview']);
        Route::post('/', [\App\Http\Controllers\Api\ContactController::class, 'import']);
    });

    Route::prefix('contacts/export')->group(function () {
        Route::get('/columns', [\App\Http\Controllers\Api\ContactController::class, 'getColumns']);
        Route::post('/', [\App\Http\Controllers\Api\ContactController::class, 'export']);
    });



    Route::middleware('auth:sanctum')->group(function () {
        // Route::middleware('role:admin')->group(function () { 
        Route::apiResource('users', \App\Http\Controllers\Api\UsersController::class);
        Route::apiResource('tasks', \App\Http\Controllers\Api\TaskController::class);
        // });
    });

    Route::apiResource('contacts', \App\Http\Controllers\Api\ContactController::class);
    Route::apiResource('deals', \App\Http\Controllers\Api\DealController::class);

    Route::apiResource('opportunities', \App\Http\Controllers\Api\OpportunityController::class);
    Route::get('/roles', [\App\Http\Controllers\Api\RoleController::class, 'index']);

    Route::apiResource('teams', \App\Http\Controllers\Api\TeamsController::class);
    Route::apiResource('clients', \App\Http\Controllers\Api\ClientController::class);
    Route::apiResource('pipelines', \App\Http\Controllers\Api\PipelineController::class);
    Route::apiResource('payment-methods', \App\Http\Controllers\Api\PaymentMethodController::class);
    Route::get('/locations/countries', [\App\Http\Controllers\Api\LocationController::class, 'getCountries']);
    Route::get('/locations/countries/{countryId}/cities', [\App\Http\Controllers\Api\LocationController::class, 'getCities']);
    Route::get('/locations/cities/{cityId}/areas', [\App\Http\Controllers\Api\LocationController::class, 'getAreas']);
    Route::apiResource('sources', \App\Http\Controllers\Api\ResourceController::class);
    Route::apiResource('reasons', \App\Http\Controllers\Api\ReasonController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', function () {
            return response()->json(auth()->user);
        });
    });
});


// Route::get('/user-json', function (Request $request) {
//     return response()->json($request->user()); // Returns authenticated user data
// })->middleware('auth:sanctum')->name('user.json');

// Route::fallback(function () {
//     if (request()->is('api/*')) {
//         return response()->json(['error' => 'API route not found'], 404);
//     }
//     return view('layouts.dashboard.error-pages.error404');
// })->name('error');
