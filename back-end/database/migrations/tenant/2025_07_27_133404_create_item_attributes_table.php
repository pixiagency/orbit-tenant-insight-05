<?php

use App\Enums\ItemType;
use App\Enums\ServiceDuration;
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
        Schema::create('item_attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_attributes');
    }
};
