import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  ArrowUpFromLine,
  Package,
  PackageCheck,
  Truck,
  Clock,
  FileText,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
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
  documents: {
    salesOrder: boolean;
    pickList: boolean;
    packingSlip: boolean;
    bol: boolean;
    invoice: boolean;
    shippingLabel: boolean;
  };
}

const Outbound: React.FC = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OutboundOrder[]>([
    {
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
      documents: {
        salesOrder: true,
        pickList: true,
        packingSlip: false,
        bol: false,
        invoice: true,
        shippingLabel: false,
      },
    },
    {
      id: '2',
      orderNumber: 'SO-2024-002',
      customer: {
        id: 'CUST-002',
        name: 'TechStart Inc',
        code: 'TECH-01',
        address: '456 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
        contact: {
          name: 'Sarah Johnson',
          phone: '+1 (415) 555-0200',
          email: 'sarah@techstart.com',
        },
      },
      status: 'Ready to Pick',
      orderDate: '2025-11-29',
      requestedShipDate: '2025-12-02',
      totalItems: 80,
      pickedItems: 0,
      packedItems: 0,
      destination: 'San Francisco, CA',
      priority: 'Standard',
      orderType: 'Sales Order',
      requiresSignature: false,
      fragile: true,
      documents: {
        salesOrder: true,
        pickList: true,
        packingSlip: false,
        bol: false,
        invoice: true,
        shippingLabel: false,
      },
    },
    {
      id: '3',
      orderNumber: 'SO-2024-003',
      customer: {
        id: 'CUST-003',
        name: 'Global Retail Co',
        code: 'GLOB-01',
        address: '789 Commerce Plaza',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        postalCode: '60601',
        contact: {
          name: 'Michael Brown',
          phone: '+1 (312) 555-0300',
          email: 'mbrown@globalretail.com',
        },
      },
      status: 'Shipped',
      orderDate: '2025-11-27',
      requestedShipDate: '2025-11-30',
      actualShipDate: '2025-11-30',
      totalItems: 200,
      pickedItems: 200,
      packedItems: 200,
      carrier: 'FedEx Ground',
      trackingNumber: 'FXG-2024-789012',
      destination: 'Chicago, IL',
      priority: 'Standard',
      orderType: 'Sales Order',
      requiresSignature: true,
      fragile: false,
      documents: {
        salesOrder: true,
        pickList: true,
        packingSlip: true,
        bol: true,
        invoice: true,
        shippingLabel: true,
      },
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OutboundOrder | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<'salesOrder' | 'pickList' | 'packingSlip' | 'bol' | 'invoice' | 'shippingLabel'>('salesOrder');

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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    readyToPick: orders.filter(o => o.status === 'Ready to Pick').length,
    picking: orders.filter(o => o.status === 'Picking').length,
    packing: orders.filter(o => o.status === 'Packing').length,
    readyToShip: orders.filter(o => o.status === 'Ready to Ship').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
  };

  const handleViewDocument = (order: OutboundOrder, docType: 'salesOrder' | 'pickList' | 'packingSlip' | 'bol' | 'invoice' | 'shippingLabel') => {
    setSelectedOrder(order);
    setSelectedDocument(docType);
    setShowDocumentViewer(true);
  };

  const handleStartPicking = (order: OutboundOrder) => {
    navigate(`/outbound/${order.id}`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ArrowUpFromLine className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Outbound Orders</h1>
              <p className="text-gray-600 mt-1">Manage outbound shipments and customer orders</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Plus className="w-5 h-5" />
              Create Order
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Ready to Pick</div>
            <div className="text-2xl font-bold text-blue-600">{stats.readyToPick}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Picking</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.picking}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Packing</div>
            <div className="text-2xl font-bold text-orange-600">{stats.packing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Ready to Ship</div>
            <div className="text-2xl font-bold text-cyan-600">{stats.readyToShip}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Shipped</div>
            <div className="text-2xl font-bold text-green-600">{stats.shipped}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number, customer, or destination..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'Ready to Pick', 'Picking', 'Packing', 'Ready to Ship', 'Shipped'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.customer.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                          {order.orderType}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                          {order.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <p className="text-sm font-medium text-gray-900">{order.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Requested Ship</p>
                      <p className="text-sm font-medium text-gray-900">{order.requestedShipDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Destination</p>
                      <p className="text-sm font-medium text-blue-600">{order.destination}</p>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tracking</p>
                        <p className="text-sm font-medium text-gray-900">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Pick Progress</span>
                      <span className="text-xs font-bold text-blue-600">
                        {order.pickedItems}/{order.totalItems} items
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(order.pickedItems / order.totalItems) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleStartPicking(order)}
                    >
                      <PackageCheck className="w-4 h-4" />
                      View Details
                    </Button>
                    {order.documents.salesOrder && (
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleViewDocument(order, 'salesOrder')}>
                        <FileText className="w-4 h-4" />
                        Sales Order
                      </Button>
                    )}
                    {order.documents.pickList && (
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleViewDocument(order, 'pickList')}>
                        <FileText className="w-4 h-4" />
                        Pick List
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No orders found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Viewer Modal */}
      {selectedOrder && (
        <OutboundDocumentViewerModal
          isOpen={showDocumentViewer}
          onClose={() => {
            setShowDocumentViewer(false);
            setSelectedOrder(null);
          }}
          documentType={selectedDocument}
          orderNumber={selectedOrder.orderNumber}
          documents={selectedOrder.documents}
        />
      )}
    </DashboardLayout>
  );
};

export default Outbound;
