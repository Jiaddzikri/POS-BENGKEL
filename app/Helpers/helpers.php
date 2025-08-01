<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

if (!function_exists('get_enum_values')) {
  function get_enum_values($table, $field)
  {
    $type = DB::selectOne("SHOW COLUMNS FROM {$table} WHERE Field = ?", [$field])->Type;
    preg_match("/^enum\(\'(.*)\'\)$/", $type, $matches);
    $enum = explode("','", $matches[1]);
    return array_map(
      function ($val) {
        trim($val, "'");
        return [
          'id' => $val,
          'name' => ucwords(str_replace('_', ' ', $val))
        ];
      },
      $enum
    );
  }
}

if (!function_exists('filter_role_by_user')) {
  function filter_role_by_user(array $roleEnums, User $user): array
  {

    $excludedRoles = match ($user->role) {
      'admin' => ['super_admin'],
      'manager' => ['super_admin', 'admin'],
      default => [],
    };

    return array_values(array_filter($roleEnums, function ($role) use ($excludedRoles) {
      return !in_array($role['id'], $excludedRoles);
    }));
  }
}
