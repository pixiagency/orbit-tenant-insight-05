<?php

use App\Enums\TaskStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_title');
            $table->text('description');
            $table->enum('task_type', ['call', 'email', 'meeting', 'task', 'other'])->default('other');
            $table->enum('status', TaskStatus::values())->default('in_progress');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->date('due_date');
            $table->time('due_time');
            $table->foreignId('assigned_to_id')->constrained('users');
            $table->integer('reminder_time')->nullable();
            $table->foreignId('lead_id')->constrained('leads');
            $table->json('tags')->nullable();
            $table->text('additional_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
