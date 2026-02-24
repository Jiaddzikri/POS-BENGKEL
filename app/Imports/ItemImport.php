<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Item;
use App\Response\ImportResultResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Flat-product Excel importer.
 *
 * Required columns (case-insensitive):
 *   Item Name | Part Number | Category | Brand | Unit |
 *   Purchase Price | Selling Price | Initial Stock | Min Stock |
 *   Rack Location | Compatibility
 *
 * Upsert key: Part Number (unique per tenant).
 * Each row → one Item row.
 */
class ItemImport implements ToCollection, WithHeadingRow
{
    private string $tenantId;
    private ImportResultResponse $result;

    private const REQUIRED_COLUMNS = [
        'item_name',
        'part_number',
        'category',
        'brand',
        'unit',
        'purchase_price',
        'selling_price',
        'initial_stock',
        'min_stock',
        'rack_location',
        'compatibility',
    ];

    public function __construct(string $tenantId, ImportResultResponse $result)
    {
        $this->tenantId = $tenantId;
        $this->result   = $result;
    }

    public function collection(Collection $rows): void
    {
        if ($rows->isEmpty()) {
            return;
        }

        // ── 1. Header validation ─────────────────────────────────────────
        $actualCols = $rows->first()->keys()
            ->map(fn($k) => Str::lower(trim($k)))->toArray();
        $missing = array_diff(self::REQUIRED_COLUMNS, $actualCols);

        if (!empty($missing)) {
            $this->result->addError(1, 'Header tidak lengkap. Kolom wajib tidak ditemukan: ' . implode(', ', $missing));
            return;
        }

        // ── 2. Category cache ────────────────────────────────────────────
        /** @var array<string, string> $categoryCache lower-name => id */
        $categoryCache = Category::where('tenant_id', $this->tenantId)
            ->where('is_deleted', false)
            ->pluck('id', 'name')
            ->mapWithKeys(fn($id, $name) => [Str::lower(trim($name)) => $id])
            ->toArray();

        // ── 3. Part-number → Item cache ──────────────────────────────────
        /** @var array<string, string> $partCache lower-part_number => item id */
        $partCache = Item::where('tenant_id', $this->tenantId)
            ->where('is_deleted', false)
            ->whereNotNull('part_number')
            ->pluck('id', 'part_number')
            ->mapWithKeys(fn($id, $pn) => [Str::lower(trim($pn)) => $id])
            ->toArray();

        // ── 4. Process rows ───────────────────────────────────────────────
        $rowNumber = 2;

        foreach ($rows as $row) {
            $this->result->total_rows++;
            $data = $this->normalise($row->toArray());

            $rowErrors = $this->validate($data);
            if (!empty($rowErrors)) {
                foreach ($rowErrors as $err) {
                    $this->result->addError($rowNumber, $err);
                }
                $rowNumber++;
                continue;
            }

            DB::transaction(function () use ($data, &$categoryCache, &$partCache) {
                // ── A. Resolve category ──────────────────────────────────
                $catKey = Str::lower($data['category']);
                if (!isset($categoryCache[$catKey])) {
                    $cat = Category::create([
                        'name'       => ucfirst(trim($data['category'])),
                        'tenant_id'  => $this->tenantId,
                        'is_deleted' => false,
                    ]);
                    $categoryCache[$catKey] = $cat->id;
                }
                $categoryId = $categoryCache[$catKey];

                // ── B. Compatibility ────────────────────────────────────
                $compatibility = [];
                if (!empty($data['compatibility'])) {
                    $compatibility = array_values(array_filter(array_map(
                        'trim',
                        preg_split('/[,;\/]/', (string) $data['compatibility'])
                    )));
                }

                // ── C. Upsert by part_number ────────────────────────────
                $partKey = Str::lower($data['part_number']);

                $payload = [
                    'category_id'    => $categoryId,
                    'name'           => trim($data['item_name']),
                    'brand'          => $data['brand'],
                    'purchase_price' => $data['purchase_price'],
                    'selling_price'  => $data['selling_price'],
                    'part_number'    => $data['part_number'],
                    'stock'          => $data['initial_stock'],
                    'minimum_stock'  => $data['min_stock'],
                    'uom'            => $data['unit'],
                    'rack_location'  => $data['rack_location'],
                    'compatibility'  => $compatibility,
                    'is_deleted'     => false,
                ];

                if (isset($partCache[$partKey])) {
                    Item::where('id', $partCache[$partKey])->update($payload);
                    $this->result->updated++;
                } else {
                    $item = Item::create(array_merge($payload, [
                        'tenant_id' => $this->tenantId,
                        'sku'       => strtoupper(Str::random(8)),
                        'status'    => 'active',
                    ]));
                    $partCache[$partKey] = $item->id;
                    $this->result->created++;
                }

                $this->result->imported++;
            });

            $rowNumber++;
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private function normalise(array $raw): array
    {
        $clean = [];
        foreach ($raw as $k => $v) {
            $clean[Str::lower(trim($k))] = is_string($v) ? trim($v) : $v;
        }

        foreach (['purchase_price', 'selling_price'] as $col) {
            if (isset($clean[$col])) {
                $clean[$col] = $this->parsePrice((string) ($clean[$col] ?? ''));
            }
        }

        foreach (['initial_stock', 'min_stock'] as $col) {
            if (isset($clean[$col])) {
                $clean[$col] = (int) preg_replace('/[^0-9]/', '', (string) ($clean[$col] ?? '0'));
            }
        }

        return $clean;
    }

    private function parsePrice(string $value): float
    {
        $cleaned = preg_replace('/[Rp\s\.]/u', '', $value);
        $cleaned = str_replace(',', '.', $cleaned ?? '');
        return (float) $cleaned;
    }

    private function validate(array $data): array
    {
        $errors = [];

        if (empty($data['item_name'])) {
            $errors[] = "'Item Name' tidak boleh kosong.";
        }
        if (empty($data['part_number'])) {
            $errors[] = "'Part Number' tidak boleh kosong.";
        }
        if (!is_numeric($data['purchase_price'] ?? null) || $data['purchase_price'] < 0) {
            $errors[] = "'Purchase Price' tidak valid ('" . ($data['purchase_price'] ?? '') . "').";
        }
        if (!is_numeric($data['selling_price'] ?? null) || $data['selling_price'] <= 0) {
            $errors[] = "'Selling Price' harus lebih dari 0 ('" . ($data['selling_price'] ?? '') . "').";
        }
        if (!isset($data['initial_stock']) || $data['initial_stock'] < 0) {
            $errors[] = "'Initial Stock' tidak valid.";
        }
        if (!isset($data['min_stock']) || $data['min_stock'] < 0) {
            $errors[] = "'Min Stock' tidak valid.";
        }

        return $errors;
    }
}
