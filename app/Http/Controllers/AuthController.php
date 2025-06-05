<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    public function register(Request $request){
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
                'role_id' => 'required|exists:roles,id',
            ]);

            $data['password'] = bcrypt($data['password']);
            $user = User::create($data);

            return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while registering the user'], 500);
        }
    }
    public function login(Request $request){
        try {
            $request->validate([
                'email' => 'required|string|email|max:255|exists:users,email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();
            if(!$user || !Hash::check($request->password, $user->password)){
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
            $token = $user->createToken($request->email);
            $sessionId = Str::random(40);
            DB::table('sessions')->insert([
                'id' => $sessionId,
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => base64_encode(serialize(['user_id' => $user->id])),
                'last_activity' => time(),
            ]);
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token->plainTextToken,
                'session' => $sessionId,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while Log in'], 500);
        }
    }
    public function logout(Request $request){
        $request->validate([
            'session_id' => 'required|string',
        ]);
        $sessionId = $request->session_id;
        $session = DB::table('sessions')->where('id', $sessionId)->first();
        if (!$session || $session->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Invalid session'], 401);
        }
        DB::table('sessions')->where('id', $sessionId)->delete();
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
