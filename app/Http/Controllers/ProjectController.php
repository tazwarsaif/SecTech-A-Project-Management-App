<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

     public static function middleware()
     {
        return ['auth:sanctum'];
     }
    public function index()
    {
        Gate::define('store', function ($user) {
            return $user->roles->id === 2 || $user->roles->id === 1;
        });
        Gate::authorize('store');
        return Project::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Gate::authorize(ability: 'store', arguments: [Project::class]);
        // Gate::authorize('store');
        Gate::define('store', function ($user) {
            return $user->roles->id === 2 || $user->roles->id === 1;
        });
        Gate::authorize('store');
        try {
            $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            "client_id" => 'nullable|exists:clients,id',
            'manager_id' => 'nullable|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);


        $project = Project::create($data);

        return response()->json($project, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the project'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        // Gate::authorize('view', $project);
        Gate::define('view', function ($user) use ($project) {
            return $user->roles->id === 2 || $user->roles->id === 1 || $project->client->user_id === $user->id || $project->tasks->contains(function ($task) use ($user) {
                return $task->task_no->user_id === $user->id;
            });
        });
        Gate::authorize('view', $project);
        return response()->json($project);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        Gate::authorize('modify', $project);
        try {

            $data = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                "client_id" => 'nullable|exists:clients,id',
                'manager_id' => 'nullable|exists:users,id',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);
            $project->update($data);

        return response()->json($project, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            dd($request->all());
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the project'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        Gate::authorize('modify', $project);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        try {
            $project->delete();
            return response()->json(['message'=>'project was deleted'], 204);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'An error occurred while deleting the project'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

    }
}
