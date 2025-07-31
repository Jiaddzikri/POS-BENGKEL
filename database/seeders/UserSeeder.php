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
            'name' => 'nyanta',
            'email' => 'nyanta123@gmail.com',
            'password' => Hash::make('nyanta123@gmail.com'),
            'role' => 'super_admin'
        ]);

        $this->command->info('Raja iblis di buat!');
    }
}
