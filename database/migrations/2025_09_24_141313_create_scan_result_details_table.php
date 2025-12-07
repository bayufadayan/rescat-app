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
        Schema::create('scan_result_details', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('scan_result_id')->constrained()->onDelete('cascade');
            $table->string('area_name'); // e.g., 'skin', 'eyes', 'ears', etc.
            $table->decimal('confidence_score', 8, 5)->nullable();
            $table->string('label')->nullable(); // e.g., 'Healthy', 'Needs Attention', etc.
            $table->text('description')->nullable(); // Optional detailed description (AI Agents)
            $table->text('advice')->nullable(); // Optional advice or recommendations (AI Agents)
            $table->string('img_roi_area_id')->nullable();
            $table->string('img_roi_area_url')->nullable();
            $table->string('img_gradcam_id')->nullable();
            $table->string('img_gradcam_url')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scan_result_details');
    }
};
