<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Web Development',
                'description' => 'Pelajari teknologi web modern seperti HTML, CSS, JavaScript, React, Laravel, Vue, dan Node.js.',
            ],
            [
                'name' => 'Mobile App Development',
                'description' => 'Membangun aplikasi mobile iOS & Android native dan cross-platform menggunakan Flutter, React Native, Kotlin, dan Swift.',
            ],
            [
                'name' => 'Data Science & Analytics',
                'description' => 'Eksplorasi analisis data, Machine Learning, Python, Pandas, SQL, Tableau, dan visualisasi data interaktif.',
            ],
            [
                'name' => 'UI/UX Design',
                'description' => 'Kuasai prinsip desain antarmuka, user research, wireframing, design system, dan prototyping dengan Figma.',
            ],
            [
                'name' => 'Cloud Computing & DevOps',
                'description' => 'Pelajari CI/CD, Docker, Kubernetes, AWS, Terraform, Linux Server, dan arsitektur microservices.',
            ],
            [
                'name' => 'Artificial Intelligence & ML',
                'description' => 'Deep Learning, Computer Vision, Natural Language Processing, LLM, Prompt Engineering, dan integrasi OpenAI API.',
            ],
            [
                'name' => 'Cyber Security & Ethical Hacking',
                'description' => 'Keamanan jaringan, penetration testing, kriptografi, OWASP Top 10, dan best practices keamanan aplikasi web.',
            ],
            [
                'name' => 'Game Development',
                'description' => 'Pembuatan game 2D & 3D interaktif menggunakan Unity, Unreal Engine, C#, dan konsep game physics.',
            ],
            [
                'name' => 'Database & Backend Engineering',
                'description' => 'Perancangan basis data relasional & NoSQL, query optimization, indexing, Redis caching, dan message broker Kafka.',
            ],
            [
                'name' => 'Software Quality Assurance & Testing',
                'description' => 'Automated testing dengan PHPUnit, Pest, Cypress, Playwright, serta pengujian performa dan load testing.',
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                ]
            );
        }
    }
}
