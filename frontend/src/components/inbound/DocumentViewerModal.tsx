import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FileText, Download, Printer, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'asn' | 'bol' | 'packingList' | 'inspection';
  asnNumber: string;
  documents: {
    asn: boolean;
    bol: boolean;
    packingList: boolean;
    inspection: boolean;
  };
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentType,
  asnNumber,
  documents,
}) => {
  const documentNames = {
    asn: 'Advanced Shipping Notice (ASN)',
    bol: 'Bill of Lading (BOL)',
    packingList: 'Packing List',
    inspection: 'Quality Inspection Report',
  };

  const documentAvailable = documents[documentType];

  const handleDownload = () => {
    // Simulate document download
    alert(`Downloading ${documentNames[documentType]} for ${asnNumber}...`);
  };

  const handlePrint = () => {
    // Simulate document printing
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
              <p className="text-sm font-semibold text-gray-900">{asnNumber}</p>
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
            {/* Document Preview Placeholder */}
            <div className="bg-white p-8 min-h-[600px]">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-300 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{documentNames[documentType]}</h2>
                  <p className="text-sm text-gray-600 mt-1">Document Number: {asnNumber}</p>
                  <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Document Body - Simulated Content */}
                <div className="space-y-4">
                  {documentType === 'asn' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Ship From</p>
                          <p className="text-sm text-gray-900 mt-1">Tech Components Inc.</p>
                          <p className="text-xs text-gray-600">1234 Industrial Parkway</p>
                          <p className="text-xs text-gray-600">San Jose, CA 95110</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Ship To</p>
                          <p className="text-sm text-gray-900 mt-1">Distribution Center</p>
                          <p className="text-xs text-gray-600">Los Angeles Warehouse</p>
                          <p className="text-xs text-gray-600">Los Angeles, CA 90001</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipment Details</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Total Items:</p>
                            <p className="font-medium text-gray-900">500</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Pallets:</p>
                            <p className="font-medium text-gray-900">10</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Weight:</p>
                            <p className="font-medium text-gray-900">5,000 lbs</p>
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
                            <p className="text-gray-600">Tracking Number:</p>
                            <p className="font-medium text-gray-900">FXF-2024-8901</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Freight Description</p>
                        <p className="text-sm text-gray-900">Electronic Components - Handle with care</p>
                      </div>
                    </>
                  )}

                  {documentType === 'packingList' && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Items List</p>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-y border-gray-200">
                          <tr>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Item</th>
                            <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Quantity</th>
                            <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Weight</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="py-2 px-3 text-gray-900">Electronic Component A</td>
                            <td className="py-2 px-3 text-right text-gray-900">250</td>
                            <td className="py-2 px-3 text-right text-gray-900">2,500 lbs</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-gray-900">Electronic Component B</td>
                            <td className="py-2 px-3 text-right text-gray-900">250</td>
                            <td className="py-2 px-3 text-right text-gray-900">2,500 lbs</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {documentType === 'inspection' && (
                    <>
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Inspection Results</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-900">Quality Check: Passed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-900">Packaging: Good</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-900">Labeling: Correct</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-900">Documentation: Complete</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Inspector Notes</p>
                        <p className="text-sm text-gray-900">All items inspected and found to be in good condition. No discrepancies noted.</p>
                      </div>
                    </>
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
            <p className="text-sm text-gray-500 mb-6">This document has not been uploaded yet.</p>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
