<?php

namespace App\Request;

class UserAttributeRequest {
  public string $name;
  public string $email;
  public string $password;
  public string $role;
  public string $tenant_id;
}