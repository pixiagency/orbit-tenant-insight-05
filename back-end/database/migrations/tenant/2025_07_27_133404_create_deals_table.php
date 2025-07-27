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
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->enum('deal_type',['product_sale', 'service_sale', 'subscription']);

            // basic info
            $table->string('deal_name');
            $table->foreignId('contact_id')->constrained('contacts');
            $table->date('sale_date');


            // tax info & discount
            $table->enum('discount_type',['percentage','fixed']);
            $table->decimal('discount_value',10,2);
            $table->decimal('tax_rate',10,2);

            // Assignment
            $table->foreignId('assigned_to_id')->constrained('users');
            $table->enum('payment_status', ['paid', 'unpaid', 'partial']);
            $table->foreignId('payment_method_id')->constrained('payment_methods');

            // Notes
            $table->text('notes');
            $table->timestamps();
        });
    }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
