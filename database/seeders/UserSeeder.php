<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'superadmin',
            'email' => 'superadmin321@gmail.com',
            'password' => Hash::make('agreindra321@gmail.com'),
            'role' => 'super_admin'
        ]);

        // $this->command->info('Raja iblis di buat!');
        $this->command->info('Super admin telah dibuat!');
    }
}
