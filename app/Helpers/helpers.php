<?php

use Illuminate\Support\Facades\DB;

if (!function_exists('get_enum_values')) {
  function get_enum_values($table, $field)
  {
    $type = DB::selectOne("SHOW COLUMNS FROM {$table} WHERE Field = ?", [$field])->Type;
    preg_match("/^enum\(\'(.*)\'\)$/", $type, $matches);
    $enum = explode("','", $matches[1]);
    return array_map(
      function($val) {
        trim($val, "'");
        return [
          'id' => $val,
          'name' => ucwords(str_replace('_', ' ', $val))
        ];
      }, $enum
    );
  }
}
