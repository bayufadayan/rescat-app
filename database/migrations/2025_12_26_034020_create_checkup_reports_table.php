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
        Schema::create('checkup_reports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('scan_session_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUlid('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('category'); // kualitas_foto, hasil_tidak_akurat, identitas_salah, lainnya
            $table->json('reasons')->nullable(); // array alasan: blur, gelap, framing, misdetect, server
            $table->text('description')->nullable();
            $table->string('contact')->nullable(); // email atau whatsapp
            $table->enum('status', ['pending', 'reviewed', 'resolved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable(); // catatan dari admin
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkup_reports');
    }
};
