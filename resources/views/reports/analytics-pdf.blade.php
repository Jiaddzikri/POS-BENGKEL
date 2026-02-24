<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <title>Laporan Analitik – {{ $tenant?->name ?? 'Bengkel' }}</title>
  <style>
    /* ── Reset & Base ────────────────────────────────────────── */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Helvetica, Arial, sans-serif;
      font-size: 8.5pt;
      color: #1e293b;
      background: #ffffff;
    }

    /* ── Brand colours ───────────────────────────────────────── */
    :root {
      --brand: #1d4ed8;
      /* blue-700 */
      --brand-light: #eff6ff;
      /* blue-50  */
      --brand-mid: #93c5fd;
      /* blue-300 */
      --accent: #0f172a;
      /* slate-900 */
      --muted: #64748b;
      /* slate-500 */
      --border: #e2e8f0;
      /* slate-200 */
      --row-alt: #f8fafc;
      /* slate-50  */
      --green: #16a34a;
      --red: #dc2626;
    }

    /* ── Page & Margin ───────────────────────────────────────── */
    @page {
      size: A4 landscape;
      margin: 14mm 12mm 18mm 12mm;
    }

    /* ── Header ──────────────────────────────────────────────── */
    .page-header {
      width: 100%;
      border-bottom: 3px solid #1d4ed8;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }

    .header-inner {
      display: table;
      width: 100%;
    }

    .header-logo-cell {
      display: table-cell;
      width: 58px;
      vertical-align: middle;
    }

    .logo-box {
      width: 50px;
      height: 50px;
      background: #1d4ed8;
      border-radius: 6px;
      text-align: center;
      color: #fff;
      font-size: 18pt;
      font-weight: bold;
      line-height: 50px;
    }

    .header-info-cell {
      display: table-cell;
      vertical-align: middle;
      padding-left: 10px;
    }

    .header-info-cell h1 {
      font-size: 13pt;
      font-weight: bold;
      color: #1d4ed8;
      letter-spacing: 0.5px;
    }

    .header-info-cell .sub {
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 1px;
    }

    .header-right-cell {
      display: table-cell;
      vertical-align: middle;
      text-align: right;
    }

    .header-right-cell .report-title {
      font-size: 10pt;
      font-weight: bold;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .header-right-cell .period-badge {
      display: inline-block;
      background: #eff6ff;
      border: 1px solid #93c5fd;
      color: #1d4ed8;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 7.5pt;
      margin-top: 4px;
    }

    /* ── Section title ───────────────────────────────────────── */
    .section-title {
      font-size: 8pt;
      font-weight: bold;
      color: #1d4ed8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin: 10px 0 4px 0;
      border-left: 3px solid #1d4ed8;
      padding-left: 6px;
    }

    /* ── Executive Summary ───────────────────────────────────── */
    .exec-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }

    .exec-table td {
      width: 20%;
      border: 1px solid #e2e8f0;
      padding: 7px 10px;
      vertical-align: top;
    }

    .exec-table .kpi-label {
      font-size: 7pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .exec-table .kpi-value {
      font-size: 10.5pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 3px;
    }

    .exec-table .kpi-icon {
      font-size: 14pt;
      color: #1d4ed8;
    }

    .exec-table td:nth-child(odd) {
      background: #eff6ff;
    }

    .exec-table td:nth-child(even) {
      background: #f8fafc;
    }

    /* ── Detail Table ────────────────────────────────────────── */
    .detail-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.5pt;
    }

    .detail-table thead tr {
      background: #1d4ed8;
      color: #ffffff;
    }

    .detail-table thead th {
      padding: 5px 6px;
      text-align: left;
      font-weight: bold;
      font-size: 7pt;
      letter-spacing: 0.3px;
    }

    .detail-table thead th.right {
      text-align: right;
    }

    .detail-table thead th.center {
      text-align: center;
    }

    .detail-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
    }

    .detail-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    .detail-table tbody td {
      padding: 4px 6px;
      vertical-align: middle;
    }

    .detail-table tbody td.right {
      text-align: right;
    }

    .detail-table tbody td.center {
      text-align: center;
    }

    .detail-table tbody td.muted {
      color: #64748b;
    }

    /* Transaction group separator */
    .tx-group-header td {
      background: #eff6ff !important;
      border-top: 1.5px solid #93c5fd;
      font-weight: bold;
      color: #1e40af;
      font-size: 7pt;
      padding: 3px 6px;
    }

    /* Profit margin pill */
    .pill-green {
      background: #dcfce7;
      color: #16a34a;
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 6.5pt;
      font-weight: bold;
    }

    .pill-red {
      background: #fee2e2;
      color: #dc2626;
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 6.5pt;
      font-weight: bold;
    }

    /* Part number mono */
    .mono {
      font-family: 'Courier New', monospace;
      font-size: 7pt;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 1px 4px;
    }

    /* ── Grand Total Row ─────────────────────────────────────── */
    .grand-total-row td {
      background: #1d4ed8 !important;
      color: #ffffff !important;
      font-weight: bold;
      font-size: 8.5pt;
      padding: 6px 6px;
      border-top: 2px solid #1e40af;
    }

    .grand-total-row td.right {
      text-align: right;
    }

    /* ── Footer ──────────────────────────────────────────────── */
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 14mm;
      border-top: 1.5px solid #e2e8f0;
      padding: 4px 12mm 0 12mm;
    }

    .footer-inner {
      display: table;
      width: 100%;
    }

    .footer-left {
      display: table-cell;
      vertical-align: middle;
      font-size: 7pt;
      color: #64748b;
    }

    .footer-center {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      font-size: 7pt;
      color: #64748b;
    }

    .footer-right {
      display: table-cell;
      text-align: right;
      vertical-align: middle;
      font-size: 7pt;
      color: #64748b;
    }

    .footer-right .page-counter::after {
      content: counter(page) ' / ' counter(pages);
    }

    /* Page counter */
    @page {
      counter-reset: page;
    }

    body {
      counter-increment: page;
    }
  </style>
</head>

<body>

  {{-- ═══════════ FOOTER (fixed, repeats on every page) ═══════════ --}}
  <div class="page-footer">
    <div class="footer-inner">
      <div class="footer-left">
        Dicetak oleh: <strong>{{ $printedBy }}</strong> &nbsp;·&nbsp; {{ $printedAt }}
      </div>
      <div class="footer-center">
        {{ $tenant?->name ?? 'Bengkel' }} &nbsp;·&nbsp; Laporan Analitik &amp; Penjualan
      </div>
      <div class="footer-right">
        Halaman <span class="page-counter"></span>
      </div>
    </div>
  </div>

  {{-- ═══════════ HEADER ═══════════ --}}
  <div class="page-header">
    <div class="header-inner">
      <div class="header-logo-cell">
        <div class="logo-box">
          {{ strtoupper(substr($tenant?->name ?? 'B', 0, 1)) }}
        </div>
      </div>
      <div class="header-info-cell">
        <h1>{{ $tenant?->name ?? 'Bengkel' }}</h1>
        <div class="sub">Sistem POS Bengkel</div>
      </div>
      <div class="header-right-cell">
        <div class="report-title">Laporan Analitik &amp; Penjualan</div>
        <div class="period-badge">Periode: {{ $periodLabel }}</div>
        @if(isset($orderTypeLabel) && $orderTypeLabel !== 'Semua')
          <div class="period-badge" style="margin-top:3px; background:#f0fdf4; border-color:#86efac; color:#16a34a;">
            Tipe Pesanan: {{ $orderTypeLabel }}
          </div>
        @endif
      </div>
    </div>
  </div>

  {{-- ═══════════ EXECUTIVE SUMMARY ═══════════ --}}
  <div class="section-title">Executive Summary</div>
  <table class="exec-table">
    <tr>
      <td>
        <div class="kpi-label">Total Pendapatan</div>
        <div class="kpi-value">Rp {{ number_format($revenue, 0, ',', '.') }}</div>
      </td>
      <td>
        <div class="kpi-label">Total Transaksi</div>
        <div class="kpi-value">{{ number_format($totalTransaction, 0, ',', '.') }}</div>
      </td>
      <td>
        <div class="kpi-label">Laba Kotor (COGS)</div>
        <div class="kpi-value">Rp {{ number_format($grossProfit, 0, ',', '.') }}</div>
      </td>
      <td>
        <div class="kpi-label">Total Profit (Margin)</div>
        <div class="kpi-value" style="color: {{ $totalProfit >= 0 ? '#16a34a' : '#dc2626' }}">
          Rp {{ number_format($totalProfit, 0, ',', '.') }}
        </div>
      </td>
      <td>
        <div class="kpi-label">Rata-rata / Transaksi</div>
        <div class="kpi-value">Rp {{ number_format($avgTransaction, 0, ',', '.') }}</div>
      </td>
    </tr>
  </table>

  {{-- ═══════════ DETAIL TRANSAKSI ═══════════ --}}
  <div class="section-title">Detail Transaksi</div>

  <table class="detail-table">
    <thead>
      <tr>
        <th style="width:3%">No</th>
        <th style="width:9%">Tanggal</th>
        <th style="width:10%">ID Transaksi</th>
        <th style="width:10%">Pelanggan</th>
        <th style="width:10%">Part Number</th>
        <th style="width:18%">Item / Varian</th>
        <th class="center" style="width:4%">Qty</th>
        <th class="right" style="width:10%">Harga Satuan</th>
        <th class="right" style="width:10%">Subtotal</th>
        <th class="center" style="width:7%">Margin</th>
      </tr>
    </thead>
    <tbody>
      @php
        $currentTxId = null;
        $txRowCount = 0;
        $txSubtotal = 0;
      @endphp

      @foreach($detailRows as $row)
        @if($currentTxId !== $row['tx_id'])
          {{-- Transaction group header --}}
          <tr class="tx-group-header">
            <td colspan="10">
              &#9654; {{ $row['tx_id'] }} &nbsp;&mdash;&nbsp; {{ $row['date'] }}
              &nbsp;|&nbsp; Pelanggan: {{ $row['buyer'] }}
            </td>
          </tr>
          @php $currentTxId = $row['tx_id']; @endphp
        @endif

        <tr>
          <td>{{ $row['no'] }}</td>
          <td class="muted">{{ $row['date'] }}</td>
          <td class="muted" style="font-size:6.5pt">{{ $row['tx_id'] }}</td>
          <td>{{ $row['buyer'] }}</td>
          <td>
            @if($row['part_number'] !== '—')
              <span class="mono">{{ $row['part_number'] }}</span>
            @else
              <span class="muted">—</span>
            @endif
          </td>
          <td>{{ $row['item'] }}</td>
          <td class="center">{{ $row['qty'] }}</td>
          <td class="right">{{ number_format($row['unit_price'], 0, ',', '.') }}</td>
          <td class="right">{{ number_format($row['subtotal'], 0, ',', '.') }}</td>
          <td class="center">
            @if($row['margin_pct'] >= 0)
              <span class="pill-green">{{ $row['margin_pct'] }}%</span>
            @else
              <span class="pill-red">{{ $row['margin_pct'] }}%</span>
            @endif
          </td>
        </tr>
      @endforeach

      {{-- Grand Total ─────────────────── --}}
      <tr class="grand-total-row">
        <td colspan="8">GRAND TOTAL</td>
        <td class="right">Rp {{ number_format($grandTotal, 0, ',', '.') }}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

</body>

</html>