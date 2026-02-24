<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenant = Tenant::where('name', 'Alpinolo Scooter')->firstOrFail();

        User::firstOrCreate(
            ['email' => 'superadmin@alpinoloscooter.com'],
            [
                'name'      => 'Super Admin',
                'password'  => Hash::make('Alpinolo@Scooter2025!'),
                'role'      => 'super_admin',
                'tenant_id' => $tenant->id,
            ]
        );

        $this->command->info('Super admin Alpinolo Scooter telah dibuat!');
        $this->command->info('  Email    : superadmin@alpinoloscooter.com');
        $this->command->info('  Password : Alpinolo@Scooter2025!');
    }
}
