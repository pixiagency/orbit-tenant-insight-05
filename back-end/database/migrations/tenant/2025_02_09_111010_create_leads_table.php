<?php

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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('opportunity_name');
            $table->string('company');
            $table->foreignId('contact_id')->constrained('contacts')->onDelete('cascade');
            $table->string('email');
            $table->string('phone');
            $table->foreignId('source_id')->constrained('sources')->onDelete('cascade');
            $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');

            // Opportunity Details
            $table->enum('status', ['Active', 'lost', 'won', 'abandoned']);
            $table->foreignId('stage_id')->constrained('stages')->onDelete('cascade');
            $table->decimal('deal_value', 10, 2);
            $table->decimal('win_probability', 10, 2);
            $table->date('expected_close_date');
            $table->foreignId('assigned_to_id')->nullable()->constrained('users')->onDelete('cascade'); // Required if status = 'lost'
            $table->text('notes')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
