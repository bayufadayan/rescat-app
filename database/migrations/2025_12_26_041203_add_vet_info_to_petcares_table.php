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
        Schema::table('petcares', function (Blueprint $table) {
            $table->string('vet_name')->nullable()->after('opening_hours');
            $table->string('vet_phone')->nullable()->after('vet_name');
            $table->string('vet_specialization')->nullable()->after('vet_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('petcares', function (Blueprint $table) {
            $table->dropColumn(['vet_name', 'vet_phone', 'vet_specialization']);
        });
    }
};
