<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event',
        'subject_type',
        'subject_id',
        'description',
        'properties',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'properties' => 'array',
        ];
    }

    /**
     * User who triggered the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The polymorphic subject model of the activity.
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Helper to quickly record an activity log entry.
     */
    public static function record(
        string $event,
        Model $subject,
        string $description,
        ?array $properties = null,
        ?int $userId = null
    ): self {
        return self::create([
            'user_id' => $userId ?? Auth::id(),
            'event' => $event,
            'subject_type' => get_class($subject),
            'subject_id' => $subject->getKey(),
            'description' => $description,
            'properties' => $properties,
        ]);
    }
}
