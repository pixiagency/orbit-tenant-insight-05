<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\GeneralException;
use App\Http\Requests\Clients\StoreClientRequest;
use Exception;
use Illuminate\Http\Request;
use App\DTO\Client\ClientDTO;
use App\DTO\Contact\ContactDTO;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contacts\ContactStoreRequest;
use App\Http\Resources\ContactResource;
use App\Services\ContactService;

class ContactController extends Controller
{
    public function __construct(public ContactService $contactService) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page');
            $filters = array_filter($request->get('filters', []), function ($value) {
                return ($value !== null && $value !== false && $value !== '');
            });
            $withRelations = ['area.ancestors', 'source'];
            $contacts = $this->contactService->getContacts($filters, $withRelations, $perPage);
            return ApiResponse(new ContactCollection($contacts), 'Contacts retrieved successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $contactDTO = ContactDTO::fromRequest($request);

            $contact = $this->contactService->store($contactDTO);
            DB::commit();
            return ApiResponse(new ContactResource($contact), 'Contact created successfully', code: 201);
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
    public function show(string $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
