<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <title>Struk Belanja - {{ $receiptData['invoiceNumber'] }}</title>
  <style>
    @page {
      size: 72mm auto;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 10pt;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .receipt-container {
      width: 100% auto;
      min-height: auto;
      margin: 0 auto;
      padding: 10px;
    }

    .header {
      text-align: center;
    }

    .header h2 {
      font-size: 14pt;
      margin: 0;
      text-transform: uppercase;
    }

    .separator {
      border-top: 1px dashed #000;
      margin: 10px 0;
    }

    .info-row,
    .summary-row,
    .item-details {
      display: flex;
      justify-content: space-between;
    }

    .items-table .item-name {
      text-transform: uppercase;
    }

    .summary-row.total {
      font-weight: bold;
      font-size: 12pt;
    }

    .footer {
      text-align: center;
      margin-top: 10px;
      font-size: 8pt;
    }
  </style>
</head>

<body>
  <div class="receipt-container">
    <div class="header">
      <h2>{{ $receiptData['tenant']['name'] }}</h2>
    </div>

    <div class="separator"></div>
    <div>
      <div class="info-row">
        <span>No: {{ $receiptData['invoiceNumber'] }}</span>
        <span>{{ $receiptData['printedAt'] }}</span>
      </div>
      <div class="info-row">
        <span>Kasir: {{ $receiptData['cashier'] }}</span>
        <br>
        @if($receiptData['buyer'])
      <span>Plg: {{ $receiptData['buyer']['name'] }}</span>
    @endif
      </div>
    </div>

    <div class="separator"></div>

    <div class="items-table">
      @foreach($receiptData['items'] as $item)
      <div>
      <div class="item-name">{{ $item['name'] }}</div>
      <div class="item-details">
        <span>{{ $item['quantity'] }} x {{ number_format($item['price'], 0, ',', '.') }}</span>
        <span>{{ number_format($item['total'], 0, ',', '.') }}</span>
      </div>
      </div>
    @endforeach
    </div>

    <div class="separator"></div>

    <div>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>{{ number_format($receiptData['summary']['subtotal'], 0, ',', '.') }}</span>
      </div>
      @if($receiptData['summary']['discount'] > 0)
      <div class="summary-row">
      <span>Diskon</span>
      <span>{{ number_format($receiptData['summary']['discount'], 0, ',', '.') }}%</span>
      </div>
    @endif
      <div class="summary-row total">
        <span>TOTAL</span>
        <span>{{ number_format($receiptData['summary']['total'], 0, ',', '.') }}</span>
      </div>

      <div class="separator"></div>

      <div class="summary-row">
        <span>BAYAR</span>
        <span>{{ number_format($receiptData['summary']['amountPaid'], 0, ',', '.') }}</span>
      </div>
      <div class="summary-row">
        <span>KEMBALI</span>
        <span>{{ number_format($receiptData['summary']['change'], 0, ',', '.') }}</span>
      </div>
    </div>

    <div class="separator"></div>
    <div class="footer">
      <p>TERIMA KASIH</p>
    </div>
  </div>
</body>

</html>