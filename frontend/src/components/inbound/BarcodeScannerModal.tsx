import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { QrCode, CheckCircle2, XCircle, Scan, Package } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  asnNumber: string;
  onScanComplete: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  asnNumber,
  onScanComplete,
}) => {
  const [barcode, setBarcode] = useState('');
  const [scannedItems, setScannedItems] = useState<Array<{ barcode: string; timestamp: string }>>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!barcode.trim()) {
      alert('Please enter a barcode');
      return;
    }

    // Simulate barcode scanning
    const timestamp = new Date().toLocaleTimeString();
    setScannedItems([...scannedItems, { barcode, timestamp }]);
    onScanComplete(barcode);
    setBarcode('');
    setIsScanning(false);
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    // In a real app, this would activate the device camera or barcode scanner
    // For now, we'll just focus the input
    setTimeout(() => {
      document.getElementById('barcode-input')?.focus();
    }, 100);
  };

  const handleClearHistory = () => {
    setScannedItems([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Barcode Scanner - ${asnNumber}`}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {scannedItems.length > 0 && (
            <Button variant="outline" onClick={handleClearHistory}>
              Clear History
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {/* Scanner Interface */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl">
          <div className="flex flex-col items-center justify-center">
            <div className={`w-24 h-24 ${isScanning ? 'animate-pulse' : ''} bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4`}>
              <QrCode className="w-12 h-12" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-2">
              {isScanning ? 'Ready to Scan' : 'Barcode Scanner'}
            </p>
            <p className="text-sm text-gray-600 mb-4 text-center">
              {isScanning ? 'Enter or scan the barcode below' : 'Click to activate scanner'}
            </p>
            {!isScanning && (
              <Button variant="primary" onClick={handleStartScanning} className="gap-2">
                <Scan className="w-4 h-4" />
                Start Scanning
              </Button>
            )}
          </div>
        </div>

        {/* Manual Input */}
        {isScanning && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Barcode
            </label>
            <div className="flex gap-2">
              <input
                id="barcode-input"
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="Scan or type barcode..."
                autoFocus
              />
              <Button variant="primary" onClick={handleScan} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Scan
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter to scan</p>
          </div>
        )}

        {/* Scanned Items History */}
        {scannedItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Scanned Items ({scannedItems.length})
              </h4>
            </div>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="divide-y divide-gray-200">
                {scannedItems.slice().reverse().map((item, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="font-mono text-sm font-medium text-gray-900">{item.barcode}</span>
                      </div>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {scannedItems.length === 0 && !isScanning && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No items scanned yet</p>
            <p className="text-sm text-gray-500 mt-1">Start scanning to add items</p>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-medium text-blue-900 mb-1">Scanner Instructions</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Click "Start Scanning" to activate the scanner</li>
            <li>• Point the scanner at the barcode or enter manually</li>
            <li>• Each scanned item will be added to the history</li>
            <li>• Use keyboard or external barcode scanner device</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
