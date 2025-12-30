<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Blog;

class BlogController extends Controller
{
    // PUBLIC: LIST BLOG (Hanya yang Published)
    public function index(Request $request)
    {
        $query = Blog::where('status', 'published');
        
        // Fitur Filter Kategori
        if ($request->has('category') && $request->input('category') != '') {
            $query->where('category', $request->input('category'));
        }

        // Fitur Search
        if ($request->has('search') && $request->input('search') != '') {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }

        return response()->json($query->latest()->get());
    }

    // PUBLIC: DETAIL BLOG
    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($blog);
    }

    // ADMIN: LIST ALL (Termasuk Draft)
    public function adminIndex()
    {
        return response()->json(Blog::latest()->get());
    }

    // ADMIN: CREATE
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'category' => 'required|string'
        ]);

        // FIX: Gunakan $request->input() untuk menghindari konflik properti protected
        $blog = Blog::create([
            'title' => $request->input('title'),
            'slug' => Str::slug($request->input('title')) . '-' . time(),
            'content' => $request->input('content'), // <-- Ini yang bikin error sebelumnya
            'status' => $request->input('status'),
            'category' => $request->input('category')
        ]);

        return response()->json([
            'message' => 'Artikel berhasil dibuat',
            'data' => $blog
        ], 201);
    }

    // ADMIN: UPDATE
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string',
            'content' => 'sometimes|string',
            'status' => 'sometimes|in:draft,published',
            'category' => 'sometimes|string'
        ]);

        $blog->update([
            'title' => $request->input('title', $blog->title),
            'slug' => $request->has('title') ? Str::slug($request->input('title')) . '-' . time() : $blog->slug,
            'content' => $request->input('content', $blog->content), // <-- Aman
            'status' => $request->input('status', $blog->status),
            'category' => $request->input('category', $blog->category),
        ]);

        return response()->json([
            'message' => 'Artikel berhasil diperbarui',
            'data' => $blog
        ]);
    }

    // ADMIN: DELETE
    public function destroy($id)
    {
        Blog::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Artikel berhasil dihapus'
        ]);
    }
}