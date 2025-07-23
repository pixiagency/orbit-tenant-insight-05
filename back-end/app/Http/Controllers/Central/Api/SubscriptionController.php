<?php

namespace App\Http\Controllers\Central\Api;

use App\Enums\CompanySizes;
use App\Enums\landlord\ActivitionMethods;
use App\Enums\landlord\InvoiceStatus;
use App\Enums\landlord\PaymentStatus;
use App\Enums\landlord\SubscriptionsStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\LandlordSubscription\SubscriptionCollection;
use App\Http\Resources\LandlordSubscription\SubscriptionResource;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\Tier;
use App\Services\AuthService;
use DB;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Laravel\Cashier\Exceptions\IncompletePayment;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Subscription::query();

            // Search by package name
            if ($request->filled('search')) {
                $query->whereHas('client', function ($query) use ($request) {
                    $query->where('company_name', 'like', '%' . $request->search . '%');
                });
            }

            // Filter by subscription_status
            if ($request->filled('subscription_status')) {
                $query->where('subscription_status', $request->subscription_status);
            }

            // Filter by package_name in package table
            if ($request->filled('package_name')) {
                $query->whereHas('tier', function ($query) use ($request) {
                    $query->where('package_name', $request->package_name);
                });
            }

            // Filter by payment_status
            if ($request->filled('payment_status')) {
                $query->where('payment_status', $request->payment_status);
            }


            // Filter by max users
            if ($request->filled('activition_method')) {
                $query->where('activition_method', $request->activition_method);
            }

            // Filter by min users
            if ($request->filled('subscription_start_date')) {
                $query->where('subscription_start_date', '>=', $request->subscription_start_date);
            }

            // Filter by min users
            if ($request->filled('subscription_end_date')) {
                $query->where('subscription_end_date', '>=', $request->subscription_end_date);
            }

            // Filter by auto_renew
            if ($request->filled('auto_renew')) {
                $query->where('auto_renew', $request->auto_renew);
            }

            // Filter by package_cycle
            if ($request->filled('package_cycle')) {
                $query->whereHas('tier', function ($query) use ($request) {
                    $query->where('duration_unit', $request->package_cycle);
                });
            }



            // Filter by after date
            if ($request->filled('after_date')) {
                $query->where('created_at', '>=', $request->after_date);
            }

            // Filter by before date
            if ($request->filled('before_date')) {
                $query->where('created_at', '<=', $request->before_date);
            }

            // Filter by modules dropdown filter
            if ($request->filled('modules')) {
                $query->where('modules', 'like', '%' . $request->modules . '%');
            }

            // Get pagination per page from request or default to 10
            $perPage = $request->get('per_page', 10);


            // Paginate the results
            $subscriptions = $query->with('client', 'tier')->paginate($perPage);
            return ApiResponse(new SubscriptionCollection($subscriptions), 'Subscriptions retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $setting = Setting::first();
            $allowedSources = json_decode($setting?->sources ?? '[]', true);

            $validatedData = $request->validate([
                'client_id' => 'required|exists:clients,id',
                'tier_id' => 'required|exists:tiers,id',
                'activition_method' => ['required', Rule::in(ActivitionMethods::values())],
                'source' => ['required', Rule::in($allowedSources)],
                'subscription_status' => ['required', Rule::in(SubscriptionsStatus::values())],
                'auto_renew' => ['required', Rule::in(['yes', 'no'])],
                'payment_status' => ['required', Rule::in(PaymentStatus::values())],
                'note' => 'nullable|string',
            ]);


            $subscription = Subscription::create($validatedData);

            if ($request->hasFile('file')) {
                $subscription->addMediaFromRequest('file')->toMediaCollection();
            }

            $client = Client::find($validatedData['client_id']);
            $tier = Tier::find($validatedData['tier_id']);
    
            $tenant = Tenant::create([
                'id' => $client->subdomain,
                'tenancy_db_name' => "crm_" . $client->subdomain,
                'name' => $client->company_name,
                'client_id' => $client->id
            ]);

            $tenant->createDomain([
                'domain' => $client->subdomain,
            ]);

            $tenant->tiers()->sync($tier->id);
            $tenant->save();

            tenancy()->initialize($tenant);

            app()->make(AuthService::class)->signup(
                first_name: $client->contact_name,
                last_name: $client->contact_name,
                email: $client->contact_email,
                password: Hash::make("123456"),
                type: "admin"
            );

            DB::commit();

            return ApiResponse(new SubscriptionResource($subscription), 'Subscription created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function subscribe(Request $request)
    {
        try {
            $setting = Setting::first();
            $allowedIndustries = json_decode($setting?->industries ?? '[]', true);

            DB::beginTransaction();
            $validatedData = $request->validate([
                'tier_id' => 'required|exists:tiers,id',
                'payment_method' => 'required|string',

                'company_name' => 'required|string|unique:clients',
                'subdomain' => 'required|string|unique:clients',
                'contact_name' => 'nullable|string',
                'contact_email' => 'required|email|unique:clients',
                'contact_phone' => 'required|string|unique:clients',
                'job_title' => 'nullable|string',
                'website' => 'nullable|string',
                'company_size' => ['nullable', Rule::in(CompanySizes::values())],
                'industry' => ['nullable', Rule::in($allowedIndustries)],
                'city_id' => 'nullable|exists:cities,id',
                'postal_code' => 'nullable|string',
                'address' => 'nullable|string',
            ]);

            $tier = Tier::find($validatedData['tier_id']);

            $billable = Client::create([
                'company_name' => $validatedData['company_name'],
                'subdomain' => $validatedData['subdomain'],
                'contact_name' => $validatedData['contact_name'],
                'contact_email' => $validatedData['contact_email'],
                'contact_phone' => $validatedData['contact_phone'],
                'job_title' => $validatedData['job_title'],
                'website' => $validatedData['website'],
                'company_size' => $validatedData['company_size'],
                'industry' => $validatedData['industry'],
                'city_id' => $validatedData['city_id'],
                'postal_code' => $validatedData['postal_code'],
                'address' => $validatedData['address'],
            ]);

            $subscription = Subscription::create([
                'client_id' => $billable->id,
                'tier_id' => $validatedData['tier_id'],
                'subscription_start_date' => now(),
                'subscription_end_date' => now()->addDays($tier->duration),
                'subscription_status' => SubscriptionsStatus::ACTIVE,
                'activition_method' => $validatedData['activition_method'] ?? ActivitionMethods::MANUAL,
                'source' => $validatedData['source'] ?? null,
            ]);

            $invoice = Invoice::create([
                'client_id' => $billable->id,
                'subscription_id' => $subscription->id,
                'amount' => $tier->price,
                'status' => InvoiceStatus::PENDING,
                'due_date' => $subscription->subscription_end_date,
            ]);


            // Create or get Stripe customer
            if (!$billable->hasStripeId()) {
                $billable->createAsStripeCustomer([
                    'name' => $billable->company_name ?? $billable->name,
                    'email' => $billable->contact_email ?? $billable->email,
                ]);
            }

            // Add payment method
            $billable->addPaymentMethod($request->payment_method);
            $billable->updateDefaultPaymentMethod($request->payment_method);

            // Create subscription
            $subscription = $billable->newSubscription('default', $tier->price)
                ->create($request->payment_method);

            DB::commit();
            return ApiResponse($subscription, 'Subscription created successfully');
        } catch (IncompletePayment $exception) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Payment requires additional confirmation',
                'payment_intent' => [
                    'id' => $exception->payment->id,
                    'client_secret' => $exception->payment->client_secret,
                ]
            ], 402);
        } catch (\Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function getActivationMethod()
    {
        $activationMethods = ActivitionMethods::values();
        return ApiResponse($activationMethods, 'Activation methods retrieved successfully');
    }

    public function getPaymentStatus()
    {
        $paymentStatus = PaymentStatus::values();
        return ApiResponse($paymentStatus, 'Payment status retrieved successfully');
    }

    public function getSubscriptionStatus()
    {
        $subscriptionStatus = SubscriptionsStatus::values();
        return ApiResponse($subscriptionStatus, 'Subscription status retrieved successfully');
    }
}
