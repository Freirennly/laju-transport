<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // LIST SEMUA USER
    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => User::select('id', 'name', 'email', 'role', 'created_at')->get()
        ]);
    }

    // DETAIL USER
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['status' => false, 'message' => 'User not found'], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }

    // TAMBAH USER BARU
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,staff,user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role
        ]);

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    // UPDATE USER / ROLE
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['status' => false, 'message' => 'User not found'], 404);
        }

        // Cegah admin menurunkan role sendiri
        if ($user->id === $request->user()->id && $request->has('role') && $request->role !== 'admin') {
            return response()->json(['status' => false, 'message' => 'Anda tidak boleh menurunkan role Anda sendiri'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,'.$id,
            'role' => 'sometimes|in:admin,staff,user',
            'password' => 'sometimes|min:6'
        ]);

        $data = $request->only('name', 'email', 'role');
        
        if ($request->has('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return response()->json([
            'status' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    // DELETE USER
    public function destroy(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['status' => false, 'message' => 'User not found'], 404);
        }

        // Cegah admin menghapus akun sendiri
        if ($user->id === $request->user()->id) {
            return response()->json(['status' => false, 'message' => 'Tidak dapat menghapus akun sendiri'], 403);
        }

        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}