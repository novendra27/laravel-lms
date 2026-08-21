<?php

namespace App\Policies;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    /**
     * Super Admin bypasses all policy checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view any courses.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the course.
     */
    public function view(?User $user, Course $course): bool
    {
        if ($course->status === CourseStatus::Published) {
            return true;
        }

        return $user && $course->user_id === $user->id;
    }

    /**
     * Determine whether the user can create courses.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('courses.create') || $user->isInstructor();
    }

    /**
     * Determine whether the user can update the course.
     */
    public function update(User $user, Course $course): bool
    {
        return ($user->hasPermission('courses.edit') || $user->isInstructor())
            && $course->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the course.
     */
    public function delete(User $user, Course $course): bool
    {
        return ($user->hasPermission('courses.delete') || $user->isInstructor())
            && $course->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore a soft-deleted course.
     */
    public function restore(User $user, Course $course): bool
    {
        return ($user->hasPermission('courses.delete') || $user->isInstructor())
            && $course->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the course.
     */
    public function forceDelete(User $user, Course $course): bool
    {
        return ($user->hasPermission('courses.delete') || $user->isInstructor())
            && $course->user_id === $user->id;
    }

    /**
     * Determine whether the user can toggle course publication status.
     */
    public function publish(User $user, Course $course): bool
    {
        return ($user->hasPermission('courses.edit') || $user->isInstructor())
            && $course->user_id === $user->id;
    }
}
