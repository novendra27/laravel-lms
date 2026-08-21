<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\Submission;
use App\Models\User;

class SubmissionPolicy
{
    /**
     * Super Admin bypasses all policy checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view any submissions.
     */
    public function viewAny(User $user): bool
    {
        return $user->isInstructor() || $user->isStudent();
    }

    /**
     * Determine whether the user can view the specific submission.
     */
    public function view(User $user, Submission $submission): bool
    {
        // Student who submitted
        if ($submission->user_id === $user->id) {
            return true;
        }

        // Instructor who owns the course of this assignment
        return $submission->assignment->course->user_id === $user->id;
    }

    /**
     * Determine whether the student can submit an assignment.
     */
    public function create(User $user, Assignment $assignment): bool
    {
        // Must be enrolled in the course
        $isEnrolled = $user->enrollments()
            ->where('course_id', $assignment->course_id)
            ->exists();

        if (! $isEnrolled) {
            return false;
        }

        // Must not have already submitted (1 submission per student per assignment)
        return ! $assignment->submissions()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Determine whether the student can update/resubmit their submission.
     */
    public function update(User $user, Submission $submission): bool
    {
        // Only the student owner can update
        if ($submission->user_id !== $user->id) {
            return false;
        }

        // Cannot edit if already graded by instructor
        return ! $submission->isGraded();
    }

    /**
     * Determine whether the student can delete their submission.
     */
    public function delete(User $user, Submission $submission): bool
    {
        return $submission->user_id === $user->id && ! $submission->isGraded();
    }

    /**
     * Determine whether the instructor can grade the submission.
     */
    public function grade(User $user, Submission $submission): bool
    {
        return ($user->hasPermission('submissions.grade') || $user->isInstructor())
            && $submission->assignment->course->user_id === $user->id;
    }
}
