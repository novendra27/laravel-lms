<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'enrolled_at',
        'completed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'enrolled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * The student who is enrolled.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The course enrolled in.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Lesson completion records for this enrollment.
     */
    public function lessonProgresses(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    /**
     * Check if course has been completed.
     */
    public function isCompleted(): bool
    {
        return ! is_null($this->completed_at);
    }

    /**
     * Calculate current completion percentage.
     */
    public function getProgressPercentageAttribute(): int
    {
        $totalLessons = $this->course?->lessons()->count() ?? 0;
        if ($totalLessons === 0) {
            return 0;
        }

        $completedLessons = $this->lessonProgresses()->count();

        return (int) round(($completedLessons / $totalLessons) * 100);
    }
}
