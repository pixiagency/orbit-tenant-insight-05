<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;

if (!function_exists('apiResponse')) {
    function apiResponse($data = null, $message = null, $code = 200): JsonResponse
    {
        $array = [
            'status' => in_array($code, successCode()),
            'message' => $message,
            'data' => $data,
        ];

        // Check if the data is a collection of resources
        if ($data instanceof AnonymousResourceCollection || $data instanceof ResourceCollection) {
            $base = $data->resource;

            // If the collection is paginated
            if ($base instanceof LengthAwarePaginator || $base instanceof Paginator) {
                $array['data'] = $data->collection;
                $array['meta'] = [
                    'page'      => $base->currentPage(),
                    'per_page'  => $base->perPage(),
                    'total'     => $base instanceof LengthAwarePaginator ? $base->total() : null,
                    'last_page' => $base instanceof LengthAwarePaginator ? $base->lastPage() : null,
                    'from'      => method_exists($base, 'firstItem') ? $base->firstItem() : null,
                    'to'        => method_exists($base, 'lastItem') ? $base->lastItem() : null,
                ];
            } else {
                // For a simple resource collection that is not paginated
                $array['data'] = $data->collection;
            }
        }
        // Check if data is a single resource or is null
        else if ($data && is_object($data) && method_exists($data, 'toArray')) {
            $array['data'] = $data->toArray(request());
        } else {
            $array['data'] = $data;
        }

        return response()->json($array, $code);
    }
}

if (!function_exists('successCode')) {
    function successCode(): array
    {
        return [
            200,
            201,
            202
        ];
    }
}

// if (!function_exists('notifyUser')) {

//     function notifyUser(\App\Models\User $user, $data = [])
//     {
//         $user->notify(new \App\Notifications\GeneralNotification($data));
//     }
// }

if (!function_exists('getLocale')) {

    function getLocale(): string
    {
        return app()->getLocale();
    }
}


if (!function_exists('setLanguage')) {

    function setLanguage(string $locale): void
    {
        app()->setLocale($locale);
    }
}

if (!function_exists('getAuthUser')) {

    function getAuthUser(string $guard = 'sanctum'): \Illuminate\Contracts\Auth\Authenticatable|null|\App\Models\User
    {
        return auth($guard)->user();
    }

}

if (!function_exists('per_page')) {

    function per_page()
    {
        return request()->get('per_page', 10);

    }
}
