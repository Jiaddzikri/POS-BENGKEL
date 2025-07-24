<?php

namespace App\Http\Controllers\Qr;

use App\Http\Controllers\Controller;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrController extends Controller
{
  public function generate($text)
  {
    $qrCode = QrCode::format('png')->backgroundColor(255, 255, 255)->margin(10)->size(400)->generate($text);

    return response($qrCode)->header('Content-Type', 'image/png');
  }
}