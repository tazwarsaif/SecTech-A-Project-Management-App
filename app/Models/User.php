<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function roles(){
        return $this->belongsTo(Role::class, 'role_id');
    }
    public function role(){
        return $this->belongsTo(Role::class, 'role_id');
    }
    public function clients()
    {
        return $this->hasOne(Client::class, 'user_id');
    }
    public function projects()
    {
        return $this->hasMany(Project::class, 'manager_id');
    }
    public function task_user(){
        return $this->hasMany(ProjectUser::class, "user_id");
    }
    public function tasksCreatedBy()
    {
        return $this->hasMany(Task::class, 'created_by');
    }
    public function tasksAssignedTo()
    {
        return $this->hasMany(TaskUser::class, 'user_id');
    }
    public function assignedProjects()
    {
        return $this->belongsToMany(Project::class, 'project_crew_members');
    }
    // Reports submitted by this user as an employee
    public function submittedReportsofEmployee()
    {
        return $this->hasMany(EmployeeReport::class, 'user_id');
    }

    // Reports submitted by this user as a project manager
    public function submittedReportsAsManager()
    {
        return $this->hasMany(EmployeeReport::class, 'submitted_by');
    }

}
