<?php

use App\Http\Controllers\Central\Web\AuthController;
use Illuminate\Support\Facades\Route;

// foreach (config('tenancy.central_domains') as $domain) {
//     Route::domain($domain)->name('central.')->group(function () {
//         Route::get('/', function () {
//             return 'hi';
//         });
//         Route::group(['prefix' => 'authentication', 'middleware' => 'guest'], function () {
//             Route::get('login', [AuthController::class, 'loginForm'])->name('login');
//             Route::get('signup', [AuthController::class, 'signupForm'])->name('signup');
//             Route::post('signup', [AuthController::class, 'signup'])->name('signup');
//             Route::post('login', [AuthController::class, 'login'])->name('signin');
//         });

//         //auth routes
//         Route::group(['prefix' => 'dashboard', 'middleware' => 'auth'], function () {
//             Route::get('/', function () {
//                 return view('central.livewire.index');
//             })->name('home');

//             Route::get('logout', [AuthController::class, 'logout'])->name('logout');
//         });
//     });
// }


//Route::fallback(function () {
//    if (request()->is('api/*')) {
//        return response()->json(['error' => 'API route not found'], 404);
//    }
//    return view('layouts.dashboard.error-pages.error404');
//})->name('error');

//Route::get('/clear-cache', function () {
//    Artisan::call('config:cache');
//    Artisan::call('cache:clear');
//    Artisan::call('config:clear');
//    Artisan::call('view:clear');
//    Artisan::call('route:clear');
//    return "Cache is cleared";
//})->name('clear.cache');
//
//Route::get('/migrate-fresh/{password}', function ($password) {
//    if ($password == 150024) {
//        Artisan::call('migrate:fresh --seed');
//        return "migrate fresh success";
//    }
//    return "failed";
//})->name('migrate-fresh');
//
//
//Route::get('/migrate/{password}', function ($password) {
//    if ($password == 1234) {
//        Artisan::call('migrate');
//        return "migrate fresh success";
//    }
//    return "failed";
//})->name('migrate');
