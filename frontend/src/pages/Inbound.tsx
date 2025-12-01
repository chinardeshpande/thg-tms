import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreateASNModal, ASNFormData } from '../components/inbound/CreateASNModal';
import { UpdateStatusModal, StatusUpdateData } from '../components/inbound/UpdateStatusModal';
import { SchedulePickupModal, PickupScheduleData } from '../components/inbound/SchedulePickupModal';
import { DocumentViewerModal } from '../components/inbound/DocumentViewerModal';
import {
  Search,
  Plus,
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
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Filter,
  TrendingUp,
  Box,
  Warehouse,
  ArrowRight,
  ClipboardList,
  PackageCheck,
  AlertTriangle,
  Activity,
  BarChart3,
} from 'lucide-react';

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

interface CrossDockOperation {
  id: string;
  inboundAsn: string;
  outboundShipment: string;
  supplier: string;
  customer: string;
  items: number;
  pallets: number;
  scheduledTransfer: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  transferTime: string;
}

const Inbound: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'scheduled' | 'intransit' | 'receiving' | 'crossdock'>('scheduled');

  // Modal states
  const [showCreateASN, setShowCreateASN] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showSchedulePickup, setShowSchedulePickup] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<'asn' | 'bol' | 'packingList' | 'inspection'>('asn');
  const [selectedShipment, setSelectedShipment] = useState<InboundShipment | null>(null);

  const [inboundShipments] = useState<InboundShipment[]>([
    {
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
      status: 'Scheduled',
      appointmentTime: '2025-11-29 02:00 PM',
      totalItems: 500,
      totalPallets: 10,
      totalWeight: 5000,
      receivedItems: 0,
      carrier: 'FedEx Freight',
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
    },
    {
      id: '2',
      asnNumber: 'ASN-2024-002',
      poNumber: 'PO-2024-5679',
      supplier: {
        id: 'SUP-002',
        name: 'Global Textiles Ltd.',
        code: 'GTL-002',
        address: '456 Manufacturing Drive',
        city: 'Houston',
        state: 'TX',
        country: 'USA',
        postalCode: '77001',
        contact: {
          name: 'Maria Garcia',
          phone: '+1 (713) 555-0456',
          email: 'maria.garcia@globaltextiles.com',
        },
      },
      status: 'In Transit',
      appointmentTime: '2025-11-29 03:30 PM',
      estimatedArrival: '45 minutes',
      totalItems: 1200,
      totalPallets: 24,
      totalWeight: 8000,
      receivedItems: 0,
      carrier: 'UPS Freight',
      vehicleNumber: 'VEH-003',
      trackingNumber: 'UPS-2024-4532',
      origin: 'Houston, TX',
      destination: 'Dallas Distribution Center',
      shipmentType: 'Purchase Order',
      priority: 'Urgent',
      requiresInspection: true,
      temperatureControlled: false,
      hazmat: false,
      documents: {
        asn: true,
        bol: true,
        packingList: true,
        inspection: false,
      },
    },
    {
      id: '3',
      asnNumber: 'ASN-2024-003',
      poNumber: 'PO-2024-5680',
      supplier: {
        id: 'SUP-003',
        name: 'Fresh Foods Distribution',
        code: 'FFD-003',
        address: '789 Cold Storage Blvd',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        postalCode: '33101',
        contact: {
          name: 'David Martinez',
          phone: '+1 (305) 555-0789',
          email: 'david.martinez@freshfoods.com',
        },
      },
      status: 'At Dock',
      appointmentTime: '2025-11-29 01:00 PM',
      actualArrivalTime: '2025-11-29 12:55 PM',
      dockNumber: 'DOCK-A3',
      totalItems: 300,
      totalPallets: 15,
      totalWeight: 6000,
      receivedItems: 0,
      carrier: 'Refrigerated Transport Co.',
      vehicleNumber: 'VEH-007',
      trackingNumber: 'RTC-2024-3341',
      origin: 'Miami, FL',
      destination: 'Atlanta Distribution Center',
      shipmentType: 'Purchase Order',
      priority: 'Critical',
      requiresInspection: true,
      temperatureControlled: true,
      hazmat: false,
      documents: {
        asn: true,
        bol: true,
        packingList: true,
        inspection: false,
      },
      notes: 'Temperature-sensitive - maintain 2-4°C',
    },
    {
      id: '4',
      asnNumber: 'ASN-2024-004',
      poNumber: 'PO-2024-5681',
      supplier: {
        id: 'SUP-004',
        name: 'Industrial Parts Supply',
        code: 'IPS-004',
        address: '321 Factory Lane',
        city: 'Detroit',
        state: 'MI',
        country: 'USA',
        postalCode: '48201',
        contact: {
          name: 'John Williams',
          phone: '+1 (313) 555-0321',
          email: 'john.williams@industrialparts.com',
        },
      },
      status: 'Receiving',
      appointmentTime: '2025-11-29 11:00 AM',
      actualArrivalTime: '2025-11-29 11:10 AM',
      dockNumber: 'DOCK-B2',
      receivingBay: 'BAY-05',
      totalItems: 800,
      totalPallets: 16,
      totalWeight: 12000,
      receivedItems: 520,
      carrier: 'XPO Logistics',
      vehicleNumber: 'VEH-002',
      trackingNumber: 'XPO-2024-7721',
      origin: 'Detroit, MI',
      destination: 'Chicago Distribution Center',
      shipmentType: 'Purchase Order',
      priority: 'Standard',
      requiresInspection: true,
      temperatureControlled: false,
      hazmat: false,
      documents: {
        asn: true,
        bol: true,
        packingList: true,
        inspection: true,
      },
    },
    {
      id: '5',
      asnNumber: 'ASN-2024-005',
      poNumber: 'XDOCK-2024-001',
      supplier: {
        id: 'SUP-005',
        name: 'Pacific Electronics',
        code: 'PEL-005',
        address: '555 Silicon Valley Way',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
        contact: {
          name: 'Sarah Kim',
          phone: '+1 (415) 555-0555',
          email: 'sarah.kim@pacificelec.com',
        },
      },
      status: 'Scheduled',
      appointmentTime: '2025-11-29 04:00 PM',
      totalItems: 200,
      totalPallets: 8,
      totalWeight: 3000,
      receivedItems: 0,
      carrier: 'DHL Freight',
      trackingNumber: 'DHL-2024-9981',
      origin: 'San Francisco, CA',
      destination: 'Los Angeles Cross-Dock Hub',
      shipmentType: 'Cross-Dock',
      priority: 'Urgent',
      requiresInspection: false,
      temperatureControlled: false,
      hazmat: false,
      documents: {
        asn: true,
        bol: true,
        packingList: true,
        inspection: false,
      },
      notes: 'Direct transfer to outbound shipment SHP-2024-8821',
    },
    {
      id: '6',
      asnNumber: 'ASN-2024-006',
      poNumber: 'PO-2024-5682',
      supplier: {
        id: 'SUP-006',
        name: 'Automotive Parts Co.',
        code: 'APC-006',
        address: '999 Auto Drive',
        city: 'Cleveland',
        state: 'OH',
        country: 'USA',
        postalCode: '44101',
        contact: {
          name: 'Michael Brown',
          phone: '+1 (216) 555-0999',
          email: 'michael.brown@autoparts.com',
        },
      },
      status: 'Delayed',
      appointmentTime: '2025-11-29 10:00 AM',
      estimatedArrival: '3 hours late',
      totalItems: 400,
      totalPallets: 12,
      totalWeight: 7500,
      receivedItems: 0,
      carrier: 'Old Dominion',
      vehicleNumber: 'VEH-009',
      trackingNumber: 'OD-2024-5521',
      origin: 'Cleveland, OH',
      destination: 'Pittsburgh Distribution Center',
      shipmentType: 'Purchase Order',
      priority: 'Standard',
      requiresInspection: true,
      temperatureControlled: false,
      hazmat: false,
      documents: {
        asn: true,
        bol: false,
        packingList: true,
        inspection: false,
      },
      notes: 'Delayed due to weather conditions - missing BOL',
    },
  ]);

  const [crossDockOps] = useState<CrossDockOperation[]>([
    {
      id: '1',
      inboundAsn: 'ASN-2024-005',
      outboundShipment: 'SHP-2024-8821',
      supplier: 'Pacific Electronics',
      customer: 'Best Buy - Phoenix Store',
      items: 200,
      pallets: 8,
      scheduledTransfer: '2025-11-29 05:00 PM',
      status: 'Planned',
      transferTime: '30 mins',
    },
    {
      id: '2',
      inboundAsn: 'ASN-2024-007',
      outboundShipment: 'SHP-2024-8822',
      supplier: 'Tech Components Inc.',
      customer: 'Amazon Fulfillment Center',
      items: 150,
      pallets: 6,
      scheduledTransfer: '2025-11-29 06:30 PM',
      status: 'In Progress',
      transferTime: '45 mins',
    },
  ]);

  const filteredShipments = inboundShipments.filter((shipment) => {
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesSearch =
      shipment.asnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'scheduled') {
      matchesTab = shipment.status === 'Scheduled';
    } else if (activeTab === 'intransit') {
      matchesTab = shipment.status === 'In Transit' || shipment.status === 'Delayed';
    } else if (activeTab === 'receiving') {
      matchesTab = shipment.status === 'At Dock' || shipment.status === 'Receiving' || shipment.status === 'Completed';
    } else if (activeTab === 'crossdock') {
      matchesTab = shipment.shipmentType === 'Cross-Dock';
    }

    return matchesStatus && matchesSearch && matchesTab;
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Standard': 'bg-gray-100 text-gray-700',
      'Urgent': 'bg-orange-100 text-orange-700',
      'Critical': 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const stats = {
    totalInbound: inboundShipments.length,
    scheduled: inboundShipments.filter(s => s.status === 'Scheduled').length,
    inTransit: inboundShipments.filter(s => s.status === 'In Transit').length,
    atDock: inboundShipments.filter(s => s.status === 'At Dock' || s.status === 'Receiving').length,
    completed: inboundShipments.filter(s => s.status === 'Completed').length,
    crossDock: inboundShipments.filter(s => s.shipmentType === 'Cross-Dock').length,
  };

  // Handler functions
  const handleCreateASN = (data: ASNFormData) => {
    console.log('Creating ASN:', data);
    // In real app, this would call an API
    // For now, just log and show success message
    alert(`ASN created successfully for PO: ${data.poNumber}`);
  };

  const handleUpdateStatus = (data: StatusUpdateData) => {
    console.log('Updating status:', data);
    // In real app, this would call an API
    alert(`Status updated to: ${data.status}`);
  };

  const handleViewDetails = (shipmentId: string) => {
    navigate(`/inbound/${shipmentId}`);
  };

  const handleUpdateStatusClick = (shipment: InboundShipment) => {
    setSelectedShipment(shipment);
    setShowUpdateStatus(true);
  };

  const handleStartReceiving = (shipment: InboundShipment) => {
    // Navigate to detail page where receiving modal can be accessed
    navigate(`/inbound/${shipment.id}`);
  };

  const handleSchedulePickup = (data: PickupScheduleData) => {
    console.log('Scheduling pickup:', data);
    alert(`Pickup scheduled for ${data.supplier} on ${data.pickupDate} at ${data.pickupTime}`);
  };

  const handleViewDocument = (shipment: InboundShipment, docType: 'asn' | 'bol' | 'packingList' | 'inspection') => {
    setSelectedShipment(shipment);
    setSelectedDocument(docType);
    setShowDocumentViewer(true);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inbound Operations</h1>
            <p className="text-gray-600 mt-1">First-mile supplier pickups, ASN tracking, and receiving management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowSchedulePickup(true)}>
              <Calendar className="w-5 h-5" />
              Schedule Pickup
            </Button>
            <Button variant="primary" className="gap-2" onClick={() => setShowCreateASN(true)}>
              <Plus className="w-5 h-5" />
              Create ASN
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
                <p className="text-sm font-medium text-gray-600 mb-1">Total Inbound</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalInbound}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <ArrowDownToLine className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-purple-600">{stats.inTransit}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Truck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">At Dock</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.atDock}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                <Warehouse className="w-6 h-6" />
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
                <p className="text-sm font-medium text-gray-600 mb-1">Cross-Dock</p>
                <p className="text-3xl font-bold text-orange-600">{stats.crossDock}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'scheduled', label: 'Scheduled Pickups', icon: <Calendar className="w-4 h-4" /> },
            { key: 'intransit', label: 'In-Transit Inbound', icon: <Truck className="w-4 h-4" /> },
            { key: 'receiving', label: 'Receiving', icon: <PackageCheck className="w-4 h-4" /> },
            { key: 'crossdock', label: 'Cross-Dock', icon: <ArrowRight className="w-4 h-4" /> },
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

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ASN, PO, supplier, or tracking number..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { value: 'all', label: 'All Status' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'In Transit', label: 'In Transit' },
                { value: 'At Dock', label: 'At Dock' },
                { value: 'Delayed', label: 'Delayed' },
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

      {/* Inbound Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <ArrowDownToLine className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className="font-bold text-lg text-blue-600 cursor-pointer hover:text-blue-800"
                            onClick={() => handleViewDetails(shipment.id)}
                          >
                            {shipment.asnNumber}
                          </h3>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">PO: {shipment.poNumber} • {shipment.trackingNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded ${getPriorityColor(shipment.priority)}`}>
                            {shipment.priority}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800">
                            {shipment.shipmentType}
                          </span>
                          {shipment.temperatureControlled && (
                            <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 border border-blue-200">
                              Temp Controlled
                            </span>
                          )}
                          {shipment.hazmat && (
                            <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-800 border border-red-200">
                              HAZMAT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Supplier</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.supplier.name}</p>
                      <p className="text-xs text-gray-500">{shipment.supplier.city}, {shipment.supplier.state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Appointment</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.appointmentTime}</p>
                      {shipment.estimatedArrival && (
                        <p className="text-xs text-blue-600">ETA: {shipment.estimatedArrival}</p>
                      )}
                      {shipment.actualArrivalTime && (
                        <p className="text-xs text-green-600">Arrived: {shipment.actualArrivalTime}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      {shipment.dockNumber ? (
                        <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                          <Warehouse className="w-3.5 h-3.5" />
                          {shipment.dockNumber}
                          {shipment.receivingBay && ` - ${shipment.receivingBay}`}
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{shipment.carrier}</p>
                      )}
                      {shipment.vehicleNumber && (
                        <p className="text-xs text-gray-500">Vehicle: {shipment.vehicleNumber}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cargo</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.totalItems} items</p>
                      <p className="text-xs text-gray-500">{shipment.totalPallets} pallets • {shipment.totalWeight.toLocaleString()} lbs</p>
                    </div>
                  </div>

                  {/* Receiving Progress */}
                  {(shipment.status === 'Receiving' || shipment.status === 'Completed') && shipment.receivedItems > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Receiving Progress</span>
                        <span className="text-xs font-bold text-green-600">
                          {Math.round((shipment.receivedItems / shipment.totalItems) * 100)}% ({shipment.receivedItems}/{shipment.totalItems} items)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(shipment.receivedItems / shipment.totalItems) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Documents Status */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div className="flex gap-2">
                          {shipment.documents.asn && (
                            <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">ASN ✓</span>
                          )}
                          {shipment.documents.bol ? (
                            <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">BOL ✓</span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">BOL ✗</span>
                          )}
                          {shipment.documents.packingList && (
                            <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">Packing List ✓</span>
                          )}
                          {shipment.requiresInspection && (
                            shipment.documents.inspection ? (
                              <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">Inspection ✓</span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700">Inspection Pending</span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Contact: {shipment.supplier.contact.name} • {shipment.supplier.contact.phone}
                      </div>
                    </div>
                  </div>

                  {shipment.notes && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                      <strong>Note:</strong> {shipment.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-[160px]">
                  <Button variant="primary" size="sm" className="w-full gap-2" onClick={() => handleViewDetails(shipment.id)}>
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => handleUpdateStatusClick(shipment)}>
                    <Edit className="w-4 h-4" />
                    Update Status
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => handleViewDocument(shipment, 'asn')}>
                    <FileText className="w-4 h-4" />
                    Documents
                  </Button>
                  {shipment.status === 'At Dock' && (
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => handleStartReceiving(shipment)}>
                      <PackageCheck className="w-4 h-4" />
                      Start Receiving
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cross-Dock Operations Section */}
      {activeTab === 'crossdock' && (
        <div className="mt-6">
          <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Cross-Dock Operations</h3>
                  <p className="text-sm text-gray-700">
                    Streamline direct transfers from inbound to outbound shipments without warehouse storage.
                    Reduce handling time and costs with intelligent cross-dock planning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {crossDockOps.map((op) => (
              <Card key={op.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{op.inboundAsn} → {op.outboundShipment}</h4>
                        <p className="text-sm text-gray-600">{op.supplier} → {op.customer}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      op.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      op.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {op.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Items</p>
                      <p className="text-lg font-bold text-gray-900">{op.items}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Pallets</p>
                      <p className="text-lg font-bold text-gray-900">{op.pallets}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Transfer Time</p>
                      <p className="text-lg font-bold text-orange-600">{op.transferTime}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Scheduled</p>
                      <p className="text-sm font-medium text-gray-900">{op.scheduledTransfer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredShipments.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowDownToLine className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No inbound shipments found</p>
              <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters</p>
              <Button variant="primary" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CreateASNModal
        isOpen={showCreateASN}
        onClose={() => setShowCreateASN(false)}
        onSubmit={handleCreateASN}
      />

      {selectedShipment && (
        <UpdateStatusModal
          isOpen={showUpdateStatus}
          onClose={() => {
            setShowUpdateStatus(false);
            setSelectedShipment(null);
          }}
          currentStatus={selectedShipment.status}
          asnNumber={selectedShipment.asnNumber}
          onSubmit={handleUpdateStatus}
        />
      )}

      <SchedulePickupModal
        isOpen={showSchedulePickup}
        onClose={() => setShowSchedulePickup(false)}
        onSubmit={handleSchedulePickup}
      />

      {selectedShipment && (
        <DocumentViewerModal
          isOpen={showDocumentViewer}
          onClose={() => {
            setShowDocumentViewer(false);
            setSelectedShipment(null);
          }}
          documentType={selectedDocument}
          asnNumber={selectedShipment.asnNumber}
          documents={selectedShipment.documents}
        />
      )}
    </DashboardLayout>
  );
};

export default Inbound;
