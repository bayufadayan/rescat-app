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
        Schema::create('scan_session_images', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('scan_id')->constrained('scan_sessions')->onDelete('cascade');

            $table->string('img_original_id')->nullable();
            $table->string('img_original_url')->nullable();
            $table->string('img_bounding_box_id')->nullable();
            $table->string('img_bounding_box_url')->nullable();
            $table->string('img_roi_id')->nullable();
            $table->string('img_roi_url')->nullable();
            $table->string('img_remove_bg_id')->nullable();
            $table->string('img_remove_bg_url')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scan_session_images');
    }
};
