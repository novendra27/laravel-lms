<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Submission>
 */
class SubmissionFactory extends Factory
{
    protected $model = Submission::class;

    public function definition(): array
    {
        return [
            'assignment_id' => Assignment::factory(),
            'user_id' => User::factory()->student(),
            'content' => fake()->paragraphs(2, true),
            'file_path' => null,
            'grade' => null,
            'feedback' => null,
            'submitted_at' => now(),
            'graded_at' => null,
        ];
    }

    public function graded(int $grade = 85, ?string $feedback = 'Well done! Great submission.'): static
    {
        return $this->state(fn (array $attributes) => [
            'grade' => $grade,
            'feedback' => $feedback,
            'graded_at' => now(),
        ]);
    }
}
