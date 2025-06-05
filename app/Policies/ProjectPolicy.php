<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Models\TaskUser ;
use Illuminate\Auth\Access\Response;
use Illuminate\Http\Request;

class ProjectPolicy
{
   public function modify(User $user, Project $project)
   {
       // Check if the user is the project manager or has admin role
       if (($user->id === $project->manager_id && $user->roles->id === 2) || $user->roles->id === 1) {
           return Response::allow();
       }
       return Response::deny('You do not have permission to modify this project.');
   }
//    public function view(User $user, Project $project)
//    {
//        // Allow viewing if the user is the project manager or has admin role
//        if (($user->roles->id === 2 || $user->roles->id === 1)) {
//            return Response::allow();
//        }else{
//         $temp = $project->tasks;
//         foreach ($temp as $task) {
//             if ($project->$task->task_no->user_id === $user->id) {
//                 return Response::allow();
//             }
//         }
//         if($project->client->user_id === $user->id){
//             return Response::allow();
//        }
//     }
//        return Response::deny('You do not have permission to view this project.');
//    }
//    public function store(User $user){
//          // Allow storing if the user has admin role
//         //  if ($user->roles->id === 2 || $user->roles->id === 1) {
//         //       return Response::allow();
//         //  }
//         //  return Response::deny('You do not have permission to create a project.');
//         return ($user->roles->id === 2 || $user->roles->id === 1)
//             ? Response::allow()
//             : Response::deny('You do not have permission to create a project.');
//    }
}
