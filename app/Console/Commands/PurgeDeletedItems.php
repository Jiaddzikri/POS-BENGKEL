<?php

namespace App\Console\Commands;

use App\Models\Item;
use Illuminate\Console\Command;

class PurgeDeletedItems extends Command
{
  protected $signature = 'items:purge {--tenant= : Only purge items for a specific tenant ID} {--dry-run : Show what would be deleted without actually deleting}';

  protected $description = 'Permanently delete items that have been soft-deleted (is_deleted = true)';

  public function handle(): int
  {
    $query = Item::where('is_deleted', true);

    if ($tenant = $this->option('tenant')) {
      $query->where('tenant_id', $tenant);
    }

    $count = $query->count();

    if ($count === 0) {
      $this->info('No deleted items found.');
      return self::SUCCESS;
    }

    $this->line("Found <comment>{$count}</comment> soft-deleted item(s).");

    if ($this->option('dry-run')) {
      $query->select('id', 'name', 'sku', 'tenant_id')->get()
        ->each(fn($i) => $this->line("  - [{$i->id}] {$i->name} (SKU: {$i->sku})"));
      $this->warn('Dry run — nothing was deleted.');
      return self::SUCCESS;
    }

    if (!$this->confirm("Permanently delete {$count} item(s)? This cannot be undone.")) {
      $this->info('Aborted.');
      return self::SUCCESS;
    }

    $deleted = $query->delete();

    $this->info("Permanently deleted {$deleted} item(s).");

    return self::SUCCESS;
  }
}
