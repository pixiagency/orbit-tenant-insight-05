<?php

namespace App\Models\Tenant;

use App\Models\Tenant\Contact;
use App\Models\Stage;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    protected $fillable = [
        'deal_type',
        'deal_name',
        'contact_id',
        'sale_date',
        'discount_type',
        'discount_value',
        'tax_rate',
        'payment_status',
        'payment_method_id',
        'notes',
        'assigned_to_id',
        'stage_id',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }
}
