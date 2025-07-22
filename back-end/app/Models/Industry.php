<?php

namespace App\Models;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;

class Industry extends Model
{
    use Filterable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];
    public function clients()
    {
        return $this->belongsToMany(Client::class, 'client_industry');
    }

    public function leads()
    {
        return $this->belongsToMany(Lead::class, 'lead_industry');
    }
}
