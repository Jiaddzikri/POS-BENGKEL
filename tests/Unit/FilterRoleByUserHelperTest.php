<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FilterRoleByUserHelperTest extends TestCase
{
  use RefreshDatabase;

  private function buildEnumRoles(): array
  {
    return [
      ['id' => 'super_admin', 'name' => 'Super Admin'],
      ['id' => 'admin', 'name' => 'Admin'],
      ['id' => 'manager', 'name' => 'Manager'],
      ['id' => 'cashier', 'name' => 'Cashier'],
    ];
  }

  #[Test]
  public function super_admin_can_see_all_roles(): void
  {
    $user = User::factory()->create(['role' => 'super_admin']);

    $result = filter_role_by_user($this->buildEnumRoles(), $user);

    $ids = array_column($result, 'id');
    $this->assertContains('super_admin', $ids);
    $this->assertContains('admin', $ids);
    $this->assertContains('manager', $ids);
    $this->assertContains('cashier', $ids);
    $this->assertCount(4, $result);
  }

  #[Test]
  public function admin_cannot_see_super_admin_role(): void
  {
    $user = User::factory()->create(['role' => 'admin']);

    $result = filter_role_by_user($this->buildEnumRoles(), $user);

    $ids = array_column($result, 'id');
    $this->assertNotContains('super_admin', $ids);
    $this->assertContains('admin', $ids);
    $this->assertContains('manager', $ids);
    $this->assertContains('cashier', $ids);
    $this->assertCount(3, $result);
  }

  #[Test]
  public function manager_cannot_see_super_admin_or_admin_role(): void
  {
    $user = User::factory()->create(['role' => 'manager']);

    $result = filter_role_by_user($this->buildEnumRoles(), $user);

    $ids = array_column($result, 'id');
    $this->assertNotContains('super_admin', $ids);
    $this->assertNotContains('admin', $ids);
    $this->assertContains('manager', $ids);
    $this->assertContains('cashier', $ids);
    $this->assertCount(2, $result);
  }

  #[Test]
  public function cashier_sees_all_roles_by_default(): void
  {
    $user = User::factory()->create(['role' => 'cashier']);

    $result = filter_role_by_user($this->buildEnumRoles(), $user);

    $this->assertCount(4, $result);
  }

  #[Test]
  public function result_is_re_indexed_array(): void
  {
    $user = User::factory()->create(['role' => 'admin']);

    $result = filter_role_by_user($this->buildEnumRoles(), $user);

    $this->assertSame(array_keys($result), range(0, count($result) - 1));
  }
}
