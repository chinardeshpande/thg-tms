import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Search,
  Plus,
  RotateCcw,
  Package,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Truck,
  User,
  Phone,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Filter,
  TrendingDown,
  XCircle,
  Wrench,
  Trash2,
  RefreshCw,
  ArrowLeftRight,
  DollarSign,
  BarChart3,
  ClipboardList,
  PackageX,
  AlertTriangle,
  ThumbsDown,
  Box,
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface ReturnItem {
  sku: string;
  productName: string;
  quantity: number;
  originalOrderId: string;
  returnReason: string;
  condition: 'Unopened' | 'Opened' | 'Damaged' | 'Defective' | 'Wrong Item';
  restockable: boolean;
  refundAmount: number;
}

interface RMA {
  id: string;
  rmaNumber: string;
  originalOrderNumber: string;
  originalShipmentId: string;
  customer: Customer;
  status: 'Pending Approval' | 'Approved' | 'In Transit' | 'Received' | 'Processing' | 'Completed' | 'Rejected';
  returnReason: string;
  returnCategory: 'Defective' | 'Wrong Item' | 'Damaged in Transit' | 'No Longer Needed' | 'Customer Remorse' | 'Quality Issue';
  items: ReturnItem[];
  requestedDate: string;
  approvedDate?: string;
  receivedDate?: string;
  completedDate?: string;
  carrier: string;
  trackingNumber: string;
  returnShipmentId?: string;
  pickupScheduled?: string;
  estimatedArrival?: string;
  disposition: 'Pending' | 'Restock' | 'Repair' | 'Scrap' | 'Return to Vendor' | 'Donation';
  totalRefundAmount: number;
  refundStatus: 'Pending' | 'Approved' | 'Processed' | 'Rejected';
  refundMethod: 'Original Payment' | 'Store Credit' | 'Exchange';
  inspectionRequired: boolean;
  inspectionCompleted: boolean;
  inspectionNotes?: string;
  warehouseLocation?: string;
  assignedTo?: string;
  priority: 'Standard' | 'Urgent' | 'VIP';
  notes?: string;
}

interface DispositionSummary {
  disposition: string;
  count: number;
  value: number;
  percentage: number;
}

const Returns: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'rma' | 'intransit' | 'processing' | 'analytics'>('rma');

  const [returns] = useState<RMA[]>([
    {
      id: '1',
      rmaNumber: 'RMA-2024-001',
      originalOrderNumber: 'ORD-2024-5421',
      originalShipmentId: 'SHP-2024-8765',
      customer: {
        id: 'CUST-001',
        name: 'Jennifer Thompson',
        email: 'jennifer.thompson@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      },
      status: 'Pending Approval',
      returnReason: 'Product does not match description',
      returnCategory: 'Wrong Item',
      items: [
        {
          sku: 'ELEC-001',
          productName: 'Wireless Headphones',
          quantity: 1,
          originalOrderId: 'ORD-2024-5421',
          returnReason: 'Received different color',
          condition: 'Unopened',
          restockable: true,
          refundAmount: 149.99,
        },
      ],
      requestedDate: '2025-11-28 10:30 AM',
      carrier: 'UPS',
      trackingNumber: 'Pending',
      disposition: 'Pending',
      totalRefundAmount: 149.99,
      refundStatus: 'Pending',
      refundMethod: 'Original Payment',
      inspectionRequired: false,
      inspectionCompleted: false,
      priority: 'Standard',
    },
    {
      id: '2',
      rmaNumber: 'RMA-2024-002',
      originalOrderNumber: 'ORD-2024-5422',
      originalShipmentId: 'SHP-2024-8766',
      customer: {
        id: 'CUST-002',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        address: '456 Oak Avenue',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      },
      status: 'In Transit',
      returnReason: 'Defective product - not powering on',
      returnCategory: 'Defective',
      items: [
        {
          sku: 'ELEC-002',
          productName: 'Smart Watch',
          quantity: 1,
          originalOrderId: 'ORD-2024-5422',
          returnReason: 'Device not powering on',
          condition: 'Defective',
          restockable: false,
          refundAmount: 299.99,
        },
      ],
      requestedDate: '2025-11-27 02:15 PM',
      approvedDate: '2025-11-27 03:00 PM',
      carrier: 'FedEx',
      trackingNumber: 'FDX-RET-2024-001',
      returnShipmentId: 'RSHP-2024-001',
      pickupScheduled: '2025-11-28 09:00 AM',
      estimatedArrival: '2 hours',
      disposition: 'Pending',
      totalRefundAmount: 299.99,
      refundStatus: 'Approved',
      refundMethod: 'Original Payment',
      inspectionRequired: true,
      inspectionCompleted: false,
      priority: 'Urgent',
      notes: 'High-value item - verify defect upon receipt',
    },
    {
      id: '3',
      rmaNumber: 'RMA-2024-003',
      originalOrderNumber: 'ORD-2024-5423',
      originalShipmentId: 'SHP-2024-8767',
      customer: {
        id: 'CUST-003',
        name: 'Sarah Williams',
        email: 'sarah.williams@email.com',
        phone: '+1 (555) 345-6789',
        address: '789 Elm Street',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        postalCode: '98101',
      },
      status: 'Received',
      returnReason: 'Arrived damaged',
      returnCategory: 'Damaged in Transit',
      items: [
        {
          sku: 'HOME-001',
          productName: 'Coffee Maker',
          quantity: 1,
          originalOrderId: 'ORD-2024-5423',
          returnReason: 'Box crushed during shipping',
          condition: 'Damaged',
          restockable: false,
          refundAmount: 89.99,
        },
      ],
      requestedDate: '2025-11-26 11:45 AM',
      approvedDate: '2025-11-26 12:00 PM',
      receivedDate: '2025-11-28 10:30 AM',
      carrier: 'UPS',
      trackingNumber: 'UPS-RET-2024-002',
      returnShipmentId: 'RSHP-2024-002',
      warehouseLocation: 'Seattle Returns Center - Bay 3',
      disposition: 'Pending',
      totalRefundAmount: 89.99,
      refundStatus: 'Approved',
      refundMethod: 'Original Payment',
      inspectionRequired: true,
      inspectionCompleted: false,
      assignedTo: 'Quality Team A',
      priority: 'Standard',
    },
    {
      id: '4',
      rmaNumber: 'RMA-2024-004',
      originalOrderNumber: 'ORD-2024-5424',
      originalShipmentId: 'SHP-2024-8768',
      customer: {
        id: 'CUST-004',
        name: 'David Martinez',
        email: 'david.martinez@email.com',
        phone: '+1 (555) 456-7890',
        address: '321 Pine Road',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        postalCode: '80201',
      },
      status: 'Processing',
      returnReason: 'Quality issue - poor stitching',
      returnCategory: 'Quality Issue',
      items: [
        {
          sku: 'CLOTH-001',
          productName: 'Designer Jacket',
          quantity: 1,
          originalOrderId: 'ORD-2024-5424',
          returnReason: 'Stitching coming apart',
          condition: 'Opened',
          restockable: false,
          refundAmount: 199.99,
        },
      ],
      requestedDate: '2025-11-25 09:20 AM',
      approvedDate: '2025-11-25 10:00 AM',
      receivedDate: '2025-11-27 02:15 PM',
      carrier: 'DHL',
      trackingNumber: 'DHL-RET-2024-003',
      returnShipmentId: 'RSHP-2024-003',
      warehouseLocation: 'Denver Returns Center - Bay 1',
      disposition: 'Return to Vendor',
      totalRefundAmount: 199.99,
      refundStatus: 'Approved',
      refundMethod: 'Original Payment',
      inspectionRequired: true,
      inspectionCompleted: true,
      inspectionNotes: 'Confirmed quality defect - returning to vendor for credit',
      assignedTo: 'Quality Team B',
      priority: 'Standard',
    },
    {
      id: '5',
      rmaNumber: 'RMA-2024-005',
      originalOrderNumber: 'ORD-2024-5425',
      originalShipmentId: 'SHP-2024-8769',
      customer: {
        id: 'CUST-005',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 567-8901',
        address: '654 Maple Drive',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        postalCode: '78701',
      },
      status: 'Completed',
      returnReason: 'Changed mind',
      returnCategory: 'Customer Remorse',
      items: [
        {
          sku: 'BOOK-001',
          productName: 'Programming Book Set',
          quantity: 3,
          originalOrderId: 'ORD-2024-5425',
          returnReason: 'No longer needed',
          condition: 'Unopened',
          restockable: true,
          refundAmount: 119.97,
        },
      ],
      requestedDate: '2025-11-24 03:30 PM',
      approvedDate: '2025-11-24 04:00 PM',
      receivedDate: '2025-11-26 11:00 AM',
      completedDate: '2025-11-27 09:30 AM',
      carrier: 'USPS',
      trackingNumber: 'USPS-RET-2024-004',
      returnShipmentId: 'RSHP-2024-004',
      warehouseLocation: 'Austin Returns Center - Completed',
      disposition: 'Restock',
      totalRefundAmount: 119.97,
      refundStatus: 'Processed',
      refundMethod: 'Original Payment',
      inspectionRequired: false,
      inspectionCompleted: true,
      inspectionNotes: 'Items in perfect condition - restocked to inventory',
      assignedTo: 'Receiving Team C',
      priority: 'Standard',
    },
    {
      id: '6',
      rmaNumber: 'RMA-2024-006',
      originalOrderNumber: 'ORD-2024-5426',
      originalShipmentId: 'SHP-2024-8770',
      customer: {
        id: 'CUST-006',
        name: 'Robert Johnson',
        email: 'robert.johnson@email.com',
        phone: '+1 (555) 678-9012',
        address: '987 Cedar Lane',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        postalCode: '02101',
      },
      status: 'Approved',
      returnReason: 'Item not compatible with system',
      returnCategory: 'Wrong Item',
      items: [
        {
          sku: 'TECH-001',
          productName: 'Graphics Card',
          quantity: 1,
          originalOrderId: 'ORD-2024-5426',
          returnReason: 'Not compatible with motherboard',
          condition: 'Unopened',
          restockable: true,
          refundAmount: 599.99,
        },
      ],
      requestedDate: '2025-11-28 08:15 AM',
      approvedDate: '2025-11-28 09:00 AM',
      carrier: 'FedEx',
      trackingNumber: 'Pending Pickup',
      pickupScheduled: '2025-11-29 02:00 PM',
      disposition: 'Pending',
      totalRefundAmount: 599.99,
      refundStatus: 'Approved',
      refundMethod: 'Exchange',
      inspectionRequired: false,
      inspectionCompleted: false,
      priority: 'VIP',
      notes: 'VIP customer - expedite exchange processing',
    },
  ]);

  const filteredReturns = returns.filter((rma) => {
    const matchesStatus = filterStatus === 'all' || rma.status === filterStatus;
    const matchesSearch =
      rma.rmaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rma.originalOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rma.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rma.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'rma') {
      matchesTab = rma.status === 'Pending Approval' || rma.status === 'Approved' || rma.status === 'Rejected';
    } else if (activeTab === 'intransit') {
      matchesTab = rma.status === 'In Transit';
    } else if (activeTab === 'processing') {
      matchesTab = rma.status === 'Received' || rma.status === 'Processing' || rma.status === 'Completed';
    }

    return matchesStatus && matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending Approval': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'In Transit': 'bg-blue-100 text-blue-800 border-blue-200',
      'Received': 'bg-purple-100 text-purple-800 border-purple-200',
      'Processing': 'bg-orange-100 text-orange-800 border-orange-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDispositionColor = (disposition: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-gray-100 text-gray-700',
      'Restock': 'bg-green-100 text-green-700',
      'Repair': 'bg-blue-100 text-blue-700',
      'Scrap': 'bg-red-100 text-red-700',
      'Return to Vendor': 'bg-purple-100 text-purple-700',
      'Donation': 'bg-yellow-100 text-yellow-700',
    };
    return colors[disposition] || 'bg-gray-100 text-gray-700';
  };

  const getDispositionIcon = (disposition: string) => {
    const icons: Record<string, JSX.Element> = {
      'Pending': <Clock className="w-4 h-4" />,
      'Restock': <RefreshCw className="w-4 h-4" />,
      'Repair': <Wrench className="w-4 h-4" />,
      'Scrap': <Trash2 className="w-4 h-4" />,
      'Return to Vendor': <ArrowLeftRight className="w-4 h-4" />,
      'Donation': <Package className="w-4 h-4" />,
    };
    return icons[disposition] || <Clock className="w-4 h-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Standard': 'bg-gray-100 text-gray-700',
      'Urgent': 'bg-orange-100 text-orange-700',
      'VIP': 'bg-purple-100 text-purple-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const stats = {
    totalReturns: returns.length,
    pendingApproval: returns.filter(r => r.status === 'Pending Approval').length,
    inTransit: returns.filter(r => r.status === 'In Transit').length,
    processing: returns.filter(r => r.status === 'Received' || r.status === 'Processing').length,
    completed: returns.filter(r => r.status === 'Completed').length,
    totalValue: returns.reduce((sum, r) => sum + r.totalRefundAmount, 0),
  };

  // Analytics data
  const dispositionStats: DispositionSummary[] = [
    { disposition: 'Restock', count: 2, value: 269.96, percentage: 40 },
    { disposition: 'Return to Vendor', count: 1, value: 199.99, percentage: 20 },
    { disposition: 'Scrap', count: 1, value: 89.99, percentage: 20 },
    { disposition: 'Pending', count: 2, value: 749.98, percentage: 20 },
  ];

  const returnReasonStats = [
    { reason: 'Defective', count: 1, percentage: 16.7 },
    { reason: 'Wrong Item', count: 2, percentage: 33.3 },
    { reason: 'Damaged in Transit', count: 1, percentage: 16.7 },
    { reason: 'Customer Remorse', count: 1, percentage: 16.7 },
    { reason: 'Quality Issue', count: 1, percentage: 16.7 },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Returns Management</h1>
            <p className="text-gray-600 mt-1">Reverse logistics, RMA processing, and disposition management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Export Report
            </Button>
            <Button variant="primary" className="gap-2">
              <Plus className="w-5 h-5" />
              Create RMA
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Returns</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReturns}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                <RotateCcw className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingApproval}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Truck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Processing</p>
                <p className="text-3xl font-bold text-orange-600">{stats.processing}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <ClipboardList className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-red-600">${stats.totalValue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'rma', label: 'RMA Management', icon: <ClipboardList className="w-4 h-4" /> },
            { key: 'intransit', label: 'In-Transit Returns', icon: <Truck className="w-4 h-4" /> },
            { key: 'processing', label: 'Receiving & Disposition', icon: <PackageX className="w-4 h-4" /> },
            { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* RMA List Tabs */}
      {(activeTab === 'rma' || activeTab === 'intransit' || activeTab === 'processing') && (
        <>
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by RMA, order number, customer, or tracking..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'Pending Approval', label: 'Pending' },
                    { value: 'In Transit', label: 'In Transit' },
                    { value: 'Processing', label: 'Processing' },
                    { value: 'Completed', label: 'Completed' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterStatus(filter.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                        filterStatus === filter.value
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Returns List */}
          <div className="space-y-4">
            {filteredReturns.map((rma) => (
              <Card key={rma.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <RotateCcw className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-red-600 cursor-pointer hover:text-red-800">
                                {rma.rmaNumber}
                              </h3>
                              <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(rma.status)}`}>
                                {rma.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Order: {rma.originalOrderNumber} • Shipment: {rma.originalShipmentId}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded ${getPriorityColor(rma.priority)}`}>
                                {rma.priority}
                              </span>
                              <span className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-800">
                                {rma.returnCategory}
                              </span>
                              <span className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded ${getDispositionColor(rma.disposition)}`}>
                                {getDispositionIcon(rma.disposition)}
                                {rma.disposition}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Customer</p>
                          <p className="text-sm font-medium text-gray-900">{rma.customer.name}</p>
                          <p className="text-xs text-gray-500">{rma.customer.city}, {rma.customer.state}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Items</p>
                          <p className="text-sm font-medium text-gray-900">{rma.items.length} item(s)</p>
                          <p className="text-xs text-gray-500">
                            {rma.items.reduce((sum, item) => sum + item.quantity, 0)} units
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Refund Amount</p>
                          <p className="text-sm font-medium text-red-600">${rma.totalRefundAmount.toFixed(2)}</p>
                          <p className={`text-xs ${
                            rma.refundStatus === 'Processed' ? 'text-green-600' :
                            rma.refundStatus === 'Approved' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {rma.refundStatus}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tracking</p>
                          <p className="text-sm font-medium text-gray-900">{rma.carrier}</p>
                          <p className="text-xs text-gray-500">{rma.trackingNumber}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <p className="text-gray-500 mb-1">Requested</p>
                            <p className="font-medium text-gray-900">{rma.requestedDate}</p>
                          </div>
                          {rma.approvedDate && (
                            <div>
                              <p className="text-gray-500 mb-1">Approved</p>
                              <p className="font-medium text-green-600">{rma.approvedDate}</p>
                            </div>
                          )}
                          {rma.receivedDate && (
                            <div>
                              <p className="text-gray-500 mb-1">Received</p>
                              <p className="font-medium text-blue-600">{rma.receivedDate}</p>
                            </div>
                          )}
                          {rma.completedDate && (
                            <div>
                              <p className="text-gray-500 mb-1">Completed</p>
                              <p className="font-medium text-green-600">{rma.completedDate}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Return Items */}
                      <div className="border border-gray-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">Return Items:</p>
                        {rma.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 mb-2 last:mb-0">
                            <Box className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-600">
                                SKU: {item.sku} • Qty: {item.quantity} • Condition: {item.condition}
                              </p>
                              <p className="text-xs text-gray-600">Reason: {item.returnReason}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {item.restockable ? (
                                  <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                                    Restockable
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
                                    Not Restockable
                                  </span>
                                )}
                                <span className="text-xs text-gray-600">Refund: ${item.refundAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Inspection Status */}
                      {rma.inspectionRequired && (
                        <div className={`p-3 rounded-lg border ${
                          rma.inspectionCompleted ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {rma.inspectionCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                            )}
                            <p className={`text-xs font-medium ${
                              rma.inspectionCompleted ? 'text-green-800' : 'text-yellow-800'
                            }`}>
                              Inspection {rma.inspectionCompleted ? 'Completed' : 'Required'}
                            </p>
                          </div>
                          {rma.inspectionNotes && (
                            <p className="text-xs text-gray-700">{rma.inspectionNotes}</p>
                          )}
                          {rma.assignedTo && (
                            <p className="text-xs text-gray-600 mt-1">Assigned to: {rma.assignedTo}</p>
                          )}
                        </div>
                      )}

                      {rma.notes && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                          <strong>Note:</strong> {rma.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="primary" size="sm" className="w-full gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      {rma.status === 'Pending Approval' && (
                        <>
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {(rma.status === 'Received' || rma.status === 'Processing') && (
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Edit className="w-4 h-4" />
                          Update Disposition
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <FileText className="w-4 h-4" />
                        Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Disposition Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {dispositionStats.map((stat) => (
                  <div key={stat.disposition}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getDispositionIcon(stat.disposition)}
                        <span className="text-sm font-medium text-gray-900">{stat.disposition}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{stat.count} items</p>
                        <p className="text-xs text-gray-600">${stat.value.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <ThumbsDown className="w-5 h-5" />
                Return Reasons Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {returnReasonStats.map((stat) => (
                  <div key={stat.reason}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{stat.reason}</span>
                      <span className="text-sm font-bold text-orange-600">{stat.count} ({stat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700 font-medium">Restockable Rate</p>
                    <p className="text-2xl font-bold text-green-900">40%</p>
                  </div>
                </div>
                <p className="text-xs text-green-700">2 items returned to inventory</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-red-700 font-medium">Return Rate</p>
                    <p className="text-2xl font-bold text-red-900">8.5%</p>
                  </div>
                </div>
                <p className="text-xs text-red-700">6 returns out of 70 orders</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Avg Processing Time</p>
                    <p className="text-2xl font-bold text-blue-900">2.3 days</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700">From receipt to completion</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredReturns.length === 0 && activeTab !== 'analytics' && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No returns found</p>
              <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters</p>
              <Button variant="primary" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Returns;
