<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use Illuminate\Support\Str;

/**
 * Class BlogSeeder
 * * Seeder untuk mengisi data awal artikel blog ke dalam database.
 */
class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $articles = [
            'Tips Aman Bepergian Jarak Jauh',
            'Cara Mudah Reschedule Tiket',
            'Panduan Check-in Online Tanpa Antre'
        ];

        foreach ($articles as $title) {
            Blog::create([
                'title'   => $title,
                'slug'    => Str::slug($title) . '-' . time(),
                'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ini adalah contoh konten artikel untuk keperluan demo aplikasi.',
                'status'  => 'published',
                'category' => 'General' 
            ]);
        }
    }
}