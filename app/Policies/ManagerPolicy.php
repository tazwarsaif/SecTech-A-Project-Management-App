<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class ManagerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user){
        return $user->roles->id === 2 || $user->roles->id === 1
            ? Response::allow()
            : Response::deny('You do not have permission to view any projects.');
    }
}
