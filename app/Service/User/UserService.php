<?php

namespace App\Service\User;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserService
{


  public function delete(string $id)
  {
    return DB::transaction((function () use ($id) {
      User::findOrFail($id)->update([
        'is_deleted' => true,
      ]);
    }));
  }
}
