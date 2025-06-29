<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tenant; // <-- Import model Tenant

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tenant::truncate();

        Tenant::create([
            'name' => 'Toko Jaya Abadi',
        ]);

        Tenant::create([
            'name' => 'Bengkel Maju Jaya Motor',
        ]);

        Tenant::create([
            'name' => 'Bengkel Maju Jaya Motor Cabang Tanah Abang',
        ]);
    

        $this->command->info('Tabel tenants berhasil diisi dengan data awal!');
    }
}