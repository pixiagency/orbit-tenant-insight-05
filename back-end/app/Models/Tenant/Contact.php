<?php

namespace App\Models\Tenant;

use App\Models\City;
use App\Models\Country;
use App\Models\Source;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    use Filterable;
    protected $fillable =
    [
        'first_name',
        'last_name',
        'business_phone',
        'mobile_phone',
        'job_title',
        'department',
        'status',
        'source_id',
        'contact_method',
        'email_permission',
        'phone_permission',
        'whatsapp_permission',
        'company_name',
        'website',
        'industry',
        'company_size',
        'address',
        'country_id',
        'city_id',
        'state',
        'zip_code',
        'user_id',
        'tags',
        'notes',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    // Contact belongs to a resource
    public function source(): BelongsTo
    {
        return $this->belongsTo(Source::class, 'source_id');
    }

    // Contact has many leads
    public function leads()
    {
        return $this->hasMany(Lead::class, 'contact_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
}
