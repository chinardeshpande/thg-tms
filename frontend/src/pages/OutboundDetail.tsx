import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  ArrowUpFromLine,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Download,
  Edit,
  PackageCheck,
  Box,
  Truck,
  Printer,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { PickOrderModal, PickOrderData } from '../components/outbound/PickOrderModal';
import { PackOrderModal, PackOrderData } from '../components/outbound/PackOrderModal';
import { ShipOrderModal, ShipOrderData } from '../components/outbound/ShipOrderModal';
import { OutboundDocumentViewerModal } from '../components/outbound/OutboundDocumentViewerModal';

interface Customer {
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

interface OutboundOrder {
  id: string;
  orderNumber: string;
  customer: Customer;
  status: 'New' | 'Ready to Pick' | 'Picking' | 'Picked' | 'Packing' | 'Packed' | 'Ready to Ship' | 'Shipped' | 'Delivered';
  orderDate: string;
  requestedShipDate: string;
  actualShipDate?: string;
  totalItems: number;
  pickedItems: number;
  packedItems: number;
  carrier?: string;
  trackingNumber?: string;
  destination: string;
  priority: 'Standard' | 'Urgent' | 'Critical';
  orderType: 'Sales Order' | 'Transfer' | 'Return' | 'Sample';
  requiresSignature: boolean;
  fragile: boolean;
  notes?: string;
  documents: {
    salesOrder: boolean;
    pickList: boolean;
    packingSlip: boolean;
    bol: boolean;
    invoice: boolean;
    shippingLabel: boolean;
  };
}

const OutboundDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Modal states
  const [showPicking, setShowPicking] = useState(false);
  const [showPacking, setShowPacking] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<'salesOrder' | 'pickList' | 'packingSlip' | 'bol' | 'invoice' | 'shippingLabel'>('salesOrder');

  // Mock data
  const [order] = useState<OutboundOrder>({
    id: '1',
    orderNumber: 'SO-2024-001',
    customer: {
      id: 'CUST-001',
      name: 'Acme Corporation',
      code: 'ACME-01',
      address: '123 Business Avenue',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      contact: {
        name: 'John Smith',
        phone: '+1 (212) 555-0100',
        email: 'john.smith@acme.com',
      },
    },
    status: 'Picking',
    orderDate: '2025-11-28',
    requestedShipDate: '2025-12-01',
    totalItems: 150,
    pickedItems: 95,
    packedItems: 0,
    destination: 'New York, NY',
    priority: 'Urgent',
    orderType: 'Sales Order',
    requiresSignature: true,
    fragile: false,
    notes: 'Customer requests delivery before noon',
    documents: {
      salesOrder: true,
      pickList: true,
      packingSlip: false,
      bol: false,
      invoice: true,
      shippingLabel: false,
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-gray-100 text-gray-800 border-gray-200',
      'Ready to Pick': 'bg-blue-100 text-blue-800 border-blue-200',
      'Picking': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Picked': 'bg-purple-100 text-purple-800 border-purple-200',
      'Packing': 'bg-orange-100 text-orange-800 border-orange-200',
      'Packed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Ready to Ship': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Shipped': 'bg-green-100 text-green-800 border-green-200',
      'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const pickingProgress = (order.pickedItems / order.totalItems) * 100;
  const packingProgress = (order.packedItems / order.totalItems) * 100;

  // Handler functions
  const handlePicking = (data: PickOrderData) => {
    console.log('Picking data:', data);
    alert(`Successfully picked ${data.itemsPicked} items!\nPicked by: ${data.pickedBy}\nLocation: ${data.pickLocation}`);
  };

  const handlePacking = (data: PackOrderData) => {
    console.log('Packing data:', data);
    alert(`Successfully packed order!\nBoxes: ${data.numberOfBoxes}\nPallets: ${data.numberOfPallets}\nWeight: ${data.totalWeight} lbs\nPacked by: ${data.packedBy}`);
  };

  const handleShipping = (data: ShipOrderData) => {
    console.log('Shipping data:', data);
    alert(`Successfully shipped order!\nCarrier: ${data.carrier}\nService: ${data.serviceLevel}\nTracking: ${data.trackingNumber}\nShipped by: ${data.shippedBy}`);
  };

  const handleViewDocument = (docType: 'salesOrder' | 'pickList' | 'packingSlip' | 'bol' | 'invoice' | 'shippingLabel') => {
    setSelectedDocument(docType);
    setShowDocumentViewer(true);
  };

  const handlePrintLabel = () => {
    window.print();
  };

  const handleExport = () => {
    const data = JSON.stringify(order, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.orderNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = () => {
    alert('Edit functionality - Update order details');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/outbound')}
          className="gap-1.5 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Outbound
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ArrowUpFromLine className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
              <p className="text-sm text-gray-600">Customer: {order.customer.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                  {order.orderType}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                  {order.priority} Priority
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

      {/* Progress Bars */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Pick Progress */}
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Picking Progress</span>
              <span className="text-sm font-bold text-yellow-700">
                {pickingProgress.toFixed(1)}% ({order.pickedItems}/{order.totalItems} items)
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full"
                style={{ width: `${pickingProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pack Progress */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Packing Progress</span>
              <span className="text-sm font-bold text-purple-700">
                {packingProgress.toFixed(1)}% ({order.packedItems}/{order.totalItems} items)
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                style={{ width: `${packingProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Details */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Number</p>
                  <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Date</p>
                  <p className="text-sm font-semibold text-gray-900">{order.orderDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Requested Ship Date</p>
                  <p className="text-sm font-semibold text-blue-600">{order.requestedShipDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Destination</p>
                  <p className="text-sm font-semibold text-gray-900">{order.destination}</p>
                </div>
                {order.trackingNumber && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                      <p className="text-sm font-semibold text-blue-600">{order.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Carrier</p>
                      <p className="text-sm font-semibold text-gray-900">{order.carrier}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-0.5">Total Items</p>
                  <p className="text-lg font-bold text-gray-900">{order.totalItems}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <PackageCheck className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-0.5">Picked</p>
                  <p className="text-lg font-bold text-gray-900">{order.pickedItems}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Box className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 mb-0.5">Packed</p>
                  <p className="text-lg font-bold text-gray-900">{order.packedItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{order.customer.name}</p>
                  <p className="text-xs text-gray-600">Customer Code: {order.customer.code}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Shipping Address
                    </p>
                    <p className="text-sm text-gray-900">{order.customer.address}</p>
                    <p className="text-sm text-gray-900">
                      {order.customer.city}, {order.customer.state} {order.customer.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{order.customer.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Contact Person
                    </p>
                    <p className="text-sm font-medium text-gray-900">{order.customer.contact.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {order.customer.contact.phone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {order.customer.contact.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Order Notes
                </p>
                <p className="text-sm text-gray-700">{order.notes}</p>
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
                {order.documents.salesOrder && (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('salesOrder')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Sales Order
                  </Button>
                )}
                {order.documents.pickList && (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('pickList')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Pick List
                  </Button>
                )}
                {order.documents.packingSlip ? (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('packingSlip')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Packing Slip
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" disabled>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Packing Slip
                  </Button>
                )}
                {order.documents.invoice && (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('invoice')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Invoice
                  </Button>
                )}
                {order.documents.shippingLabel ? (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleViewDocument('shippingLabel')}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Shipping Label
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" disabled>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Label Not Generated
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Special Requirements */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Special Requirements</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {order.requiresSignature && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Signature Required</span>
                  </div>
                )}
                {order.fragile && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-700">Fragile / Handle with Care</span>
                  </div>
                )}
                {!order.requiresSignature && !order.fragile && (
                  <p className="text-sm text-gray-500">No special requirements</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button variant="primary" size="sm" className="w-full gap-2" onClick={() => setShowPicking(true)}>
                  <PackageCheck className="w-4 h-4" />
                  Continue Picking
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setShowPacking(true)}>
                  <Box className="w-4 h-4" />
                  Pack Order
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setShowShipping(true)}>
                  <Truck className="w-4 h-4" />
                  Ship Order
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
      <PickOrderModal
        isOpen={showPicking}
        onClose={() => setShowPicking(false)}
        onSubmit={handlePicking}
        order={{
          orderNumber: order.orderNumber,
          totalItems: order.totalItems,
          pickedItems: order.pickedItems,
        }}
      />

      <PackOrderModal
        isOpen={showPacking}
        onClose={() => setShowPacking(false)}
        onSubmit={handlePacking}
        order={{
          orderNumber: order.orderNumber,
          totalItems: order.totalItems,
          pickedItems: order.pickedItems,
        }}
      />

      <ShipOrderModal
        isOpen={showShipping}
        onClose={() => setShowShipping(false)}
        onSubmit={handleShipping}
        order={{
          orderNumber: order.orderNumber,
          customer: order.customer.name,
          destination: order.destination,
        }}
      />

      <OutboundDocumentViewerModal
        isOpen={showDocumentViewer}
        onClose={() => setShowDocumentViewer(false)}
        documentType={selectedDocument}
        orderNumber={order.orderNumber}
        documents={order.documents}
      />
    </DashboardLayout>
  );
};

export default OutboundDetail;
