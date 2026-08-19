<?php

namespace Database\Seeders;

use App\Enums\CourseStatus;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::whereHas('roles', fn ($q) => $q->where('name', 'student'))->get();
        $publishedCourses = Course::where('status', CourseStatus::Published)->with(['lessons', 'assignments'])->get();

        if ($students->isEmpty() || $publishedCourses->isEmpty()) {
            return;
        }

        // Varied feedback templates
        $feedbacks = [
            'Implementasi sangat baik dan rapi! Struktur kode sudah mengikuti prinsip Clean Architecture.',
            'Bagus sekali! Logika validasi dan penanganan error sudah komprehensif.',
            'Pengerjaan tugas tuntas dan memuaskan. Tingkatkan lagi performa query database di bagian relasi.',
            'Desain antarmuka responsif dan konsisten dengan sistem token warna. Mantap!',
            'Hasil pengujian coverage melebihi ekspektasi (95%). Kode sangat mudah dibaca.',
        ];

        // 1. Loop through students and enroll them into multiple courses
        foreach ($students as $studentIndex => $student) {
            // Assign 2-4 random published courses per student
            $enrolledCourses = $publishedCourses->random(min(4, $publishedCourses->count()));

            foreach ($enrolledCourses as $courseIndex => $course) {
                $enrollmentDate = now()->subDays(rand(5, 45));
                $totalLessons = $course->lessons->count();

                // Determine progress state based on student and course index
                $progressRatio = match (($studentIndex + $courseIndex) % 4) {
                    0 => 1.0, // 100% Completed
                    1 => 0.66, // ~66% Completed
                    2 => 0.33, // ~33% Completed
                    default => 0.0, // Just enrolled, 0%
                };

                $completedCount = (int) round($totalLessons * $progressRatio);
                $isCompleted = ($completedCount === $totalLessons && $totalLessons > 0);

                $enrollment = Enrollment::firstOrCreate(
                    [
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                    ],
                    [
                        'enrolled_at' => $enrollmentDate,
                        'completed_at' => $isCompleted ? now()->subDays(rand(1, 3)) : null,
                    ]
                );

                // Create Lesson Progress entries
                if ($completedCount > 0) {
                    foreach ($course->lessons->take($completedCount) as $lesson) {
                        LessonProgress::firstOrCreate([
                            'enrollment_id' => $enrollment->id,
                            'lesson_id' => $lesson->id,
                        ], [
                            'completed_at' => now()->subDays(rand(1, 10)),
                        ]);
                    }
                }

                // If course has assignment and student has completed >50%, submit assignment
                $assignment = $course->assignments->first();
                if ($assignment && $progressRatio >= 0.5) {
                    $isGraded = ($progressRatio === 1.0 || $studentIndex % 2 === 0);
                    $grade = $isGraded ? rand(80, 100) : null;
                    $feedback = $isGraded ? $feedbacks[array_rand($feedbacks)] : null;

                    Submission::firstOrCreate(
                        [
                            'assignment_id' => $assignment->id,
                            'user_id' => $student->id,
                        ],
                        [
                            'content' => "Berikut hasil pengerjaan tugas {$assignment->title} oleh {$student->name}. Repository / File demo telah dilampirkan: https://github.com/learners/submission-demo-{$student->id}",
                            'file_path' => null,
                            'grade' => $grade,
                            'feedback' => $feedback,
                            'submitted_at' => now()->subDays(rand(2, 8)),
                            'graded_at' => $isGraded ? now()->subDays(rand(1, 2)) : null,
                        ]
                    );
                }
            }
        }

        // 2. Comprehensive Activity Logs Seeding
        $admin = User::where('email', 'admin@lms.test')->first();
        $instructors = User::whereHas('roles', fn ($q) => $q->where('name', 'instructor'))->get();

        foreach ($publishedCourses as $course) {
            ActivityLog::firstOrCreate(
                [
                    'event' => 'course.created',
                    'subject_type' => Course::class,
                    'subject_id' => $course->id,
                ],
                [
                    'user_id' => $course->user_id,
                    'description' => "Instruktur {$course->instructor?->name} mempublikasikan course: {$course->title}",
                    'properties' => [
                        'title' => $course->title,
                        'category' => $course->category?->name,
                        'status' => $course->status->value,
                    ],
                ]
            );
        }

        if ($admin) {
            ActivityLog::firstOrCreate(
                [
                    'event' => 'system.settings.updated',
                    'subject_type' => User::class,
                    'subject_id' => $admin->id,
                ],
                [
                    'user_id' => $admin->id,
                    'description' => 'Administrator memperbarui konfigurasi sistem dan mailer settings.',
                    'properties' => ['ip' => '127.0.0.1', 'action' => 'update_settings'],
                ]
            );
        }
    }
}
