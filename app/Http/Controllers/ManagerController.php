<?php

namespace App\Http\Controllers;

use App\Models\EmployeeReport;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskUser;
use App\Models\ProjectCrew;
use App\Models\ProjectCrewMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Arr;
use \Illuminate\Support\Facades\Auth;

class ManagerController extends Controller
{
    public function myProjects(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                $projects = \App\Models\ProjectUser::where('user_id', $user->id)
                    ->with('project')
                    ->get()
                    ->pluck('project');
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return Redirect::route('unauthorized');
                }
                if ($projects->isEmpty()) {
                    return Inertia::render('Manager/MyProjects', [
                        'projects' => [],
                        'user' => $user,
                    ]);
                }
                $actualProjects = [];
                for($i = 0; $i < $projects->count(); $i++) {
                    $projectModel = Project::find($projects[$i]->id);
                    $projectModel->task_count = $projectModel->tasks->count();
                    $projectModel->completed_tasks = $projectModel->tasks->where('status', 'completed')->count();
                    $projectModel->pending_tasks = $projectModel->tasks->where('status', 'pending')->count();
                    $projectModel['all_employees'] = $projectModel->crewMembers()->with('submittedReportsofEmployee')->get();
                    $projectModel->in_progress_tasks = $projectModel->tasks->where('status', 'in_progress')->count();
                    $projectModel->overdue_tasks = $projectModel->tasks->where('deadline', '<', now())->count();
                    $tasks = $projectModel->tasks;
                    $count = 0;
                    for($j = 0; $j < $tasks->count(); $j++){
                        if($tasks[$j]->task_no !== null){
                            $count++;
                        }
                    }
                    $projectModel->crew = $count;
                    $actualProjects[] = $projectModel;
                }
                foreach ($actualProjects as $project) {
                    $project->high_priority_tasks = $project->tasks->where('priority', 'high')->count();
                    $project->incomplete_tasks = $project->tasks->whereNotIn('status', ['completed'])->count();
                }

                // Sort the projects
                usort($actualProjects, function($a, $b) {
                    // First by high priority tasks (descending)
                    if ($a->high_priority_tasks != $b->high_priority_tasks) {
                        return $b->high_priority_tasks - $a->high_priority_tasks;
                    }

                    // Then by incomplete tasks (descending)
                    return $b->incomplete_tasks - $a->incomplete_tasks;
                });

                return Inertia::render('Manager/MyProjects',
                    [
                        'projects' => $actualProjects,
                        'user' => $user,
                    ]
                );
            }
            return Redirect::route('unauthorized');
        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>DB::table('sessions')->get()[0]]);
        }
    }
    public function myProjects2(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);

                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return Redirect::route('unauthorized');
                }
                $projects = \App\Models\ProjectUser::where('user_id', $user->id)
                    ->with('project')
                    ->get()
                    ->pluck('project');
                if ($projects->isEmpty()) {
                    return Inertia::render('Manager/MyProjects', [
                        'projects' => [],
                        'user' => $user,
                    ]);
                }
                $actualProjects = [];
                for($i = 0; $i < $projects->count(); $i++) {
                    $projectModel = Project::find($projects[$i]->id);
                    $projectModel->task_count = $projectModel->tasks->count();
                    $projectModel->completed_tasks = $projectModel->tasks->where('status', 'completed')->count();
                    $projectModel->pending_tasks = $projectModel->tasks->where('status', 'pending')->count();
                    $projectModel['all_employees'] = $projectModel->crewMembers()->with('submittedReportsofEmployee')->get();
                    $projectModel->in_progress_tasks = $projectModel->tasks->where('status', 'in_progress')->count();
                    $projectModel->overdue_tasks = $projectModel->tasks->where('deadline', '<', now())->count();
                    $tasks = $projectModel->tasks;
                    $count = 0;
                    for($j = 0; $j < $tasks->count(); $j++){
                        if($tasks[$j]->task_no !== null){
                            $count++;
                        }
                    }
                    $projectModel->crew = $count;
                    $actualProjects[] = $projectModel;
                }
                foreach ($actualProjects as $project) {
                    $project->high_priority_tasks = $project->tasks->where('priority', 'high')->count();
                    $project->incomplete_tasks = $project->tasks->whereNotIn('status', ['completed'])->count();
                }

                // Sort the projects
                usort($actualProjects, function($a, $b) {
                    // First by high priority tasks (descending)
                    if ($a->high_priority_tasks != $b->high_priority_tasks) {
                        return $b->high_priority_tasks - $a->high_priority_tasks;
                    }

                    // Then by incomplete tasks (descending)
                    return $b->incomplete_tasks - $a->incomplete_tasks;
                });

                return response()->json([
                    'projects' => $actualProjects,
                    'user' => $user,
                ]);
            }
            return Redirect::route('unauthorized');
        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>DB::table('sessions')->get()[0]]);
        }
    }
    public function allProjects(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                $projects = DB::table('projects')->get();
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return Redirect::route('unauthorized');
                }
                if ($projects->isEmpty()) {
                    return Inertia::render('Manager/MyProjects', [
                        'projects' => [],
                        'user' => $user,
                    ]);
                }
                $actualProjects = [];
                for($i = 0; $i < $projects->count(); $i++) {
                    $projectModel = Project::find($projects[$i]->id);
                    $projectModel->task_count = $projectModel->tasks->count();
                    $projectModel->completed_tasks = $projectModel->tasks->where('status', 'completed')->count();
                    $projectModel->pending_tasks = $projectModel->tasks->where('status', 'pending')->count();
                    $projectModel['all_employees'] = $projectModel->crewMembers()->with('submittedReportsofEmployee')->get();
                    $projectModel->in_progress_tasks = $projectModel->tasks->where('status', 'in_progress')->count();
                    $projectModel->is_manager_unassigned = is_null($projectModel->manager_id);
                    $projectModel->manager_name = $projectModel->manager ? $projectModel->manager->name : 'Unassigned';
                    $projectModel->takeover_requested = false;
                    $projectModel->takeover_accepted = false;
                    $projectModel->takeover_rejected = false;

                    $assignment = \App\Models\ProjectAssignment::where('project_id', $projectModel->id)
                        ->where('user_id', $user->id)
                        ->latest()
                        ->first();

                    if ($assignment) {
                        $projectModel->takeover_requested = true;
                        if ($assignment->status === 'approved') {
                            $projectModel->takeover_accepted = true;
                        } elseif ($assignment->status === 'rejected') {
                            $projectModel->takeover_rejected = true;
                        }
                    }
                    $projectModel->manager_id = $projectModel->manager ? $projectModel->manager->id : 0;
                    $projectModel->overdue_tasks = $projectModel->tasks->where('deadline', '<', now())->count();
                    $tasks = $projectModel->tasks;
                    $count = 0;
                    for($j = 0; $j < $tasks->count(); $j++){
                        if($tasks[$j]->task_no !== null){
                            $count++;
                        }
                    }
                    $projectModel->crew = $count;
                    $actualProjects[] = $projectModel;
                }
                foreach ($actualProjects as $project) {
                    $project->high_priority_tasks = $project->tasks->where('priority', 'high')->count();
                    $project->incomplete_tasks = $project->tasks->whereNotIn('status', ['completed'])->count();
                }

                // Sort the projects
                usort($actualProjects, function($a, $b) {
                    // First by high priority tasks (descending)
                    if ($a->high_priority_tasks != $b->high_priority_tasks) {
                        return $b->high_priority_tasks - $a->high_priority_tasks;
                    }

                    // Then by incomplete tasks (descending)
                    return $b->incomplete_tasks - $a->incomplete_tasks;
                });

                return Inertia::render('Manager/AllProjects',
                    [
                        'projects' => $actualProjects,
                        'user' => $user,
                    ]
                );
            }
            return Redirect::route('unauthorized');
        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>DB::table('sessions')->get()[0]]);
        }
    }
    public function projectSearch(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return Redirect::route('unauthorized');
                }
                $query = $request->get('q');
                $projects = Project::where('manager_id', $user->id)
                    ->where('name', 'like', '%' . $request->query('q') . '%')
                    ->select('id', 'name')
                    ->take(5)
                    ->get();

                if ($projects->isEmpty()) {
                    return response()->json(['message' => 'No projects found']);
                }

                return response()->json($projects);
            }
            return response()->json(["error"=>"error occured"]);
        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>DB::table('sessions')->get()[0]]);
        }
    }

    public function show($id){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return Redirect::route('unauthorized');
                }
                $project = Project::find($id);
                if (!$project || $project->manager_id !== $user->id) {
                    return Redirect::route('unauthorized');
                }
                $project['task_count'] = $project->tasks->count();
                $project["totalEmp"] = User::where('role_id', 4)->with('submittedReportsofEmployee')->get();
                $project['completed_tasks'] = $project->tasks->where('status', 'completed')->count();
                $project['pending_tasks'] = $project->tasks->where('status', 'pending')->count();
                $project['in_progress_tasks'] = $project->tasks->where('status', 'in_progress')->count();
                $project['overdue_tasks'] = $project->tasks->where('deadline', '<', now())->count();
                $project['all_employees'] = $project->crewMembers()->with('submittedReportsofEmployee')->get();
                if($project->manager->id === $user_id){
                    return Inertia::render('Manager/ProjectView', [
                    'project' => $project,
                ]);
                }
            } else {
                return Redirect::route('unauthorized');
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return Redirect::route('unauthorized');
        }
    }
    public function tasks(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return Redirect::route('unauthorized');
                }

                $task = Task::find($request->query('task_id'));
                $temp = $task->task_no;
                if($temp===null){
                     return response()->json(['task'=>$task, 'task_user'=>null]);
                }
                return response()->json(['task'=>$task, 'task_user'=>$task->task_no->user]);

            } else {
                return Redirect::route('unauthorized');
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return Redirect::route('unauthorized');
        }
    }

    public function storeProjectTask(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);

                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return response()->json(["error"=>"User unauthorized"]);
                }

                // Validate request data
                $validated = $request->validate([
                        'title' => 'required|string',
                        'description' => 'nullable|string',
                        'status' => 'required|string',
                        'deadline' => 'required|date_format:Y-m-d',
                        'project_id' => 'required|integer|exists:projects,id',
                        'created_by' => 'required|integer|exists:users,id', // Fixed table name
                        'employee_id' => 'integer|min:0|exists:users,id', // Allow 0 and other integers
                        'progress' => 'required|integer|in:0,25,50,75,100',
                        'priority' => 'required|string',
                    ]);
                    $correctuser = Project::find($request->project_id)->manager_id;
                if($correctuser !== $user->id){
                    return response()->json(["error"=>"User Unauthorized"]);
                }
                    // Use a transaction to ensure data consistency
                    DB::transaction(function () use ($request, $validated) {
                        // Create the task (excluding employee_id)
                        $task = Task::create(
                            Arr::except($validated, ['employee_id'])
                        );

                        // Assign the task to an employee if provided
                        if ($request->has('employee_id') && $request->employee_id != 0) {
                                TaskUser::create([
                                    'task_id' => $task->id,
                                    'user_id' => $request->employee_id,
                                ]);
                            }
                    });
                return response()->json(['message' => 'Task created successfully!'], 201);

            } else {
                return response()->json(["error"=>"User Unauthorized"]);
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>$e]);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['error' => $ve->errors(),"empid"=>$request->employee_id], 422);
        }
    }
    public function updateProjectTask(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);

                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return response()->json(["error"=>"User unauthorized"]);
                }

                // Validate request data
                  $validated = $request->validate([
                        'task_id' => 'required|integer|exists:tasks,id',
                        'title' => 'required|string',
                        'description' => 'nullable|string',
                        'status' => 'required|string',
                        'deadline' => 'required|date_format:Y-m-d',
                        'project_id' => 'required|integer|exists:projects,id',
                        'created_by' => 'required|integer|exists:users,id',
                        'employee_id' => 'nullable|integer|exists:users,id',
                        'progress' => 'required|integer|in:0,25,50,75,100',
                        'priority' => 'required|string',
                    ]);
                $correctuser = Project::find($request->project_id)->manager_id;
                if($correctuser !== $user_id){
                    return response()->json(["error"=>"User Unauthorized","correctuser"=>$correctuser,"user"=>$user,"project"=>Project::find($request->project_id)]);
                }
                    $task = null;
                    $task = Task::find($request->task_id);
                    $task->update(Arr::except($validated, ['employee_id', 'task_id']));
                    if ($request->employee_id == 0 || $request->employee_id === null) {
                                TaskUser::where('task_id', $task->id)->delete();
                            }
                            else {
                                TaskUser::updateOrCreate(
                                    ['task_id' => $task->id],
                                    ['user_id' => $request->employee_id]
                                );
                            }
                return response()->json(['message' => $task], 201);

            } else {
                return response()->json(["error"=>"Validation error"]);
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>$e]);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['error' => $ve->errors(),"empid"=>$request->employee_id], 422);
        }
    }
    public function deleteProjectTask(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);

                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return response()->json(["error"=>"User unauthorized"]);
                }

                // Validate request data
                  $validated = $request->validate([
                        'task_id' => 'required|integer|exists:tasks,id',
                        'project_id' => 'required|integer|exists:projects,id',
                    ]);
                    $correctuser = Project::find($request->project_id)->manager_id;
                if($correctuser !== $user_id){
                    return response()->json(["error"=>"User Unauthorized","correctuser"=>$correctuser,"user"=>$user,"project"=>Project::find($request->project_id)]);
                }

                    Task::where('id',$request->task_id)->delete();
                return response()->json(['message' => 'Task deleted successfully!'], 201);

            } else {
                return response()->json(["error"=>"Validation error"]);
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>$e]);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['error' => $ve->errors(),"empid"=>$request->employee_id], 422);
        }
    }
    public function storeProject(Request $request) {
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return Redirect::route('unauthorized');
                }
                return Inertia::render("Manager/ProjectCreation");

            } else {
                return Redirect::route('unauthorized');
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return Redirect::route('unauthorized');
        }
    }
    public function reportSubmission(Request $request) {
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return response()->json(['message'=>"You are not authorized."]);
                }
                $validated = $request->validate([
                        'user_id' => 'required|integer',
                        'submitted_by' => 'required|integer',
                        'report_date' => 'required|date_format:Y-m-d',
                        'subject' => 'required|string',
                        'description' => 'required|string',
                        'status' => 'required|string',
                    ]);
                $report = EmployeeReport::create($validated);
                return response()->json(["message"=>"Report Created Successfully","data"=>$report]);

            } else {
                return Redirect::route('unauthorized');
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return Redirect::route('unauthorized');
        }
    }
    public function projectAssignment(Request $request) {
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);
                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return response()->json(['message'=>"You are not authorized."]);
                }
                $validated = $request->validate([
                        'project_id' => 'required|integer|exists:projects,id',
                        'user_id' => 'required|integer|exists:users,id',
                        'requested_by' => 'required|integer|exists:users,id',
                        'status' => 'required|string',
                        'message' => 'nullable|string',
                    ]);
                $assignment = \App\Models\ProjectAssignment::create($validated);
                return response()->json(["message"=>"Assignment requested Successfully","data"=>$assignment]);

            } else {
                return response()->json(['message'=>"You are not authorized."], 403);
            }

        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['error' => $ve->errors(),"empid"=>$request->employee_id], 422);
        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e)6
            return response()->json(["error"=>$e->getMessage()]);
        } catch (\Illuminate\Database\QueryException $qe) {
            // Handle database query exceptions
            return response()->json(['error' => 'Database error: ' . $qe->getMessage()], 500);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $he) {
            if ($he->getStatusCode() === 403) {
            return response()->json(['error' => 'Forbidden'], 403);
            }
            throw $he;
        }
    }

    public function addProjectCrew(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);

                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return response()->json(["error"=>"User unauthorized"]);
                }
                $validated = $request->validate([
                        'project_id' => 'required|integer|exists:projects,id',
                        'user_id' => 'required|integer|exists:users,id',
                    ]);
                $crewadd = ProjectCrewMember::create($validated);

                return response()->json(['message' => 'Crew added Successfully!'], 201);

            } else {
                return response()->json(["error"=>"Validation error"]);
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>$e]);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['error' => $ve->errors(),"empid"=>$request->employee_id], 422);
        }
    }
    public function deleteProjectCrew(Request $request){
        try {
            $temp = DB::table('sessions')->get();
            if ($temp->count() > 1) {
                $user_id = null;
                for($i=0;$i<$temp->count();$i++){
                    if($temp[$i]->user_id!==null){
                        $user_id = $temp[$i]->user_id;
                        break;
                    }
                }
                $user = User::find($user_id);

                if (!$user || $user->roles->name !== 'ProjectManager') {
                    return response()->json(["error"=>"User unauthorized"]);
                }

                $taskIds = Task::where('project_id', $request->projectId)->pluck('id');

                // Step 2: Delete task_user entries only for that project's tasks
                TaskUser::whereIn('task_id', $taskIds)
                    ->where('user_id', $request->userId)
                    ->delete();

                // Optional: If you store project-specific membership in a separate table,
                // you might want to remove them from that too
                ProjectCrewMember::where('project_id', $request->projectId)
                    ->where('user_id', $request->userId)
                    ->delete();
                return response()->json(['message' => 'Crew Removed Successfully!'], 201);

            } else {
                return response()->json(["error"=>"Validation error"]);
            }

        } catch (\Exception $e) {
            // Optionally log the exception: \Log::error($e);
            return response()->json(["error"=>$e]);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['error' => $ve->errors(),"empid"=>$request->employee_id], 422);
        }
    }
}
