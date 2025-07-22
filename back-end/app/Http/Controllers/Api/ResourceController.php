<?php

namespace App\Http\Controllers\Api;

use App\DTO\Client\ClientDTO;
use App\Exceptions\GeneralException;
use App\Http\Resources\ClientCollection;
use App\Http\Resources\ClientResource;
use App\Http\Resources\SourceCollection;
use Exception;

use Illuminate\Http\Request;
use App\Models\Tenant\Resource;
use App\DTO\Resource\ResourceDTO;
use App\Services\ResourceService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Exceptions\NotFoundException;
use App\Http\Resources\SourceResource;
use App\Http\Requests\Resource\ResourceStoreRequest;
use App\Http\Requests\Resource\ResourceUpdateRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpFoundation\Response;

class ResourceController extends Controller
{
    public function __construct(public ResourceService $resourceService)
    {

    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $perPage = $request->query('per_page');
            $filters = array_filter($request->get('filters', []), function ($value) {
                return ($value !== null && $value !== false && $value !== '');
            });
            $withRelations = [];
            $resources = $this->resourceService->getResources($filters, $withRelations, $perPage);
            return ApiResponse(new SourceCollection($resources), 'Sources retrieved successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ResourceStoreRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();
            $resourceDTO = ResourceDTO::fromRequest($request);
            $resource = $this->resourceService->store($resourceDTO);
            DB::commit();
            return ApiResponse(new SourceResource($resource), 'Source created successfully', Response::HTTP_CREATED);
        } catch (GeneralException $e) {
            return ApiResponse(message: $e->getMessage(), code: $e->getCode());
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {
        // $id = (int) $id;
        try {
            dd($id);
            $resource = $this->resourceService->findById($id);
            // $resource=Resource::find($id);
            return ApiResponse::sendResponse(200, 'Source retrieved successfully', new SourceResource($resource));
        } catch (NotFoundException $e) {
            return ApiResponse::sendResponse(404, $e->getMessage());
        } catch (Exception $e) {
            return ApiResponse::sendResponse(500, $e->getMessage());
        }
    }
    // public function show(Resource $resource)
    // {
    //     // dd($resource);
    //     return ApiResponse::sendResponse(200, 'Source retrieved successfully', new SourceResource($resource));
    // }


    /**
     * Update the specified resource in storage.
     */
    public function update(ResourceUpdateRequest $request,$id)
    {
        try {
            $resourceDTO = $request->toResourceDTO();
            // dd($resourceDTO);
            $this->resourceService->update($resourceDTO, $id);
            return ApiResponse::sendResponse(200, 'Source updated successfully');
        } catch (NotFoundException $e) {
            return ApiResponse::sendResponse(404, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::sendResponse(500, $e->getMessage());
        }
    }

    // public function update(ResourceUpdateRequest $request, Resource $resource)
    // {

    //     $resourceDTO = $request->toResourceDTO();
    //     $resource->update($resourceDTO->toArray());
    //     return ApiResponse::sendResponse(200, 'Source updated successfully');
    // }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // $id = (int) $id;
        try {
            $this->resourceService->delete($id);
            return ApiResponse::sendResponse(200, 'Source deleted successfully');
        } catch (NotFoundException $e) {
            return ApiResponse::sendResponse(404, $e->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::sendResponse(500, $e->getMessage());
        }
    }
}
