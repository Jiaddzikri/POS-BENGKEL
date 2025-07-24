<?php

namespace App\Service\User;

use App\Models\User;
use App\Request\UserAttributeRequest;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{

  public function store(UserAttributeRequest $request)
  {

    $user = DB::transaction((function () use ($request) {
      return User::create([
        'name' => $request->name,
        'email' => $request->email,
        'role' => $request->role,
        'password' => Hash::make($request->password),
        'tenant_id' => $request->tenant_id
      ]);
    }));


    event(new Registered($user));

    return $user;
  }


  public function update(UserAttributeRequest $request, string $id)
  {

    $user = DB::transaction(function () use ($request, $id) {
      $user = User::findOrFail($id);
      $user->update([
        'name' => $request->name,
        'role' => $request->role,
        'tenant_id' => $request->tenant_id
      ]);
      return $user; // return model, bukan hasil update
    });

    return $user;
  }


  public function delete(string $id)
  {
    return DB::transaction((function () use ($id) {
      User::findOrFail($id)->update([
        'is_deleted' => true,
      ]);
    }));
  }
}
