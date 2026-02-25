import { router } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, CheckCircle2, FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface ImportResult {
  total_rows: number;
  imported: number;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

interface ImportItemModalProps {
  open: boolean;
  onClose: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ImportItemModal({ open, onClose }: ImportItemModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────

  const isValidType = (f: File) =>
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv', 'application/csv'].includes(
      f.type,
    ) || /\.(xlsx|xls|csv)$/i.test(f.name);

  const pickFile = (f: File) => {
    if (!isValidType(f)) {
      setServerError('Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv.');
      return;
    }
    setFile(f);
    setResult(null);
    setServerError(null);
  };

  // ── Drag & Drop ───────────────────────────────────────────────────────

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) pickFile(dropped);
  }, []);

  // ── Upload ────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    setServerError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(route('item.import'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(res.data.data as ImportResult);

      // Refresh the item list via Inertia if anything was imported
      if ((res.data.data as ImportResult).imported > 0) {
        router.reload({ only: ['items', 'stats'] });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.file?.[0] ?? err?.response?.data?.message ?? 'Terjadi kesalahan saat mengupload file.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setServerError(null);
    setLoading(false);
    onClose();
  };

  // ── Render ────────────────────────────────────────────────────────────

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold">Import Barang dari Excel</h2>
          </div>
          <button onClick={handleClose} className="rounded p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Required columns hint */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-blue-700">Kolom wajib dalam file:</p>
            <p className="font-mono text-xs leading-relaxed text-blue-600">
              Item Name · Part Number · Category · Brand · Unit · Purchase Price · Selling Price · Initial Stock · Min Stock · Rack Location ·
              Compatibility
            </p>
          </div>

          {/* Drop zone */}
          {!result && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'} `}
            >
              <Upload className={`mb-2 h-8 w-8 ${dragging ? 'text-blue-500' : 'text-gray-400'}`} />
              {file ? (
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-600">
                    Drag &amp; drop file, atau <span className="text-blue-600">klik untuk memilih</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">.xlsx · .xls · .csv — maks. 10 MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) pickFile(f);
                  e.target.value = '';
                }}
              />
            </div>
          )}

          {/* Server / validation error */}
          {serverError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          {/* Result panel */}
          {result && (
            <div className="space-y-3">
              {/* Summary */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Baris', value: result.total_rows, color: 'text-gray-800' },
                  { label: 'Berhasil', value: result.imported, color: 'text-green-700' },
                  { label: 'Dibuat Baru', value: result.created, color: 'text-blue-700' },
                  { label: 'Diperbarui', value: result.updated, color: 'text-amber-700' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-lg border bg-gray-50 px-3 py-2 text-center">
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Success banner */}
              {result.failed === 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-700">Semua baris berhasil diimport!</p>
                </div>
              )}

              {/* Error list */}
              {result.errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="mb-2 text-xs font-semibold text-red-700">{result.failed} baris gagal:</p>
                  <ul className="max-h-40 space-y-1 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-red-600">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <a href={route('item.import.template')} download className="text-xs text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
            Unduh template Excel
          </a>
          <div className="flex gap-2">
            {result ? (
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setServerError(null);
                }}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Import Lagi
              </button>
            ) : (
              <button onClick={handleClose} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                Batal
              </button>
            )}
            {!result && (
              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Import
                  </>
                )}
              </button>
            )}
            {result && (
              <button onClick={handleClose} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Selesai
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
