import React, { useEffect, type ReactNode } from 'react';
import { Button } from './ui/button';

interface PdfWrapperProps {
  children: ReactNode;
  filename?: string;
}

const BackIcon = () => (
  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PrintIcon = () => (
  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
);

const PdfWrapper: React.FC<PdfWrapperProps> = ({ children, filename = 'report' }) => {
  const isPrintMode = new URLSearchParams(window.location.search).get('print') === 'true';

  useEffect(() => {
    if (isPrintMode) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPrintMode]);

  const handlePrint = (): void => {
    window.print();
  };

  const handleBack = (): void => {
    if (window.opener) {
      window.close();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen">
      {!isPrintMode && (
        <div className="no-print sticky top-0 z-10 border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleBack}
                  className="inline-flex items-center rounded-md border px-3 py-2 text-sm leading-4 font-medium shadow-sm outline-none"
                >
                  <BackIcon />
                  Kembali
                </Button>
                <h1 className="text-lg font-semibold">Preview Laporan</h1>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handlePrint}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  <PrintIcon />
                  Print / Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="printable-content">{children}</main>
    </div>
  );
};

export default PdfWrapper;
