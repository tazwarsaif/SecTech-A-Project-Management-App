<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmployeeReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'submitted_by',
        'report_date',
        'subject',
        'description',
        'status',
    ];

    public function employee()
    {
        return $this->belongsToMany(User::class, 'user_id');
    }

    public function submitter()
    {
        return $this->belongsToMany(User::class, 'submitted_by');
    }
}
