import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

interface ScannerComponentProps {
  onScanSuccess: (decodedText: string) => void;
}

const ScannerComponent: React.FC<ScannerComponentProps> = ({ onScanSuccess }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    if (scannerRef.current) {
      const scanner = new Html5Qrcode(scannerRef.current.id);

      const handleSuccess = (decodedText: string) => {
        scanner.pause();
        setScanResult('berhasil');
        setScanError(null);
        onScanSuccess(decodedText);

        setTimeout(() => {
          setScanResult(null);

          scanner.resume();
        }, 2000);
      };

      const handleError = (errorMessage: string) => {};

      scanner
        .start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, handleSuccess, handleError)
        .catch((err) => console.error('Gagal memulai scanner', err));

      return () => {
        if (scanner && scanner.isScanning) {
          scanner.stop().catch((err) => console.error('Gagal menghentikan scanner.', err));
        }
      };
    }
  }, []);

  return (
    <>
      <div id="qrcode-reader" ref={scannerRef}></div>
      {scanResult && (
        <div className="mt-4 h-16 text-center">
          {scanResult && (
            <div className="rounded-lg bg-green-100 p-2 text-green-700">
              <p className="text-sm font-bold">Scan Berhasil:</p>
              <p className="font-mono">{'berhasil'}</p>
            </div>
          )}
          {scanError && (
            <div className="rounded-lg bg-red-100 p-2 text-red-700">
              <p className="text-sm font-bold">Error:</p>
              <p className="font-mono">{scanError}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ScannerComponent;
