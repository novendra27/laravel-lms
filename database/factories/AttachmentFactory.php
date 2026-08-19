<?php

namespace Database\Factories;

use App\Models\Attachment;
use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attachment>
 */
class AttachmentFactory extends Factory
{
    protected $model = Attachment::class;

    public function definition(): array
    {
        $extension = fake()->randomElement(['pdf', 'zip', 'docx', 'pptx']);
        $name = fake()->word().'.'.$extension;

        return [
            'lesson_id' => Lesson::factory(),
            'name' => $name,
            'file_path' => 'attachments/lessons/'.$name,
            'file_type' => 'application/'.$extension,
            'file_size' => fake()->numberBetween(102400, 10485760), // 100KB - 10MB
        ];
    }
}
