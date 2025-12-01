import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FileText, Download, Printer, CheckCircle2, AlertCircle } from 'lucide-react';

interface OutboundDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'salesOrder' | 'pickList' | 'packingSlip' | 'bol' | 'invoice' | 'shippingLabel';
  orderNumber: string;
  documents: {
    salesOrder: boolean;
    pickList: boolean;
    packingSlip: boolean;
    bol: boolean;
    invoice: boolean;
    shippingLabel: boolean;
  };
}

export const OutboundDocumentViewerModal: React.FC<OutboundDocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentType,
  orderNumber,
  documents,
}) => {
  const documentNames = {
    salesOrder: 'Sales Order',
    pickList: 'Pick List',
    packingSlip: 'Packing Slip',
    bol: 'Bill of Lading',
    invoice: 'Commercial Invoice',
    shippingLabel: 'Shipping Label',
  };

  const documentAvailable = documents[documentType];

  const handleDownload = () => {
    alert(`Downloading ${documentNames[documentType]} for ${orderNumber}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={documentNames[documentType]}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {documentAvailable && (
            <>
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="primary" onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {/* Document Header */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{orderNumber}</p>
              <p className="text-xs text-gray-600">Document Type: {documentNames[documentType]}</p>
            </div>
            {documentAvailable ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Available</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Not Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Document Content */}
        {documentAvailable ? (
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-white p-8 min-h-[600px]">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-300 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{documentNames[documentType]}</h2>
                  <p className="text-sm text-gray-600 mt-1">Order Number: {orderNumber}</p>
                  <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Document Body */}
                <div className="space-y-4">
                  {documentType === 'salesOrder' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Sold To</p>
                          <p className="text-sm text-gray-900 mt-1">Acme Corporation</p>
                          <p className="text-xs text-gray-600">123 Business Ave</p>
                          <p className="text-xs text-gray-600">New York, NY 10001</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Ship To</p>
                          <p className="text-sm text-gray-900 mt-1">Acme Warehouse</p>
                          <p className="text-xs text-gray-600">456 Warehouse Blvd</p>
                          <p className="text-xs text-gray-600">Brooklyn, NY 11201</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-y border-gray-200">
                            <tr>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Item</th>
                              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Qty</th>
                              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Price</th>
                              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2 px-3 text-gray-900">Product SKU-001</td>
                              <td className="py-2 px-3 text-right text-gray-900">50</td>
                              <td className="py-2 px-3 text-right text-gray-900">$25.00</td>
                              <td className="py-2 px-3 text-right font-medium text-gray-900">$1,250.00</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-3 text-gray-900">Product SKU-002</td>
                              <td className="py-2 px-3 text-right text-gray-900">30</td>
                              <td className="py-2 px-3 text-right text-gray-900">$15.00</td>
                              <td className="py-2 px-3 text-right font-medium text-gray-900">$450.00</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-4 text-right">
                          <p className="text-sm font-bold text-gray-900">Total: $1,700.00</p>
                        </div>
                      </div>
                    </>
                  )}

                  {documentType === 'pickList' && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Items to Pick</p>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-y border-gray-200">
                          <tr>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Item</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Location</th>
                            <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Qty</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Picked</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-2 px-3 text-gray-900">Product SKU-001</td>
                            <td className="py-2 px-3 text-gray-900">A-01-05</td>
                            <td className="py-2 px-3 text-right text-gray-900">50</td>
                            <td className="py-2 px-3 text-center">
                              <input type="checkbox" className="w-4 h-4" />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-gray-900">Product SKU-002</td>
                            <td className="py-2 px-3 text-gray-900">B-02-10</td>
                            <td className="py-2 px-3 text-right text-gray-900">30</td>
                            <td className="py-2 px-3 text-center">
                              <input type="checkbox" className="w-4 h-4" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {documentType === 'packingSlip' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Ship To</p>
                          <p className="text-sm text-gray-900 mt-1">Acme Warehouse</p>
                          <p className="text-xs text-gray-600">456 Warehouse Blvd</p>
                          <p className="text-xs text-gray-600">Brooklyn, NY 11201</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Shipping Method</p>
                          <p className="text-sm text-gray-900 mt-1">FedEx Ground</p>
                          <p className="text-xs text-gray-600">Tracking: FXG123456789</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Package Contents</p>
                        <div className="text-sm space-y-2">
                          <p className="text-gray-900">• Product SKU-001 (Qty: 50)</p>
                          <p className="text-gray-900">• Product SKU-002 (Qty: 30)</p>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Total Boxes:</p>
                            <p className="font-medium text-gray-900">2</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Weight:</p>
                            <p className="font-medium text-gray-900">45.5 lbs</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Items:</p>
                            <p className="font-medium text-gray-900">80</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {documentType === 'bol' && (
                    <>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Carrier Information</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Carrier Name:</p>
                            <p className="font-medium text-gray-900">FedEx Freight</p>
                          </div>
                          <div>
                            <p className="text-gray-600">PRO Number:</p>
                            <p className="font-medium text-gray-900">FXF-2024-OUT-001</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Freight Description</p>
                        <p className="text-sm text-gray-900">Commercial Goods - Standard Packaging</p>
                      </div>
                    </>
                  )}

                  {documentType === 'invoice' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Bill To</p>
                          <p className="text-sm text-gray-900 mt-1">Acme Corporation</p>
                          <p className="text-xs text-gray-600">123 Business Ave</p>
                          <p className="text-xs text-gray-600">New York, NY 10001</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Invoice Details</p>
                          <p className="text-sm text-gray-900 mt-1">Invoice Date: {new Date().toLocaleDateString()}</p>
                          <p className="text-xs text-gray-600">Payment Terms: Net 30</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2 text-gray-900">Subtotal:</td>
                              <td className="py-2 text-right font-medium text-gray-900">$1,700.00</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-900">Shipping:</td>
                              <td className="py-2 text-right font-medium text-gray-900">$25.00</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-900">Tax:</td>
                              <td className="py-2 text-right font-medium text-gray-900">$138.00</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="py-2 font-bold text-gray-900">Total:</td>
                              <td className="py-2 text-right font-bold text-gray-900">$1,863.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {documentType === 'shippingLabel' && (
                    <div className="border-4 border-black p-6">
                      <div className="text-center mb-4">
                        <p className="text-2xl font-bold">FedEx Ground</p>
                        <p className="text-sm">Tracking: FXG123456789</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="font-bold text-sm mb-2">FROM:</p>
                          <p className="text-sm">Your Warehouse</p>
                          <p className="text-xs">Los Angeles, CA 90001</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-2">TO:</p>
                          <p className="text-sm">Acme Warehouse</p>
                          <p className="text-xs">Brooklyn, NY 11201</p>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <div className="bg-gray-200 h-24 flex items-center justify-center">
                          <p className="text-xs text-gray-600">[Barcode Placeholder]</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-300 pt-4 mt-8">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <p>© 2025 Transportation Management System</p>
                    <p>Page 1 of 1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-2">Document Not Available</p>
            <p className="text-sm text-gray-500 mb-6">This document has not been generated yet.</p>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Document
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
