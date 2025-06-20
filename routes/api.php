<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\ProjectController;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::apiResource('projects', ProjectController::class);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register',[AuthController::class,'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/manager/myprojects', [ManagerController::class, 'myProjects2'])->middleware('auth:sanctum');
Route::get('/project/suggestions', [ManagerController::class, 'projectSearch'])->middleware('auth:sanctum');
Route::post('/addtask', [ManagerController::class, 'storeProjectTask'])->middleware('auth:sanctum');
Route::post('/updatetask', [ManagerController::class, 'updateProjectTask'])->middleware('auth:sanctum');
Route::post('/deletetask', [ManagerController::class, 'deleteProjectTask'])->middleware('auth:sanctum');
Route::post('/assignment', [ManagerController::class, 'projectAssignment'])->middleware('auth:sanctum');
Route::post('/addreport', [ManagerController::class, 'reportSubmission'])->middleware('auth:sanctum');
Route::post('/project-completion', [ManagerController::class, 'projectCompletionRequest'])->middleware('auth:sanctum');
Route::post('/addcrew', [ManagerController::class, 'addProjectCrew'])->middleware('auth:sanctum');
Route::post('/deletecrew', [ManagerController::class, 'deleteProjectCrew'])->middleware('auth:sanctum');
