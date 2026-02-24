<?php

namespace Tests\Unit;

use App\Http\Middleware\RoleMiddleware;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
  use RefreshDatabase;

  private function makeMiddleware(): RoleMiddleware
  {
    return new RoleMiddleware();
  }

  private function makeRequest(): Request
  {
    return Request::create('/test', 'GET');
  }

  private function makeNext(): \Closure
  {
    return fn($req) => new Response('OK', 200);
  }

  #[Test]
  public function it_allows_user_with_matching_role(): void
  {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $response = $this->makeMiddleware()->handle(
      $this->makeRequest(),
      $this->makeNext(),
      'admin',
      'manager'
    );

    $this->assertEquals(200, $response->getStatusCode());
  }

  #[Test]
  public function it_blocks_user_with_non_matching_role(): void
  {
    $user = User::factory()->create(['role' => 'cashier']);
    $this->actingAs($user);

    $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

    $this->makeMiddleware()->handle(
      $this->makeRequest(),
      $this->makeNext(),
      'admin',
      'manager'
    );
  }

  #[Test]
  public function it_blocks_unauthenticated_requests(): void
  {
    $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

    $this->makeMiddleware()->handle(
      $this->makeRequest(),
      $this->makeNext(),
      'admin'
    );
  }

  #[Test]
  public function it_allows_super_admin_when_listed(): void
  {
    $user = User::factory()->create(['role' => 'super_admin']);
    $this->actingAs($user);

    $response = $this->makeMiddleware()->handle(
      $this->makeRequest(),
      $this->makeNext(),
      'super_admin',
      'admin'
    );

    $this->assertEquals(200, $response->getStatusCode());
  }

  #[Test]
  public function it_allows_manager_when_listed(): void
  {
    $user = User::factory()->create(['role' => 'manager']);
    $this->actingAs($user);

    $response = $this->makeMiddleware()->handle(
      $this->makeRequest(),
      $this->makeNext(),
      'super_admin',
      'admin',
      'manager'
    );

    $this->assertEquals(200, $response->getStatusCode());
  }

  #[Test]
  public function it_blocks_cashier_from_manager_only_route(): void
  {
    $user = User::factory()->create(['role' => 'cashier']);
    $this->actingAs($user);

    $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

    $this->makeMiddleware()->handle(
      $this->makeRequest(),
      $this->makeNext(),
      'super_admin',
      'admin',
      'manager'
    );
  }
}
