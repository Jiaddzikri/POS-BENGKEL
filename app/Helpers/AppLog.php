<?php


namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class AppLog
{

  private static function baseContext(array $context = [])
  {
    return array_merge([
      'user_id' => auth()->user()?->id,
      'ip_address' => Request::ip()
    ], $context);
  }

  public static function info($message, array $context = [])
  {
    Log::channel('app')->info($message, self::baseContext($context));
  }

  public static function warning($message, array $context = [])
  {
    Log::channel('app')->warning($message, self::baseContext($context));
  }

  public static function error($message, array $context = [])
  {
    Log::channel('app')->error($message, self::baseContext($context));
  }

  public static function execption(\Throwable $e)
  {
    Log::channel('app')->error($e->getMessage(), [
      'file' => $e->getFile(),
      'line' => $e->getLine(),
      'trace' => $e->getTraceAsString(),
    ]);
  }
}
