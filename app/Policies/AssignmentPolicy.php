<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\User;

class AssignmentPolicy
{
    /**
     * Super Admin bypasses all policy checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view the assignment.
     */
    public function view(User $user, Assignment $assignment): bool
    {
        if ($assignment->course->user_id === $user->id) {
            return true;
        }

        return $user->enrollments()->where('course_id', $assignment->course_id)->exists();
    }

    /**
     * Determine whether the user can create an assignment for a course.
     */
    public function create(User $user, Course $course): bool
    {
        return ($user->hasPermission('assignments.manage') || $user->isInstructor())
            && $course->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the assignment.
     */
    public function update(User $user, Assignment $assignment): bool
    {
        return ($user->hasPermission('assignments.manage') || $user->isInstructor())
            && $assignment->course->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the assignment.
     */
    public function delete(User $user, Assignment $assignment): bool
    {
        return ($user->hasPermission('assignments.manage') || $user->isInstructor())
            && $assignment->course->user_id === $user->id;
    }

    /**
     * Determine whether the user can grade submissions for this assignment.
     */
    public function grade(User $user, Assignment $assignment): bool
    {
        return ($user->hasPermission('submissions.grade') || $user->isInstructor())
            && $assignment->course->user_id === $user->id;
    }
}
