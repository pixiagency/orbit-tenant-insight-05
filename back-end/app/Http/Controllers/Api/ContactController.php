<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\GeneralException;
use App\Http\Requests\Clients\StoreClientRequest;
use Exception;
use Illuminate\Http\Request;
use App\DTO\Client\ClientDTO;
use App\DTO\Contact\ContactDTO;
use App\Exports\ContactsExport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contacts\ContactStoreRequest;
use App\Http\Resources\ContactResource;
use App\Imports\ContactsImport;
use App\Services\ContactService;
use Maatwebsite\Excel\Exceptions\NoTypeDetectedException;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;

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

    public function importPreview(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240'
        ]);

        try {
            $file = $request->file('file');

            // Store file temporarily
            $filePath = $file->store('temp-imports', 'local');

            // Get headers from the Excel file
            $headings = (new HeadingRowImport())->toArray($file);
            $excelHeaders = $headings[0][0] ?? [];

            // Get available database fields
            $databaseFields = $this->getDatabaseFields();

            return response()->json([
                'success' => true,
                'file_path' => $filePath,
                'excel_headers' => $excelHeaders,
                'database_fields' => $databaseFields,
                'suggested_mapping' => $this->suggestMapping($excelHeaders, $databaseFields),
                'preview_data' => $this->getPreviewData($file, 5) // Show first 5 rows
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to read file: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getDatabaseFields()
    {
        return [
            'first_name' => [
                'label' => 'First Name',
                'required' => true,
                'type' => 'string'
            ],
            'last_name' => [
                'label' => 'Last Name',
                'required' => true,
                'type' => 'string'
            ],
            'email' => [
                'label' => 'Email Address',
                'required' => true,
                'type' => 'email'
            ],
            'business_phone' => [
                'label' => 'Business Phone',
                'required' => false,
                'type' => 'string'
            ],
            'mobile_phone' => [
                'label' => 'Mobile Phone',
                'required' => false,
                'type' => 'string'
            ],
            'job_title' => [
                'label' => 'Job Title',
                'required' => false,
                'type' => 'string'
            ],
            'department' => [
                'label' => 'Department',
                'required' => false,
                'type' => 'string'
            ],
            'status' => [
                'label' => 'Status',
                'required' => false,
                'type' => 'select',
                'options' => ['active', 'inactive', 'pending']
            ],
            'contact_method' => [
                'label' => 'Preferred Contact Method',
                'required' => false,
                'type' => 'select',
                'options' => ['email', 'phone', 'whatsapp', 'meeting']
            ],
            'email_permission' => [
                'label' => 'Email Permission',
                'required' => false,
                'type' => 'boolean'
            ],
            'phone_permission' => [
                'label' => 'Phone Permission',
                'required' => false,
                'type' => 'boolean'
            ],
            'whatsapp_permission' => [
                'label' => 'WhatsApp Permission',
                'required' => false,
                'type' => 'boolean'
            ],
            'company_name' => [
                'label' => 'Company Name',
                'required' => false,
                'type' => 'string'
            ],
            'website' => [
                'label' => 'Website',
                'required' => false,
                'type' => 'url'
            ],
            'industry' => [
                'label' => 'Industry',
                'required' => false,
                'type' => 'string'
            ],
            'company_size' => [
                'label' => 'Company Size',
                'required' => false,
                'type' => 'string'
            ],
            'address' => [
                'label' => 'Address',
                'required' => false,
                'type' => 'text'
            ],
            'country_id' => [
                'label' => 'Country',
                'required' => false,
                'type' => 'select',
                'options_source' => 'countries'
            ],
            'city_id' => [
                'label' => 'City',
                'required' => false,
                'type' => 'select',
                'options_source' => 'cities'
            ],
            'state' => [
                'label' => 'State/Province',
                'required' => false,
                'type' => 'string'
            ],
            'zip_code' => [
                'label' => 'ZIP/Postal Code',
                'required' => false,
                'type' => 'string'
            ],
            'tags' => [
                'label' => 'Tags',
                'required' => false,
                'type' => 'string'
            ],
            'notes' => [
                'label' => 'Notes',
                'required' => false,
                'type' => 'text'
            ]
        ];
    }

    private function suggestMapping(array $excelHeaders, array $databaseFields)
    {
        $mapping = [];

        foreach (array_keys($databaseFields) as $dbField) {
            $mapping[$dbField] = $this->findBestMatch($dbField, $excelHeaders);
        }

        return $mapping;
    }

    private function findBestMatch($dbField, array $excelHeaders)
    {
        // Exact match
        if (in_array($dbField, $excelHeaders)) {
            return $dbField;
        }

        // Common variations
        $variations = [
            'first_name' => ['firstname', 'fname', 'first', 'given_name'],
            'last_name' => ['lastname', 'lname', 'last', 'surname', 'family_name'],
            'email' => ['email_address', 'e_mail', 'mail'],
            'business_phone' => ['work_phone', 'office_phone', 'business_number'],
            'mobile_phone' => ['cell_phone', 'mobile', 'cell', 'mobile_number'],
            'company_name' => ['company', 'organization', 'org', 'business_name'],
            'job_title' => ['title', 'position', 'role'],
            'zip_code' => ['zip', 'postal_code', 'postcode'],
        ];

        if (isset($variations[$dbField])) {
            foreach ($variations[$dbField] as $variation) {
                if (in_array($variation, $excelHeaders)) {
                    return $variation;
                }
            }
        }

        // Fuzzy matching (contains)
        foreach ($excelHeaders as $header) {
            if (strpos(strtolower($header), strtolower($dbField)) !== false) {
                return $header;
            }
        }

        return null;
    }

    private function getPreviewData($file, $rows = 5)
    {
        try {
            $data = Excel::toArray(new class implements \Maatwebsite\Excel\Concerns\ToArray {
                public function array(array $array)
                {
                    return $array;
                }
            }, $file);

            $sheetData = $data[0] ?? [];
            $headers = $sheetData[0] ?? [];
            $previewRows = array_slice($sheetData, 1, $rows);

            return [
                'headers' => $headers,
                'rows' => $previewRows
            ];
        } catch (\Exception $e) {
            return ['headers' => [], 'rows' => []];
        }
    }


    public function import(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'column_mapping' => 'required|array',
            'import_settings' => 'nullable|array',
            'import_settings.defaults' => 'nullable|array',
            'import_settings.skip_duplicates' => 'nullable|boolean',
            'import_settings.update_existing' => 'nullable|boolean'
        ]);
        try {

            $filePath = $request->input('file_path');
            $columnMapping = $request->input('column_mapping');
            $importSettings = $request->input('import_settings', []);

            // Validate mapping
            $requiredFields = ['first_name', 'last_name'];
            foreach ($requiredFields as $field) {
                if (empty($columnMapping[$field])) {
                    return ApiResponse(message: "The field '{$field}' is required and must be mapped.", code: 422);
                }
            }

            // Get file from storage
            $file = storage_path('app/' . $filePath);
            if (!file_exists($file)) {
                return ApiResponse(message: 'Import file not found. Please upload the file again.', code: 404);
            }

            // Perform import
            $import = new ContactsImport($columnMapping, $importSettings);
            Excel::import($import, $file);

            // Clean up temporary file
            \Storage::disk('local')->delete($filePath);

            $failures = $import->failures();

            if ($failures->isNotEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Some rows failed to import',
                    'failures' => $failures->map(function ($failure) {
                        return [
                            'row' => $failure->row(),
                            'attribute' => $failure->attribute(),
                            'errors' => $failure->errors(),
                            'values' => $failure->values(),
                        ];
                    }),
                    'total_failures' => $failures->count()
                ], 422);
            }

            return ApiResponse(message: 'Contacts imported successfully', code: 200);
        } catch (\Exception $e) {
            return ApiResponse(message: 'Import failed: ' . $e->getMessage(), code: 500);
        }
    }


    public function export(Request $request)
    {
        $request->validate([
            'columns' => 'required|array|min:1', // e.g., ['first_name', 'email']
            'columns.*' => 'string'
        ]);
        $columns = $request->input('columns');

        return Excel::download(new ContactsExport($columns), 'contacts.xlsx');
    }

    public function getColumns()
    {
        $columns = $this->getDatabaseFields();
        return ApiResponse($columns, 'Columns retrieved successfully');
    }
}
