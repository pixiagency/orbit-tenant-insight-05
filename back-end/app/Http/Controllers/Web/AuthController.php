<?php

namespace App\Http\Controllers\Web;

use App\Exceptions\NotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\SignupRequest;
use App\Http\Requests\Auth\UpdateAuthRequest;
use App\Services\AuthService;
use Exception;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function signupForm()
    {
        return view('layouts.dashboard.auth.signup');
    }

    public function signup(SignupRequest $request)
    {
        try {
            $this->authService->signup(name: $request->name, email: $request->email, password: $request->password);
            $toast = [
                'type' => 'success',
                'title' => 'success',
                'message' => trans('app.signup_successfully')
            ];
            return to_route('login');
        } catch (Exception $e) {
            dd($e);
            return back()->with('error', $e->getMessage());
        }
    }

    public function loginForm()
    {
        return view('layouts.dashboard.auth.login');
    }

    public function login(LoginRequest $request)
    {
        try {
            $this->authService->loginWithEmailOrPhone(identifier: $request->identifier, password: $request->password);
            $toast = [
                'type' => 'success',
                'title' => 'success',
                'message' => trans('app.login_successfully')
            ];
            return to_route('home')->with('toast', $toast);
        } catch (NotFoundException $e) {
            return back()->with('error', "email or password incorrect please try again");
        } catch (Exception $e) {
            dd($e);
            return back()->with('error', $e->getMessage());
        }
    }

    public function getProfile()
    {
        return view('layouts.dashboard.user.profile');
    }

    public function updateProfile(UpdateAuthRequest $request)
    {
        try {
            $this->authService->updateProfile($request->validated());
            $toast = [
                'type' => 'success',
                'title' => 'success',
                'message' => trans('app.success_operation')
            ];

            return to_route('home')->with('toast', $toast);
        } catch (Exception $e) {
            dd($e);
            $toast = [
                'type' => 'error',
                'title' => 'error',
                'message' => trans('app.there_is_an_error')
            ];
            return back()->with('toast', $toast);
        }
    }

    public function logout()
    {
        Auth::logout();
        return to_route('login');
    }
}
