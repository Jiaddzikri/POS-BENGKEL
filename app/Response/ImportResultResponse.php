<?php

namespace App\Response;

class ImportResultResponse
{
  public int $total_rows = 0;
  public int $imported = 0;  // new + updated
  public int $created = 0;
  public int $updated = 0;
  public int $failed = 0;
  /** @var string[] */
  public array $errors = [];

  public function addError(int $row, string $message): void
  {
    $this->errors[] = "Baris {$row}: {$message}";
    $this->failed++;
  }

  public function toArray(): array
  {
    return [
      'total_rows' => $this->total_rows,
      'imported' => $this->imported,
      'created' => $this->created,
      'updated' => $this->updated,
      'failed' => $this->failed,
      'errors' => $this->errors,
    ];
  }
}
