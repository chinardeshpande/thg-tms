import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ReceivingModal, ReceivingData } from '../components/inbound/ReceivingModal';
import { BarcodeScannerModal } from '../components/inbound/BarcodeScannerModal';
import { DocumentViewerModal } from '../components/inbound/DocumentViewerModal';
import {
  ArrowLeft,
  ArrowDownToLine,
  Package,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  Download,
  Edit,
  Warehouse,
  PackageCheck,
  AlertTriangle,
  Thermometer,
  Weight,
  Box,
  ClipboardList,
  Navigation,
  QrCode,
  Printer,
} from 'lucide-react';

// Reusing interface from Inbound page
interface Supplier {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

interface InboundShipment {
  id: string;
  asnNumber: string;
  poNumber: string;
  supplier: Supplier;
  status: 'Scheduled' | 'In Transit' | 'At Dock' | 'Receiving' | 'Completed' | 'Delayed' | 'Exception';
  appointmentTime: string;
  actualArrivalTime?: string;
  estimatedArrival?: string;
  dockNumber?: string;
  receivingBay?: string;
  totalItems: number;
  totalPallets: number;
  totalWeight: number;
  receivedItems: number;
  carrier: string;
  vehicleNumber?: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  shipmentType: 'Purchase Order' | 'Transfer' | 'Return to Vendor' | 'Cross-Dock';
  priority: 'Standard' | 'Urgent' | 'Critical';
  requiresInspection: boolean;
  temperatureControlled: boolean;
  hazmat: boolean;
  notes?: string;
  documents: {
    asn: boolean;
    bol: boolean;
    packingList: boolean;
    inspection: boolean;
  };
}

const InboundDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Modal states
  const [showReceiving, setShowReceiving] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<'asn' | 'bol' | 'packingList' | 'inspection'>('asn');

  // Mock data - in real app, fetch based on id
  const [shipment] = useState<InboundShipment>({
    id: '1',
    asnNumber: 'ASN-2024-001',
    poNumber: 'PO-2024-5678',
    supplier: {
      id: 'SUP-001',
      name: 'Tech Components Inc.',
      code: 'TCI-001',
      address: '1234 Industrial Parkway',
      city: 'San Jose',
      state: 'CA',
      country: 'USA',
      postalCode: '95110',
      contact: {
        name: 'Robert Chen',
        phone: '+1 (408) 555-0123',
        email: 'robert.chen@techcomponents.com',
      },
    },
    status: 'Receiving',
    appointmentTime: '2025-11-29 02:00 PM',
    actualArrivalTime: '2025-11-29 02:05 PM',
    dockNumber: 'DOCK-A1',
    receivingBay: 'BAY-03',
    totalItems: 500,
    totalPallets: 10,
    totalWeight: 5000,
    receivedItems: 320,
    carrier: 'FedEx Freight',
    vehicleNumber: 'VEH-001',
    trackingNumber: 'FXF-2024-8901',
    origin: 'San Jose, CA',
    destination: 'Los Angeles Distribution Center',
    shipmentType: 'Purchase Order',
    priority: 'Standard',
    requiresInspection: true,
    temperatureControlled: false,
    hazmat: false,
    documents: {
      asn: true,
      bol: true,
      packingList: true,
      inspection: false,
    },
    notes: 'Electronics - handle with care',
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Transit': 'bg-purple-100 text-purple-800 border-purple-200',
      'At Dock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Receiving': 'bg-orange-100 text-orange-800 border-orange-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Delayed': 'bg-red-100 text-red-800 border-red-200',
      'Exception': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const receivingProgress = (shipment.receivedItems / shipment.totalItems) * 100;

  // Handler functions
  const handleReceiving = (data: ReceivingData) => {
    console.log('Receiving data:', data);
    alert(`Successfully received ${data.itemsReceived} items!\nCondition: ${data.condition}\nReceived by: ${data.receivedBy}`);
  };

  const handleBarcodeScanned = (barcode: string) => {
    console.log('Scanned barcode:', barcode);
  };

  const handleViewDocument = (docType: 'asn' | 'bol' | 'packingList' | 'inspection') => {
    setSelectedDocument(docType);
    setShowDocumentViewer(true);
  };

  const handlePrintLabel = () => {
    window.print();
  };

  const handleExport = () => {
    const data = JSON.stringify(shipment, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shipment.asnNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = () => {
    alert('Edit functionality - Update shipment details');
  };

  const handleTrackShipment = () => {
    navigate(`/tracking/${shipment.id}`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/inbound')}
          className="gap-1.5 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inbound
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ArrowDownToLine className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{shipment.asnNumber}</h1>
              <p className="text-sm text-gray-600">Purchase Order: {shipment.poNumber}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                  {shipment.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                  {shipment.shipmentType}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                  {shipment.priority} Priority
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrintLabel}>
              <Printer className="w-4 h-4" />
              Print Label
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {(shipment.status === 'Receiving' || shipment.status === 'Completed') && (
        <Card className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Receiving Progress</span>
              <span className="text-sm font-bold text-green-700">
                {receivingProgress.toFixed(1)}% Complete ({shipment.receivedItems}/{shipment.totalItems} items)
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${receivingProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Shipment Details */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">ASN Number</p>
                  <p className="text-sm font-semibold text-gray-900">{shipment.asnNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">PO Number</p>
                  <p className="text-sm font-semibold text-gray-900">{shipment.poNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                  <p className="text-sm font-semibold text-blue-600">{shipment.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Carrier</p>
                  <p className="text-sm font-semibold text-gray-900">{shipment.carrier}</p>
                </div>
                {shipment.vehicleNumber && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Vehicle Number</p>
                      <p className="text-sm font-semibold text-gray-900">{shipment.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Dock Assignment</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {shipment.dockNumber} {shipment.receivingBay && `- ${shipment.receivingBay}`}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-0.5">Total Items</p>
                  <p className="text-lg font-bold text-gray-900">{shipment.totalItems}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Box className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-0.5">Pallets</p>
                  <p className="text-lg font-bold text-gray-900">{shipment.totalPallets}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Weight className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-0.5">Weight</p>
                  <p className="text-lg font-bold text-gray-900">{shipment.totalWeight.toLocaleString()} lbs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{shipment.supplier.name}</p>
                  <p className="text-xs text-gray-600">Supplier Code: {shipment.supplier.code}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Address
                    </p>
                    <p className="text-sm text-gray-900">{shipment.supplier.address}</p>
                    <p className="text-sm text-gray-900">
                      {shipment.supplier.city}, {shipment.supplier.state} {shipment.supplier.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{shipment.supplier.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Contact Person
                    </p>
                    <p className="text-sm font-medium text-gray-900">{shipment.supplier.contact.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {shipment.supplier.contact.phone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {shipment.supplier.contact.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Scheduled Appointment</p>
                    <p className="text-xs text-gray-600">{shipment.appointmentTime}</p>
                  </div>
                </div>
                {shipment.actualArrivalTime && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Actual Arrival</p>
                      <p className="text-xs text-gray-600">{shipment.actualArrivalTime}</p>
                    </div>
                  </div>
                )}
                {shipment.status === 'Receiving' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Receiving in Progress</p>
                      <p className="text-xs text-gray-600">{shipment.receivedItems} of {shipment.totalItems} items received</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {shipment.notes && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Notes
                </p>
                <p className="text-sm text-gray-700">{shipment.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Documents */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {shipment.documents.asn && (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('asn')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ASN Document
                  </Button>
                )}
                {shipment.documents.bol ? (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('bol')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Bill of Lading
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" disabled>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    BOL Missing
                  </Button>
                )}
                {shipment.documents.packingList && (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('packingList')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Packing List
                  </Button>
                )}
                {shipment.requiresInspection && (
                  shipment.documents.inspection ? (
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('inspection')}>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Inspection Report
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => alert('Quality inspection is pending. Please complete inspection first.')}>
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      Inspection Pending
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Special Requirements */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Special Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {shipment.requiresInspection && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Quality Inspection Required</span>
                  </div>
                )}
                {shipment.temperatureControlled && (
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Temperature Controlled</span>
                  </div>
                )}
                {shipment.hazmat && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-gray-700">Hazardous Materials</span>
                  </div>
                )}
                {!shipment.requiresInspection && !shipment.temperatureControlled && !shipment.hazmat && (
                  <p className="text-sm text-gray-500">No special requirements</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button variant="primary" size="sm" className="w-full gap-2" onClick={() => setShowReceiving(true)}>
                  <PackageCheck className="w-4 h-4" />
                  Continue Receiving
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setShowBarcodeScanner(true)}>
                  <QrCode className="w-4 h-4" />
                  Scan Barcode
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleTrackShipment}>
                  <Navigation className="w-4 h-4" />
                  Track Shipment
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={handlePrintLabel}>
                  <Printer className="w-4 h-4" />
                  Print Labels
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ReceivingModal
        isOpen={showReceiving}
        onClose={() => setShowReceiving(false)}
        onSubmit={handleReceiving}
        shipment={{
          asnNumber: shipment.asnNumber,
          totalItems: shipment.totalItems,
          receivedItems: shipment.receivedItems,
          totalPallets: shipment.totalPallets,
        }}
      />

      <BarcodeScannerModal
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        asnNumber={shipment.asnNumber}
        onScanComplete={handleBarcodeScanned}
      />

      <DocumentViewerModal
        isOpen={showDocumentViewer}
        onClose={() => setShowDocumentViewer(false)}
        documentType={selectedDocument}
        asnNumber={shipment.asnNumber}
        documents={shipment.documents}
      />
    </DashboardLayout>
  );
};

export default InboundDetail;
