<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Project as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        "client_id",
        'manager_id',
        'start_date',
        'end_date',
        'status',
    ];

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
    }
    public function project_user(){
        return $this->hasMany(ProjectUser::class, "project_id");
    }
     public function crewMembers()
    {
        return $this->belongsToMany(User::class, 'project_crew_members')->where('role_id', 4);
    }
     public function projectAssignments()
    {
        return $this->hasMany(ProjectAssignment::class, 'project_id');
    }
    public function completionRequests() {
        return $this->hasMany(ProjectCompletionRequest::class);
    }

}
