import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Search,
  Plus,
  Truck,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Warehouse,
  Package,
  User,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  Activity,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Filter,
  TrendingUp,
  Zap,
  Link as LinkIcon,
  Server,
  Radio,
  Database,
  Share2,
  RefreshCw,
  Settings,
  BarChart3,
} from 'lucide-react';

interface YardActivity {
  id: string;
  vehicleNumber: string;
  licensePlate: string;
  vehicleType: 'Truck' | 'Van' | 'Semi-Trailer' | 'Container';
  activityType: 'Check-In' | 'Check-Out' | 'Loading' | 'Unloading' | 'Parking' | 'Inspection';
  status: 'In Progress' | 'Completed' | 'Scheduled' | 'Delayed';
  dockNumber?: string;
  parkingSpot?: string;
  appointmentTime: string;
  actualTime?: string;
  driver: {
    name: string;
    phone: string;
  };
  shipments: string[];
  wmsIntegration: {
    connected: boolean;
    wmsSystem: string;
    lastSync: string;
    status: 'Synced' | 'Pending' | 'Error';
  };
  notes?: string;
}

interface DockBay {
  id: string;
  number: string;
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Reserved';
  currentVehicle?: string;
  assignedActivity?: string;
  capacity: string;
  lastActivity?: string;
}

interface WMSConnection {
  id: string;
  systemName: string;
  vendor: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  apiEndpoint: string;
  activeSyncOperations: number;
  totalOperationsToday: number;
}

const Yard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivity, setFilterActivity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'activities' | 'docks' | 'wms'>('activities');

  const [yardActivities] = useState<YardActivity[]>([
    {
      id: '1',
      vehicleNumber: 'VEH-001',
      licensePlate: 'CA-TX-8901',
      vehicleType: 'Truck',
      activityType: 'Unloading',
      status: 'In Progress',
      dockNumber: 'DOCK-A3',
      appointmentTime: '2025-11-29 02:00 PM',
      actualTime: '2025-11-29 02:15 PM',
      driver: {
        name: 'Michael Rodriguez',
        phone: '+1 (555) 234-5678',
      },
      shipments: ['FDX-2024-8901', 'UPS-2024-4521'],
      wmsIntegration: {
        connected: true,
        wmsSystem: 'Manhattan WMS',
        lastSync: '2 mins ago',
        status: 'Synced',
      },
      notes: 'Priority shipment - expedite unloading',
    },
    {
      id: '2',
      vehicleNumber: 'VEH-003',
      licensePlate: 'TX-DL-9012',
      vehicleType: 'Semi-Trailer',
      activityType: 'Check-In',
      status: 'Completed',
      dockNumber: 'DOCK-B1',
      appointmentTime: '2025-11-29 01:30 PM',
      actualTime: '2025-11-29 01:28 PM',
      driver: {
        name: 'James Wilson',
        phone: '+1 (555) 456-7890',
      },
      shipments: ['DHL-2024-3312', 'FDX-2024-8902'],
      wmsIntegration: {
        connected: true,
        wmsSystem: 'SAP EWM',
        lastSync: '5 mins ago',
        status: 'Synced',
      },
    },
    {
      id: '3',
      vehicleNumber: 'VEH-002',
      licensePlate: 'NY-MX-4567',
      vehicleType: 'Van',
      activityType: 'Loading',
      status: 'Scheduled',
      dockNumber: 'DOCK-C2',
      appointmentTime: '2025-11-29 03:30 PM',
      driver: {
        name: 'Sarah Chen',
        phone: '+1 (555) 345-6789',
      },
      shipments: ['UPS-2024-4523'],
      wmsIntegration: {
        connected: true,
        wmsSystem: 'Oracle WMS',
        lastSync: '1 min ago',
        status: 'Synced',
      },
    },
    {
      id: '4',
      vehicleNumber: 'VEH-006',
      licensePlate: 'AZ-PH-5678',
      vehicleType: 'Container',
      activityType: 'Parking',
      status: 'Completed',
      parkingSpot: 'SPOT-12',
      appointmentTime: '2025-11-29 11:00 AM',
      actualTime: '2025-11-29 11:05 AM',
      driver: {
        name: 'David Martinez',
        phone: '+1 (555) 567-8901',
      },
      shipments: ['FDX-2024-8903'],
      wmsIntegration: {
        connected: true,
        wmsSystem: 'Manhattan WMS',
        lastSync: '10 mins ago',
        status: 'Synced',
      },
      notes: 'Driver on break - resume unloading at 3 PM',
    },
    {
      id: '5',
      vehicleNumber: 'VEH-007',
      licensePlate: 'FL-MI-1234',
      vehicleType: 'Truck',
      activityType: 'Inspection',
      status: 'In Progress',
      dockNumber: 'DOCK-D1',
      appointmentTime: '2025-11-29 02:45 PM',
      actualTime: '2025-11-29 02:50 PM',
      driver: {
        name: 'Robert Johnson',
        phone: '+1 (555) 678-9012',
      },
      shipments: ['DHL-2024-3313'],
      wmsIntegration: {
        connected: false,
        wmsSystem: 'Blue Yonder WMS',
        lastSync: '45 mins ago',
        status: 'Error',
      },
      notes: 'WMS connection issue - manual sync required',
    },
  ]);

  const [dockBays] = useState<DockBay[]>([
    { id: '1', number: 'DOCK-A1', status: 'Available', capacity: '53ft', lastActivity: '1 hour ago' },
    { id: '2', number: 'DOCK-A2', status: 'Available', capacity: '53ft', lastActivity: '30 mins ago' },
    { id: '3', number: 'DOCK-A3', status: 'Occupied', currentVehicle: 'VEH-001', assignedActivity: 'Unloading', capacity: '53ft' },
    { id: '4', number: 'DOCK-B1', status: 'Occupied', currentVehicle: 'VEH-003', assignedActivity: 'Check-In', capacity: '53ft' },
    { id: '5', number: 'DOCK-B2', status: 'Reserved', capacity: '53ft', lastActivity: 'Reserved for 3:30 PM' },
    { id: '6', number: 'DOCK-C1', status: 'Available', capacity: '40ft', lastActivity: '2 hours ago' },
    { id: '7', number: 'DOCK-C2', status: 'Reserved', assignedActivity: 'Loading - VEH-002', capacity: '40ft' },
    { id: '8', number: 'DOCK-D1', status: 'Occupied', currentVehicle: 'VEH-007', assignedActivity: 'Inspection', capacity: '53ft' },
    { id: '9', number: 'DOCK-D2', status: 'Maintenance', capacity: '53ft', lastActivity: 'Under repair' },
  ]);

  const [wmsConnections] = useState<WMSConnection[]>([
    {
      id: '1',
      systemName: 'Manhattan WMS',
      vendor: 'Manhattan Associates',
      status: 'Connected',
      lastSync: '2 mins ago',
      apiEndpoint: 'https://api.manhattan.wms/v2',
      activeSyncOperations: 3,
      totalOperationsToday: 127,
    },
    {
      id: '2',
      systemName: 'SAP EWM',
      vendor: 'SAP',
      status: 'Connected',
      lastSync: '5 mins ago',
      apiEndpoint: 'https://sap.ewm.api/v1',
      activeSyncOperations: 1,
      totalOperationsToday: 89,
    },
    {
      id: '3',
      systemName: 'Oracle WMS',
      vendor: 'Oracle',
      status: 'Connected',
      lastSync: '1 min ago',
      apiEndpoint: 'https://oracle.wms.cloud/api',
      activeSyncOperations: 2,
      totalOperationsToday: 145,
    },
    {
      id: '4',
      systemName: 'Blue Yonder WMS',
      vendor: 'Blue Yonder',
      status: 'Error',
      lastSync: '45 mins ago',
      apiEndpoint: 'https://blueyonder.wms/api/v3',
      activeSyncOperations: 0,
      totalOperationsToday: 52,
    },
  ]);

  const filteredActivities = yardActivities.filter((activity) => {
    const matchesActivity = filterActivity === 'all' || activity.activityType === filterActivity;
    const matchesSearch =
      activity.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.dockNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesActivity && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Scheduled': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Delayed': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDockStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Available': 'bg-green-100 text-green-800 border-green-200',
      'Occupied': 'bg-blue-100 text-blue-800 border-blue-200',
      'Reserved': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Maintenance': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getWMSStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Connected': 'bg-green-100 text-green-800 border-green-200',
      'Disconnected': 'bg-gray-100 text-gray-800 border-gray-200',
      'Error': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const stats = {
    activeVehicles: yardActivities.filter(a => a.status === 'In Progress').length,
    scheduled: yardActivities.filter(a => a.status === 'Scheduled').length,
    completedToday: yardActivities.filter(a => a.status === 'Completed').length,
    availableDocks: dockBays.filter(d => d.status === 'Available').length,
    occupiedDocks: dockBays.filter(d => d.status === 'Occupied').length,
    wmsConnected: wmsConnections.filter(w => w.status === 'Connected').length,
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yard Management</h1>
            <p className="text-gray-600 mt-1">Manage vehicle ingress/egress, dock assignments, and WMS integrations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Appointment
            </Button>
            <Button variant="primary" className="gap-2">
              <Plus className="w-5 h-5" />
              Check-In Vehicle
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
                <p className="text-sm font-medium text-gray-600 mb-1">Active Vehicles</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeVehicles}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.scheduled}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Completed Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Available Docks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.availableDocks}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white shadow-lg">
                <Warehouse className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Occupied Docks</p>
                <p className="text-3xl font-bold text-purple-600">{stats.occupiedDocks}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">WMS Connected</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.wmsConnected}/{wmsConnections.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Server className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'activities', label: 'Yard Activities', icon: <Activity className="w-4 h-4" /> },
            { key: 'docks', label: 'Dock Management', icon: <Warehouse className="w-4 h-4" /> },
            { key: 'wms', label: 'WMS Integrations', icon: <Server className="w-4 h-4" /> },
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

      {/* Yard Activities Tab */}
      {activeTab === 'activities' && (
        <>
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by vehicle, driver, license plate, or dock..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'Check-In', label: 'Check-In' },
                    { value: 'Check-Out', label: 'Check-Out' },
                    { value: 'Loading', label: 'Loading' },
                    { value: 'Unloading', label: 'Unloading' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterActivity(filter.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                        filterActivity === filter.value
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

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Truck className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className="font-bold text-lg text-blue-600 cursor-pointer hover:text-blue-800"
                                onClick={() => navigate(`/fleet/${activity.id}`)}
                              >
                                {activity.vehicleNumber}
                              </h3>
                              <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{activity.licensePlate} • {activity.vehicleType}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800 border border-purple-200">
                                {activity.activityType}
                              </span>
                              {activity.wmsIntegration.connected && (
                                <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-green-100 text-green-800 border border-green-200">
                                  <Radio className="w-3 h-3" />
                                  {activity.wmsIntegration.wmsSystem}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Location</p>
                          <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            {activity.dockNumber ? (
                              <>
                                <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                                {activity.dockNumber}
                              </>
                            ) : activity.parkingSpot ? (
                              <>
                                <MapPin className="w-3.5 h-3.5 text-green-600" />
                                {activity.parkingSpot}
                              </>
                            ) : (
                              'Not Assigned'
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Driver</p>
                          <p className="text-sm font-medium text-gray-900">{activity.driver.name}</p>
                          <p className="text-xs text-gray-500">{activity.driver.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Appointment</p>
                          <p className="text-sm font-medium text-gray-900">{activity.appointmentTime}</p>
                          {activity.actualTime && (
                            <p className="text-xs text-gray-500">Actual: {activity.actualTime}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Shipments</p>
                          <div className="flex flex-wrap gap-1">
                            {activity.shipments.map((shipment, idx) => (
                              <button
                                key={idx}
                                onClick={() => navigate(`/tracking/${shipment.split('-')[1]}`)}
                                className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                              >
                                {shipment.split('-')[2]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* WMS Integration Status */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              activity.wmsIntegration.status === 'Synced'
                                ? 'bg-green-600'
                                : activity.wmsIntegration.status === 'Pending'
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}>
                              {activity.wmsIntegration.status === 'Synced' ? (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              ) : activity.wmsIntegration.status === 'Pending' ? (
                                <Clock className="w-4 h-4 text-white" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">
                                WMS: {activity.wmsIntegration.wmsSystem}
                              </p>
                              <p className="text-xs text-gray-600">
                                Status: {activity.wmsIntegration.status} • Last sync: {activity.wmsIntegration.lastSync}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Sync
                          </Button>
                        </div>
                      </div>

                      {activity.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                          <strong>Note:</strong> {activity.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => navigate(`/fleet/${activity.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View Vehicle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Activity
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
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

      {/* Dock Management Tab */}
      {activeTab === 'docks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dockBays.map((dock) => (
            <Card key={dock.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{dock.number}</h3>
                    <p className="text-sm text-gray-600">Capacity: {dock.capacity}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getDockStatusColor(dock.status)}`}>
                    {dock.status}
                  </span>
                </div>

                {dock.status === 'Occupied' && dock.currentVehicle && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Current Vehicle</p>
                    <p className="font-medium text-gray-900">{dock.currentVehicle}</p>
                    {dock.assignedActivity && (
                      <p className="text-xs text-gray-600 mt-1">{dock.assignedActivity}</p>
                    )}
                  </div>
                )}

                {dock.status === 'Reserved' && dock.assignedActivity && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Reserved For</p>
                    <p className="text-sm font-medium text-gray-900">{dock.assignedActivity}</p>
                  </div>
                )}

                {dock.status === 'Available' && dock.lastActivity && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-3">
                    <p className="text-xs text-gray-600">Last Activity: {dock.lastActivity}</p>
                  </div>
                )}

                {dock.status === 'Maintenance' && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-3">
                    <p className="text-xs text-red-800">{dock.lastActivity}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant={dock.status === 'Available' ? 'primary' : 'outline'}
                    size="sm"
                    className="flex-1"
                    disabled={dock.status === 'Maintenance'}
                  >
                    {dock.status === 'Available' ? 'Assign Vehicle' : 'View Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* WMS Integrations Tab */}
      {activeTab === 'wms' && (
        <>
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">WMS API Integration Platform</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Connect your TMS with any Warehouse Management System through our smart API integration layer.
                    All WMS functionality is accessible through standardized REST APIs, enabling seamless data exchange
                    for inventory, orders, shipments, and dock operations.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add WMS Connection
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      API Settings
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {wmsConnections.map((wms) => (
              <Card key={wms.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                        wms.status === 'Connected'
                          ? 'bg-green-600'
                          : wms.status === 'Disconnected'
                          ? 'bg-gray-600'
                          : 'bg-red-600'
                      }`}>
                        <Database className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{wms.systemName}</h3>
                        <p className="text-sm text-gray-600">{wms.vendor}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getWMSStatusColor(wms.status)}`}>
                      {wms.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">API Endpoint</p>
                      <p className="text-sm font-mono text-gray-900 break-all">{wms.apiEndpoint}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Last Sync</p>
                      <p className="text-sm font-medium text-gray-900">{wms.lastSync}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-1">Active Syncs</p>
                      <p className="text-2xl font-bold text-blue-900">{wms.activeSyncOperations}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-600 mb-1">Operations Today</p>
                      <p className="text-2xl font-bold text-green-900">{wms.totalOperationsToday}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-600 mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {wms.status === 'Connected' ? '99.8%' : '0%'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BarChart3 className="w-4 h-4" />
                      View Logs
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="w-4 h-4" />
                      API Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Yard;
