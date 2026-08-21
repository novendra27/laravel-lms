<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    /**
     * Super Admin bypasses all policy checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view the lesson.
     */
    public function view(User $user, Lesson $lesson): bool
    {
        // Instructor who owns the course can view
        if ($lesson->course->user_id === $user->id) {
            return true;
        }

        // Student enrolled in the course can view
        return $user->enrollments()->where('course_id', $lesson->course_id)->exists();
    }

    /**
     * Determine whether the user can create lessons for a course.
     */
    public function create(User $user, Course $course): bool
    {
        return ($user->hasPermission('lessons.create') || $user->isInstructor())
            && $course->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the lesson.
     */
    public function update(User $user, Lesson $lesson): bool
    {
        return ($user->hasPermission('lessons.edit') || $user->isInstructor())
            && $lesson->course->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the lesson.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        return ($user->hasPermission('lessons.delete') || $user->isInstructor())
            && $lesson->course->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore a soft-deleted lesson.
     */
    public function restore(User $user, Lesson $lesson): bool
    {
        return ($user->hasPermission('lessons.delete') || $user->isInstructor())
            && $lesson->course->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the lesson.
     */
    public function forceDelete(User $user, Lesson $lesson): bool
    {
        return ($user->hasPermission('lessons.delete') || $user->isInstructor())
            && $lesson->course->user_id === $user->id;
    }

    /**
     * Determine whether the user can reorder lessons within a course.
     */
    public function reorder(User $user, Course $course): bool
    {
        return ($user->hasPermission('lessons.edit') || $user->isInstructor())
            && $course->user_id === $user->id;
    }
}
