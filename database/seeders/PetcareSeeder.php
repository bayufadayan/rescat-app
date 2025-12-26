<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PetcareSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $petcares = [
            [
                'name' => 'Klinik Hewan Satwa Sehat',
                'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'phone' => '021-12345678',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'opening_hours' => [
                    'monday' => '08:00 - 20:00',
                    'tuesday' => '08:00 - 20:00',
                    'wednesday' => '08:00 - 20:00',
                    'thursday' => '08:00 - 20:00',
                    'friday' => '08:00 - 20:00',
                    'saturday' => '09:00 - 17:00',
                    'sunday' => 'Tutup',
                ],
                'vet_name' => 'Dr. Budi Santoso, drh.',
                'vet_phone' => '+62 812-3456-7890',
                'vet_specialization' => 'Kucing & Anjing',
            ],
            [
                'name' => 'Pet Care Indonesia',
                'address' => 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
                'phone' => '021-87654321',
                'latitude' => -6.2297,
                'longitude' => 106.8177,
                'opening_hours' => [
                    'monday' => '09:00 - 21:00',
                    'tuesday' => '09:00 - 21:00',
                    'wednesday' => '09:00 - 21:00',
                    'thursday' => '09:00 - 21:00',
                    'friday' => '09:00 - 21:00',
                    'saturday' => '09:00 - 18:00',
                    'sunday' => '10:00 - 16:00',
                ],
                'vet_name' => 'Dr. Siti Nurhaliza, drh.',
                'vet_phone' => '+62 813-1111-2222',
                'vet_specialization' => 'Kucing',
            ],
            [
                'name' => 'Veterinary Clinic Bandung',
                'address' => 'Jl. Dago No. 78, Bandung',
                'phone' => '022-11223344',
                'latitude' => -6.9175,
                'longitude' => 107.6191,
                'opening_hours' => [
                    'monday' => '08:00 - 19:00',
                    'tuesday' => '08:00 - 19:00',
                    'wednesday' => '08:00 - 19:00',
                    'thursday' => '08:00 - 19:00',
                    'friday' => '08:00 - 19:00',
                    'saturday' => '09:00 - 15:00',
                    'sunday' => 'Tutup',
                ],
                'vet_name' => 'Dr. Ahmad Hidayat, drh., M.Si.',
                'vet_phone' => '+62 821-3333-4444',
                'vet_specialization' => 'Hewan Kecil',
            ],
            [
                'name' => 'Klinik Hewan Surabaya Prima',
                'address' => 'Jl. Basuki Rahmat No. 56, Surabaya',
                'phone' => '031-99887766',
                'latitude' => -7.2575,
                'longitude' => 112.7521,
                'opening_hours' => [
                    'monday' => '07:00 - 20:00',
                    'tuesday' => '07:00 - 20:00',
                    'wednesday' => '07:00 - 20:00',
                    'thursday' => '07:00 - 20:00',
                    'friday' => '07:00 - 20:00',
                    'saturday' => '08:00 - 17:00',
                    'sunday' => '09:00 - 15:00',
                ],
                'vet_name' => 'Dr. Rina Wijaya, drh.',
                'vet_phone' => '+62 838-5555-6666',
                'vet_specialization' => 'Kucing & Anjing',
            ],
            [
                'name' => 'Animal Care Yogyakarta',
                'address' => 'Jl. Malioboro No. 12, Yogyakarta',
                'phone' => '0274-556677',
                'latitude' => -7.7956,
                'longitude' => 110.3695,
                'opening_hours' => [
                    'monday' => '08:00 - 18:00',
                    'tuesday' => '08:00 - 18:00',
                    'wednesday' => '08:00 - 18:00',
                    'thursday' => '08:00 - 18:00',
                    'friday' => '08:00 - 18:00',
                    'saturday' => '09:00 - 16:00',
                    'sunday' => 'Tutup',
                ],
                'vet_name' => 'Dr. Hendra Saputra, drh.',
                'vet_phone' => '+62 819-7777-8888',
                'vet_specialization' => 'Bedah & Gigi',
            ],
            [
                'name' => 'Klinik Hewan Bali Pet',
                'address' => 'Jl. Sunset Road No. 88, Kuta, Bali',
                'phone' => '0361-223344',
                'latitude' => -8.7184,
                'longitude' => 115.1698,
                'opening_hours' => [
                    'monday' => '09:00 - 21:00',
                    'tuesday' => '09:00 - 21:00',
                    'wednesday' => '09:00 - 21:00',
                    'thursday' => '09:00 - 21:00',
                    'friday' => '09:00 - 21:00',
                    'saturday' => '09:00 - 21:00',
                    'sunday' => '10:00 - 18:00',
                ],
                'vet_name' => 'Dr. Made Suryawan, drh.',
                'vet_phone' => '+62 811-9999-0000',
                'vet_specialization' => 'Kucing',
            ],
        ];

        // Hapus data lama jika ada
        \App\Models\Petcare::truncate();

        foreach ($petcares as $petcare) {
            \App\Models\Petcare::create($petcare);
        }
    }
}
