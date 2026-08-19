<?php

namespace Database\Seeders;

use App\Enums\CourseStatus;
use App\Models\Assignment;
use App\Models\Attachment;
use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructor1 = User::where('email', 'instructor@lms.test')->first() ?? User::factory()->instructor()->create();
        $instructor2 = User::where('email', 'dewi@lms.test')->first() ?? User::factory()->instructor()->create();

        // Get categories
        $webCat = Category::where('slug', 'web-development')->first();
        $mobileCat = Category::where('slug', 'mobile-app-development')->first();
        $dataCat = Category::where('slug', 'data-science-analytics')->first();
        $designCat = Category::where('slug', 'uiux-design')->first();
        $cloudCat = Category::where('slug', 'cloud-computing-devops')->first();
        $aiCat = Category::where('slug', 'artificial-intelligence-ml')->first();
        $dbCat = Category::where('slug', 'database-backend-engineering')->first();
        $qaCat = Category::where('slug', 'software-quality-assurance-testing')->first();

        $coursesData = [
            // 1. Web Dev Course (Laravel + React)
            [
                'instructor' => $instructor1,
                'category' => $webCat,
                'title' => 'Mastering Laravel 13 & React Inertia',
                'description' => 'Kursus komprehensif membangun aplikasi fullstack modern dari nol menggunakan Laravel 13, Inertia.js v2, React 19, dan Tailwind CSS v4.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Pengenalan Arsitektur Monolith Modern',
                        'content' => 'Inertia.js menjembatani Laravel dan React tanpa perlu membangun REST API terpisah. Kita akan membahas cara kerja request lifecycle, shared props, dan routing.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Slide-Inertia-Overview.pdf', 'type' => 'application/pdf', 'size' => 1540000],
                            ['name' => 'Cheatsheet-Laravel13.pdf', 'type' => 'application/pdf', 'size' => 840000],
                        ],
                    ],
                    [
                        'title' => 'Database Design, Migration & Seeding',
                        'content' => 'Membangun skema database relasional dengan foreign key constraints, composite indexes, dan seeding data dengan aman.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'ERD-Diagram-Architecture.pdf', 'type' => 'application/pdf', 'size' => 2100000],
                        ],
                    ],
                    [
                        'title' => 'Authentication & Role-Based Access Control',
                        'content' => 'Implementasi autentikasi modern, role middleware, dan granular policy-based authorization dengan admin bypass.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                    [
                        'title' => 'Clean Architecture: Service & DTO Pattern',
                        'content' => 'Menghindari fat controller dengan memindahkan business logic ke Service layer dan membungkus input request menggunakan type-safe DTO.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'DTO-Pattern-Guide.pdf', 'type' => 'application/pdf', 'size' => 950000],
                        ],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Tugas 1: Implementasi Service Layer pada Fitur CRUD',
                        'description' => 'Refactor Controller yang diberikan menjadi clean controller yang mendelegasikan tugas ke FormRequest, DTO, dan Service layer.',
                        'due_date' => now()->addDays(14),
                    ],
                ],
            ],

            // 2. UI/UX Design Course
            [
                'instructor' => $instructor2,
                'category' => $designCat,
                'title' => 'UI/UX Design Masterclass: From Figma to Production',
                'description' => 'Pelajari cara merancang antarmuka aplikasi kelas dunia dengan sistem desain, tokens, auto-layout, dan prototyping interaktif di Figma.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Dasar-Dasar Tipografi & Skala Warna HSL',
                        'content' => 'Memilih font pair yang harmonis dan menyusun palette warna yang memenuhi standar aksesibilitas WCAG AAA.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Color-Palette-Tokens.pdf', 'type' => 'application/pdf', 'size' => 1200000],
                        ],
                    ],
                    [
                        'title' => 'Komponen Reusable & Auto Layout v5',
                        'content' => 'Membuat button, form input, modal, dan card yang responsive dengan Auto Layout dan Component Properties di Figma.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                    [
                        'title' => 'Design Systems & Variable Tokens',
                        'content' => 'Membangun token variabel untuk Dark Mode dan Multi-theme design tokens secara terstruktur.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Figma-Design-Tokens-Kit.fig', 'type' => 'application/octet-stream', 'size' => 4500000],
                        ],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Tugas Desain Dashboard LMS',
                        'description' => 'Buat prototype Figma untuk tampilan Dashboard Siswa dan Course Player lengkap dengan mode gelap & terang.',
                        'due_date' => now()->addDays(10),
                    ],
                ],
            ],

            // 3. Mobile Development Course (Flutter)
            [
                'instructor' => $instructor1,
                'category' => $mobileCat,
                'title' => 'Fullstack Flutter 3 & Clean State Management',
                'description' => 'Membangun aplikasi mobile multiplatform Android & iOS dengan Flutter 3, BLoC pattern, Clean Architecture, dan REST API integration.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Fondasi Widget & State Management di Flutter',
                        'content' => 'Memahami Stateless vs Stateful widget, BuildContext, dan Lifecycle di Flutter.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Flutter-Widget-Tree.pdf', 'type' => 'application/pdf', 'size' => 1100000],
                        ],
                    ],
                    [
                        'title' => 'Implementasi BLoC & Cubit Pattern',
                        'content' => 'Mengelola state aplikasi berskala besar menggunakan flutter_bloc, events, states, dan transitions.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                    [
                        'title' => 'Networking dengan Dio & Error Interceptor',
                        'content' => 'Melakukan request HTTP asinkron, refresh token rotation, dan caching response lokal menggunakan Hive.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Mini Project: Mobile Course Player App',
                        'description' => 'Buat aplikasi mobile Flutter yang menampilkan list course dari API dan dapat memutar video materi.',
                        'due_date' => now()->addDays(18),
                    ],
                ],
            ],

            // 4. Data Science Course (Python)
            [
                'instructor' => $instructor2,
                'category' => $dataCat,
                'title' => 'Python for Data Science & Machine Learning Bootcamp',
                'description' => 'Kuasai NumPy, Pandas, Matplotlib, Scikit-Learn, dan bangun model klasifikasi & regresi prediktif dari dataset nyata.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Data Wrangling & Cleaning dengan Pandas',
                        'content' => 'Membersihkan missing values, filtering outliers, dan aggregasi data dengan Pandas Dataframe.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Dataset-ECommerce-2026.csv', 'type' => 'text/csv', 'size' => 3400000],
                        ],
                    ],
                    [
                        'title' => 'Exploratory Data Analysis (EDA) & Seaborn',
                        'content' => 'Visualisasi korelasi fitur, heatmap, pairplot, dan histogram distribusi data.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                    [
                        'title' => 'Supervised Machine Learning Models',
                        'content' => 'Melatih model Random Forest, Gradient Boosting, dan evaluasi metrik precision, recall, F1-Score, ROC-AUC.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Jupyter-Notebook-Guide.ipynb', 'type' => 'application/json', 'size' => 560000],
                        ],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Tugas Prediksi Churn Pelanggan',
                        'description' => 'Lakukan preprocessing data dan bangun model klasifikasi dengan akurasi minimal 88%. Sertakan file Jupyter Notebook.',
                        'due_date' => now()->addDays(12),
                    ],
                ],
            ],

            // 5. Artificial Intelligence & LLM Course
            [
                'instructor' => $instructor1,
                'category' => $aiCat,
                'title' => 'Building AI Agents with LangChain & OpenAI API',
                'description' => 'Pelajari cara membuat autonomous AI agents, Retrieval Augmented Generation (RAG), vector embeddings, dan Function Calling.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Konsep Prompt Engineering & Function Calling',
                        'content' => 'Menyusun system prompts, few-shot prompting, and structured output formatting JSON schema.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                    [
                        'title' => 'RAG Pipeline dengan Vector DB (Pinecone / Chroma)',
                        'content' => 'Chunking dokumen teks, embedding token generation, dan semantic search similarity retrieval.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'RAG-Architecture-Blueprint.pdf', 'type' => 'application/pdf', 'size' => 1800000],
                        ],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Tugas: AI Customer Support Bot dengan RAG',
                        'description' => 'Integrasikan LLM agent dengan database dokumen PDF untuk menjawab pertanyaan seputar katalog kursus.',
                        'due_date' => now()->addDays(15),
                    ],
                ],
            ],

            // 6. Database Engineering Course
            [
                'instructor' => $instructor2,
                'category' => $dbCat,
                'title' => 'High Performance MySQL & Redis Caching at Scale',
                'description' => 'Optimasi query SQL, explain plans, composite indexes, partition tables, transactions isolation level, dan Redis caching.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Deep Dive B-Tree Indexing & EXPLAIN Analysis',
                        'content' => 'Menganalisis query plan MySQL, menghindari full table scan, dan memilih urutan kolom composite index yang tepat.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'MySQL-Index-CheatSheet.pdf', 'type' => 'application/pdf', 'size' => 780000],
                        ],
                    ],
                    [
                        'title' => 'Redis Cache Invalidation & Pub/Sub',
                        'content' => 'Implementasi Cache Aside pattern, Redis Hash, Rate Limiting, dan queue background jobs.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Tugas Optimasi Query 1 Juta Baris Data',
                        'description' => 'Lakukan tuning query lambat agar waktu eksekusi turun di bawah 50ms menggunakan composite index dan caching.',
                        'due_date' => now()->addDays(9),
                    ],
                ],
            ],

            // 7. Software QA & Automated Testing
            [
                'instructor' => $instructor1,
                'category' => $qaCat,
                'title' => 'Automated Testing with Pest PHP & Cypress E2E',
                'description' => 'Tingkatkan keandalan aplikasi web dengan Unit Testing, Feature Testing di Laravel menggunakan Pest PHP, dan Cypress untuk browser E2E.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Modern PHP Unit & Feature Testing dengan Pest',
                        'content' => 'Menulis test case yang elegan, test datasets, mock service, dan database assertions di Laravel.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Pest-Testing-Patterns.pdf', 'type' => 'application/pdf', 'size' => 920000],
                        ],
                    ],
                    [
                        'title' => 'End-to-End Browser Testing dengan Cypress',
                        'content' => 'Automasi pengujian interaksi pengguna, login flow, modal interactions, dan form validation.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Tugas Test Suite Coverage 90%',
                        'description' => 'Tulis test suite lengkap untuk fitur Course CRUD dan Enrollment dengan coverage minimal 90%.',
                        'due_date' => now()->addDays(11),
                    ],
                ],
            ],

            // 8. DevOps Course (Published)
            [
                'instructor' => $instructor2,
                'category' => $cloudCat,
                'title' => 'Production DevOps: Docker, Nginx & Kubernetes CI/CD',
                'description' => 'Panduan deployment aplikasi web ke server Ubuntu 24.04, multi-stage Docker builds, Nginx reverse proxy, SSL certbot, dan GitHub Actions CI/CD.',
                'status' => CourseStatus::Published,
                'lessons' => [
                    [
                        'title' => 'Multi-Stage Dockerfile untuk PHP 8.4 & Node.js',
                        'content' => 'Mengurangi ukuran docker image produksi hingga 80% menggunakan alpine base dan multistage build.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [
                            ['name' => 'Dockerfile.production', 'type' => 'text/plain', 'size' => 4500],
                        ],
                    ],
                    [
                        'title' => 'Zero-Downtime Deployment dengan GitHub Actions',
                        'content' => 'Otomatisasi git pull, composer install, migrate, cache warm up, and queue restart secara otomatis saat push ke branch main.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                ],
                'assignments' => [
                    [
                        'title' => 'Tugas CI/CD Pipeline Configuration',
                        'description' => 'Buat file github workflow `.github/workflows/deploy.yml` yang menjalankan testing otomatis sebelum deploy ke staging server.',
                        'due_date' => now()->addDays(16),
                    ],
                ],
            ],

            // 9. Draft Course 1
            [
                'instructor' => $instructor1,
                'category' => $webCat,
                'title' => 'Advanced Next.js 15 & Server Components',
                'description' => 'Belajar Next.js App Router, React Server Components (RSC), Server Actions, Parallel Routes, dan optimasi performa web modern.',
                'status' => CourseStatus::Draft,
                'lessons' => [
                    [
                        'title' => 'App Router vs Pages Router Architecture',
                        'content' => 'Struktur folder app router, layout nesting, loading skeletons, dan error boundaries.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                ],
                'assignments' => [],
            ],

            // 10. Draft Course 2
            [
                'instructor' => $instructor2,
                'category' => $aiCat,
                'title' => 'Fine-Tuning Open Source LLMs (Llama 3 & Mistral)',
                'description' => 'Panduan praktis fine-tuning model AI open source dengan LoRA, QLoRA, Hugging Face, dan evaluasi perplexity.',
                'status' => CourseStatus::Draft,
                'lessons' => [
                    [
                        'title' => 'Persiapan Dataset Format Instruction Tuning',
                        'content' => 'Formatting dataset JSONL dengan format Alpaca dan ShareGPT untuk training model.',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'attachments' => [],
                    ],
                ],
                'assignments' => [],
            ],
        ];

        foreach ($coursesData as $cData) {
            $course = Course::firstOrCreate(
                ['slug' => Str::slug($cData['title'])],
                [
                    'user_id' => $cData['instructor']->id,
                    'category_id' => $cData['category']->id,
                    'title' => $cData['title'],
                    'description' => $cData['description'],
                    'status' => $cData['status'],
                    'thumbnail' => null,
                ]
            );

            // Create Lessons
            foreach ($cData['lessons'] as $index => $lData) {
                $lesson = Lesson::firstOrCreate(
                    [
                        'course_id' => $course->id,
                        'title' => $lData['title'],
                    ],
                    [
                        'content' => $lData['content'],
                        'video_url' => $lData['video_url'],
                        'order' => $index + 1,
                    ]
                );

                // Create Attachments
                foreach ($lData['attachments'] as $att) {
                    Attachment::firstOrCreate(
                        [
                            'lesson_id' => $lesson->id,
                            'name' => $att['name'],
                        ],
                        [
                            'file_path' => 'attachments/lessons/'.$att['name'],
                            'file_type' => $att['type'],
                            'file_size' => $att['size'],
                        ]
                    );
                }
            }

            // Create Assignments
            foreach ($cData['assignments'] as $aData) {
                Assignment::firstOrCreate(
                    [
                        'course_id' => $course->id,
                        'title' => $aData['title'],
                    ],
                    [
                        'description' => $aData['description'],
                        'due_date' => $aData['due_date'],
                    ]
                );
            }
        }
    }
}
