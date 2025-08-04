<?php

namespace App\Http\Controllers\Api;

use App\DTO\User\UserDTO;
use App\Http\Requests\Users\AddUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use Exception;
use Illuminate\Http\JsonResponse;
use App\Services\UserService;
use App\Exceptions\NotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Http\Requests\Users\UserUpdateProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class UsersController extends Controller
{
    public function __construct(private readonly UserService $userService) {}


    public function index(Request $request): JsonResponse
    {
        try {
            $filters = array_filter(request()->query());
            $withRelations = ['roles'];
            $users = $this->userService->index(filters: $filters, withRelations: $withRelations,  perPage: $filters['per_page'] ?? 10);
            return ApiResponse(new UserCollection($users), 'Users retrieved successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AddUserRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function store(AddUserRequest $request): JsonResponse
    {
        try {
            $userDTO = UserDTO::fromRequest($request);
            DB::beginTransaction();
            $user = $this->userService->store($userDTO);
            DB::commit();
            return ApiResponse(new UserResource($user), 'User created successfully');
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * @param $id
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        try {
            $user = $this->userService->findById(id: $id);
            return view('layouts.dashboard.users.show', compact('user'));
        } catch (Exception $e) {
            $toast = [
                'type' => 'error',
                'title' => 'error',
                'message' => trans('app.there_is_an_error')
            ];
            return back()->with('toast', $toast);
        }
    }

    /**
     * @param $id
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function edit($id)
    {
        try {
            $user = $this->userService->findById(id: $id);
            return view('layouts.dashboard.users.edit', compact('user'));
        } catch (Exception $e) {
            return redirect()->back();
        }
    }

    /**
     * @param UserUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UserUpdateRequest $request, $id)
    {
        try {
            $userDTO = $request->toUserDTO();
            $this->userService->update($userDTO, $id);
            $toast = [
                'type' => 'success',
                'title' => 'success',
                'message' => trans('app.user_updated_successfully')
            ];
            return to_route('users.index')->with('toast', $toast);
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

    public function updateProfile(UserUpdateProfileRequest $request, $id)
    {
        try {
            $this->userService->updateProfile($request->validated(), $id);
            $toast = [
                'type' => 'success',
                'title' => 'success',
                'message' => trans('app.success_operation')
            ];
            return to_route('home')->with('toast', $toast);
        } catch (Exception $e) {
            $toast = [
                'type' => 'error',
                'title' => 'error',
                'message' => trans('app.there_is_an_error')
            ];
            return back()->with('toast', $toast);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->userService->destroy(id: $id);
            return apiResponse(message: trans('lang.success_operation'));
        } catch (NotFoundException $e) {
            return apiResponse(message: $e->getMessage(), code: 422);
        } catch (Exception $e) {
            return apiResponse(message: trans('lang.something_went_wrong'), code: 422);
        }
    }
}
