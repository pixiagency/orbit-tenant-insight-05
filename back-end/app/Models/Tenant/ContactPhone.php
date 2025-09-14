<?php

namespace App\Models\Tenant;


use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class ContactPhone extends Model implements Auditable
{
    use HasFactory, Filterable, AuditableTrait;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['contact_id', 'phone'];

    public function transformAudit(array $data): array
    {
        return $data;
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}
