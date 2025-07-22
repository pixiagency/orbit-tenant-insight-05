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
            $table->foreignId('contact_id')->constrained('contacts')->onDelete('cascade');
            $table->foreignId('reason_id')->nullable()->constrained('reasons')->onDelete('cascade');// Required if status = 'lost'
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('status', ['open', 'lost', 'won', 'abandoned']);
            $table->decimal('value', 10, 2)->nullable();// Required if status = 'won'
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
