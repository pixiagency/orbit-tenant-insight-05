<?php

use App\Enums\CompanySizes;
use App\Enums\ContactMethods;
use App\Enums\ContactStatus;
use App\Enums\IndustryStatus;
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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('job_title');
            $table->string('department');
            $table->enum('status', ContactStatus::values())->default('active');
            $table->foreignId('source_id')->nullable()->constrained('sources');
            $table->enum('contact_method', ContactMethods::values())->nullable();
            $table->boolean('email_permission');
            $table->boolean('phone_permission');
            $table->boolean('whatsapp_permission');
            $table->string('company_name');
            $table->string('website');
            $table->enum('industry', IndustryStatus::values())->nullable();
            $table->enum('company_size', CompanySizes::values())->nullable();
            $table->string('address');
            $table->foreignId('country_id')->nullable()->constrained('countries')->onDelete('cascade');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('cascade');
            $table->string('state');
            $table->string('zip_code');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->json('tags')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
