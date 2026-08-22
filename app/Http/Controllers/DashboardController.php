<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dynamic role-based dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $stats = [];

        if ($user->isAdmin()) {
            $stats = [
                'type' => 'admin',
                'total_users' => User::count(),
                'total_courses' => Course::count(),
                'total_published_courses' => Course::published()->count(),
                'total_enrollments' => Enrollment::count(),
                'total_submissions' => Submission::count(),
                'recent_activities' => ActivityLog::with('user')->latest()->take(5)->get(),
                'recent_users' => User::with('roles')->latest()->take(5)->get(),
            ];
        } elseif ($user->isInstructor()) {
            $stats = [
                'type' => 'instructor',
                'my_courses_count' => Course::where('user_id', $user->id)->count(),
                'my_published_courses_count' => Course::where('user_id', $user->id)->published()->count(),
                'total_students_enrolled' => Enrollment::whereHas('course', fn ($q) => $q->where('user_id', $user->id))->count(),
                'pending_submissions_count' => Submission::whereNull('grade')->whereHas('assignment.course', fn ($q) => $q->where('user_id', $user->id))->count(),
                'my_recent_courses' => Course::where('user_id', $user->id)
                    ->with('category')
                    ->withCount(['enrollments', 'lessons'])
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        } else {
            // Student stats
            $enrollments = Enrollment::where('user_id', $user->id)
                ->with(['course.instructor', 'course.category', 'course.lessons'])
                ->latest()
                ->take(6)
                ->get();

            $stats = [
                'type' => 'student',
                'enrolled_courses_count' => Enrollment::where('user_id', $user->id)->count(),
                'completed_courses_count' => Enrollment::where('user_id', $user->id)->whereNotNull('completed_at')->count(),
                'in_progress_courses_count' => Enrollment::where('user_id', $user->id)->whereNull('completed_at')->count(),
                'enrolled_courses' => $enrollments->map(fn ($e) => [
                    'id' => $e->id,
                    'course' => $e->course,
                    'enrolled_at' => $e->enrolled_at,
                    'completed_at' => $e->completed_at,
                    'progress_percentage' => $e->progress_percentage,
                ]),
                'upcoming_assignments' => Assignment::whereHas('course.enrollments', fn ($q) => $q->where('user_id', $user->id))
                    ->where('due_date', '>=', now())
                    ->with('course')
                    ->orderBy('due_date')
                    ->take(5)
                    ->get(),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}
