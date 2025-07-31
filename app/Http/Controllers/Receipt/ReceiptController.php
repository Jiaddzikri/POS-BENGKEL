<?php

namespace App\Http\Controllers\Receipt;

use App\Http\Controllers\Controller;
use App\Service\Receipt\ReceiptService;
use Barryvdh\DomPDF\Facade\Pdf;
use Log;

class ReceiptController extends Controller
{

    public function __construct(private ReceiptService $receiptService)
    {

    }
    public function downloadReceiptPdf(string $orderId)
    {
        try {
            $transaction = $this->receiptService->getReceiptData($orderId);
            $estimatedHeight = $this->calculateReceiptHeight($transaction);

            Log::info('transaction', ['transaction' => $transaction]);

            $pdf = Pdf::loadView('receipts.template', ['receiptData' => $transaction]);

            $width = 204.09;
            $pdf->setPaper([0, 0, $width, $estimatedHeight], 'portrait');

            $pdf->setOptions([
                'dpi' => 96,
                'defaultFont' => 'Arial',
                'isRemoteEnabled' => false,
                'isHtml5ParserEnabled' => true,
                'margin-top' => 0,
                'margin-right' => 0,
                'margin-bottom' => 0,
                'margin-left' => 0,
            ]);
            Log::info('pdf berhasil digenerate');

            return $pdf->stream('struk-' . $transaction['invoiceNumber'] . '.pdf');
        } catch (\Exception $error) {
            Log::error('error dari  pdf', ["error" => $error->getMessage()]);
            return redirect()->back()->with("error", $error->getMessage());
        }
    }

    private function calculateReceiptHeight(array $receiptData): float
    {
        $lineHeight = 12;
        $padding = 20;

        $lines = 0;
        $lines += 4;

        $lines += $receiptData['buyer'] ? 5 : 3;
        $lines += 1;
        $lines += count($receiptData['items']) * 2;
        $lines += 1;
        $lines += $receiptData['summary']['discount'] > 0 ? 5 : 4;
        $lines += 4;
        $totalHeight = ($lines * $lineHeight) + $padding;
        $minHeight = 200;
        $maxHeight = 600;


        return max($minHeight, min($maxHeight, $totalHeight));
    }
}
