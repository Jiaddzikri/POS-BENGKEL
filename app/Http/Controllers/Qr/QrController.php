<?php

namespace App\Http\Controllers\Qr;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Log;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Throwable;

class QrController extends Controller
{
  /**
   * Generate QR Code from text
   *
   * @param string $text
   * @return Response|JsonResponse
   */
  public function generate($text)
  {
    try {
      return $this->generateQrCode($text);

    } catch (Exception $e) {
      AppLog::execption($e);
      Log::error($e->getMessage());

      $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;

      return response()->json([
        'error' => $e->getMessage(),
        'message' => 'Failed to generate QR code'
      ], $statusCode);

    } catch (Throwable $e) {
      AppLog::execption($e);

      return response()->json([
        'error' => 'An unexpected error occurred',
        'message' => 'Failed to generate QR code'
      ], 500);
    }
  }

  /**
   * Generate QR Code with custom size
   *
   * @param string $text
   * @param int $size
   * @return Response|JsonResponse
   */
  public function generateWithSize($text, int $size = 400)
  {
    try {
      // Validate size
      if ($size < 100 || $size > 1000) {
        throw new Exception('QR code size must be between 100 and 1000 pixels', 400);
      }

      return $this->generateQrCode($text, $size);

    } catch (Exception $e) {
      AppLog::execption($e);

      $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;

      return response()->json([
        'error' => $e->getMessage(),
        'message' => 'Failed to generate QR code'
      ], $statusCode);

    } catch (Throwable $e) {
      AppLog::execption($e);

      return response()->json([
        'error' => 'An unexpected error occurred',
        'message' => 'Failed to generate QR code'
      ], 500);
    }
  }

  /**
   * Helper method to generate QR code
   *
   * @param string $text
   * @param int $size
   * @return Response
   * @throws Exception
   */
  private function generateQrCode(string $text, int $size = 400): Response
  {
    // Validate input
    if (empty($text)) {
      throw new Exception('QR code text cannot be empty', 400);
    }

    // Validate text length
    if (strlen($text) > 2953) {
      throw new Exception('Text is too long for QR code generation (max 2953 characters)', 400);
    }

    // Sanitize input
    $text = strip_tags($text);

    // Generate QR code
    $qrCode = QrCode::format('svg')
      ->backgroundColor(255, 255, 255)
      ->margin(10)
      ->size($size)
      ->errorCorrection('H')
      ->generate($text);

    if (!$qrCode) {
      throw new Exception('Failed to generate QR code', 500);
    }

    return response($qrCode)
      ->header('Content-Type', 'image/svg+xml')
      ->header('Cache-Control', 'public, max-age=3600')
      ->header('Content-Disposition', 'inline; filename="qrcode.svg"');
  }
}