<?php

namespace App\Models;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use Filterable;
    protected $fillable=[
        'status',
        'contact_id',
        'reason_id',
        'user_id',
        'value',
    ];
    // Lead belongs to a Contact
    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    // Lead belongs to a User (Sales Representative)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Lead belongs to a Reason (if lost)
    public function reason()
    {
        return $this->belongsTo(Reason::class);
    }

    // Lead has many Industries (Many-to-Many)
    public function industries()
    {
        return $this->belongsToMany(Industry::class, 'lead_industry')->withTimestamps();
    }

    // Lead has many Services (Many-to-Many)
    public function services()
    {
        return $this->belongsToMany(Service::class, 'lead_service')
            ->withPivot('category_id'); // Include category_id in the pivot table
    }

    // Lead has many Custom Fields (Many-to-Many)
    public function customFields()
    {
        return $this->belongsToMany(CustomField::class, 'lead_custom_fields')->withPivot('value')->withTimestamps();
    }



     // Lead has many Stages (Many-to-Many)
     public function stages()
    {
        return $this->belongsToMany(Stage::class, 'lead_stage')
            ->withPivot('start_date', 'exit_date', 'pipline_id')
            ->withTimestamps();
    }

}
