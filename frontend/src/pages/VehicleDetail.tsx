import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Navigation,
  Fuel,
  Gauge,
  Battery,
  Radio,
  Thermometer,
  AlertCircle,
  CheckCircle2,
  FileText,
  Download,
  Upload,
  Calendar,
  Activity,
  Wifi,
  TrendingUp,
  Weight,
  Box,
  BarChart3,
  ClipboardList,
  Loader,
  XCircle,
  Edit,
  Printer,
  Share2,
  Plus,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface CargoItem {
  sku: string;
  productName: string;
  quantity: number;
  unit: 'pcs' | 'kg' | 'lbs' | 'boxes' | 'pallets';
  weight: number;
  volume: number;
  shipmentId: string;
  status: 'Loaded' | 'In Transit' | 'Delivered' | 'Pending';
  origin: string;
  destination: string;
  specialHandling?: string[];
}

interface Document {
  id: string;
  type: 'BOL' | 'POD' | 'Invoice' | 'Customs' | 'Inspection' | 'Insurance';
  number: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  status: 'Valid' | 'Pending' | 'Expired';
  relatedShipment?: string;
}

interface LoadingEvent {
  id: string;
  timestamp: string;
  type: 'Loading' | 'Unloading' | 'Inspection' | 'Refueling';
  location: string;
  coordinator: string;
  itemsProcessed: number;
  duration: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  notes?: string;
}

interface IoTSensorReading {
  type: 'gps' | 'temperature' | 'humidity' | 'fuel' | 'battery' | 'odometer';
  value: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  threshold?: string;
}

interface VehicleData {
  id: string;
  vehicleNumber: string;
  licensePlate: string;
  type: 'Truck' | 'Van' | 'Semi-Trailer' | 'Container';
  make: string;
  model: string;
  year: number;
  status: 'Available' | 'In Transit' | 'Loading' | 'Unloading' | 'Maintenance';
  currentLocation: string;
  coordinates: { lat: number; lng: number };
  driver: {
    name: string;
    phone: string;
    email: string;
    license: string;
  } | null;
  capacity: {
    weight: number;
    volume: number;
    maxPallets: number;
  };
  currentLoad: {
    weight: number;
    volume: number;
    pallets: number;
    itemCount: number;
  };
  iotEnabled: boolean;
  iotDeviceId?: string;
  sensors?: IoTSensorReading[];
  assignedRoute?: string;
  estimatedArrival?: string;
  cargoManifest: CargoItem[];
  documents: Document[];
  loadingHistory: LoadingEvent[];
  nextMaintenance: string;
  lastMaintenance: string;
  odometer: number;
  fuelLevel: number;
}

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cargo' | 'documents' | 'operations' | 'iot'>('cargo');

  // Mock vehicle data
  const vehicleData: Record<string, VehicleData> = {
    '1': {
      id: '1',
      vehicleNumber: 'VEH-001',
      licensePlate: 'CA-TX-8901',
      type: 'Truck',
      make: 'Freightliner',
      model: 'Cascadia',
      year: 2022,
      status: 'In Transit',
      currentLocation: 'Kansas City, MO',
      coordinates: { lat: 39.0997, lng: -94.5786 },
      driver: {
        name: 'Michael Rodriguez',
        phone: '+1 (555) 234-5678',
        email: 'michael.rodriguez@company.com',
        license: 'CDL-A-12345',
      },
      capacity: {
        weight: 45000,
        volume: 3000,
        maxPallets: 26,
      },
      currentLoad: {
        weight: 32000,
        volume: 2100,
        pallets: 18,
        itemCount: 234,
      },
      iotEnabled: true,
      iotDeviceId: 'IOT-VEH-001',
      sensors: [
        { type: 'gps', value: '39.0997° N, 94.5786° W', status: 'normal', lastUpdated: '2 mins ago' },
        { type: 'temperature', value: '22°C', status: 'normal', lastUpdated: '2 mins ago', threshold: '0-25°C' },
        { type: 'humidity', value: '45%', status: 'normal', lastUpdated: '2 mins ago', threshold: '30-60%' },
        { type: 'fuel', value: '68%', status: 'normal', lastUpdated: '5 mins ago', threshold: '>20%' },
        { type: 'battery', value: '87%', status: 'normal', lastUpdated: '5 mins ago', threshold: '>20%' },
        { type: 'odometer', value: '145,320 mi', status: 'normal', lastUpdated: 'Real-time' },
      ],
      assignedRoute: 'LA → NY',
      estimatedArrival: '2 hours',
      cargoManifest: [
        {
          sku: 'ELEC-2024-001',
          productName: 'LED Display Panels',
          quantity: 50,
          unit: 'boxes',
          weight: 2500,
          volume: 180,
          shipmentId: 'FDX-2024-8901',
          status: 'In Transit',
          origin: 'Los Angeles, CA',
          destination: 'New York, NY',
          specialHandling: ['Fragile', 'This Side Up'],
        },
        {
          sku: 'ELEC-2024-002',
          productName: 'Computer Motherboards',
          quantity: 120,
          unit: 'boxes',
          weight: 1800,
          volume: 120,
          shipmentId: 'FDX-2024-8901',
          status: 'In Transit',
          origin: 'Los Angeles, CA',
          destination: 'New York, NY',
          specialHandling: ['Fragile', 'Temperature Sensitive'],
        },
        {
          sku: 'COMP-2024-045',
          productName: 'Desktop Computers',
          quantity: 80,
          unit: 'boxes',
          weight: 3200,
          volume: 240,
          shipmentId: 'UPS-2024-4521',
          status: 'In Transit',
          origin: 'Los Angeles, CA',
          destination: 'Chicago, IL',
          specialHandling: ['Fragile'],
        },
        {
          sku: 'OFF-2024-089',
          productName: 'Office Furniture',
          quantity: 25,
          unit: 'pallets',
          weight: 5500,
          volume: 420,
          shipmentId: 'DHL-2024-3312',
          status: 'In Transit',
          origin: 'Los Angeles, CA',
          destination: 'Denver, CO',
        },
        {
          sku: 'ACCS-2024-156',
          productName: 'Keyboard & Mouse Sets',
          quantity: 200,
          unit: 'boxes',
          weight: 800,
          volume: 80,
          shipmentId: 'FDX-2024-8902',
          status: 'In Transit',
          origin: 'Los Angeles, CA',
          destination: 'New York, NY',
        },
        {
          sku: 'MNTR-2024-201',
          productName: '27" Monitors',
          quantity: 100,
          unit: 'boxes',
          weight: 4500,
          volume: 350,
          shipmentId: 'UPS-2024-4522',
          status: 'In Transit',
          origin: 'Los Angeles, CA',
          destination: 'Boston, MA',
          specialHandling: ['Fragile', 'This Side Up'],
        },
      ],
      documents: [
        {
          id: '1',
          type: 'BOL',
          number: 'BOL-2024-8901',
          fileName: 'bill_of_lading_8901.pdf',
          uploadedBy: 'John Smith',
          uploadedAt: '2025-11-28 09:15 AM',
          size: '2.4 MB',
          status: 'Valid',
          relatedShipment: 'FDX-2024-8901',
        },
        {
          id: '2',
          type: 'Invoice',
          number: 'INV-2024-3421',
          fileName: 'commercial_invoice_3421.pdf',
          uploadedBy: 'Sarah Chen',
          uploadedAt: '2025-11-28 09:20 AM',
          size: '1.8 MB',
          status: 'Valid',
          relatedShipment: 'FDX-2024-8901',
        },
        {
          id: '3',
          type: 'Inspection',
          number: 'INSP-2024-112',
          fileName: 'vehicle_inspection_112.pdf',
          uploadedBy: 'Michael Rodriguez',
          uploadedAt: '2025-11-28 08:45 AM',
          size: '3.2 MB',
          status: 'Valid',
        },
        {
          id: '4',
          type: 'Insurance',
          number: 'INS-2024-5678',
          fileName: 'cargo_insurance_5678.pdf',
          uploadedBy: 'Admin',
          uploadedAt: '2025-11-27 03:30 PM',
          size: '1.2 MB',
          status: 'Valid',
        },
        {
          id: '5',
          type: 'Customs',
          number: 'CUST-2024-9012',
          fileName: 'customs_declaration_9012.pdf',
          uploadedBy: 'Jane Cooper',
          uploadedAt: '2025-11-28 10:00 AM',
          size: '2.1 MB',
          status: 'Pending',
          relatedShipment: 'DHL-2024-3312',
        },
      ],
      loadingHistory: [
        {
          id: '1',
          timestamp: '2025-11-28 09:30 AM',
          type: 'Loading',
          location: 'Los Angeles Distribution Center',
          coordinator: 'James Wilson',
          itemsProcessed: 234,
          duration: '2 hours 15 mins',
          status: 'Completed',
          notes: 'All items loaded successfully. Fragile items secured with extra padding.',
        },
        {
          id: '2',
          timestamp: '2025-11-28 12:00 PM',
          type: 'Inspection',
          location: 'Los Angeles Distribution Center',
          coordinator: 'Sarah Martinez',
          itemsProcessed: 234,
          duration: '30 mins',
          status: 'Completed',
          notes: 'Pre-departure inspection completed. All cargo secure and properly documented.',
        },
        {
          id: '3',
          timestamp: '2025-11-28 01:30 PM',
          type: 'Refueling',
          location: 'Las Vegas Truck Stop',
          coordinator: 'Michael Rodriguez',
          itemsProcessed: 0,
          duration: '20 mins',
          status: 'Completed',
        },
        {
          id: '4',
          timestamp: '2025-11-29 08:00 AM',
          type: 'Inspection',
          location: 'Denver Rest Area',
          coordinator: 'Michael Rodriguez',
          itemsProcessed: 234,
          duration: '15 mins',
          status: 'Completed',
          notes: 'Mid-route inspection. All cargo intact and secure.',
        },
      ],
      nextMaintenance: '2025-12-15',
      lastMaintenance: '2025-10-15',
      odometer: 145320,
      fuelLevel: 68,
    },
  };

  const vehicle = id ? vehicleData[id] : null;

  if (!vehicle) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Vehicle Not Found</p>
              <p className="text-sm text-gray-500 mb-6">The vehicle you're looking for doesn't exist.</p>
              <Button variant="primary" onClick={() => navigate('/fleet')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Fleet
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Available': 'bg-green-100 text-green-800 border-green-200',
      'In Transit': 'bg-blue-100 text-blue-800 border-blue-200',
      'Loading': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Unloading': 'bg-orange-100 text-orange-800 border-orange-200',
      'Maintenance': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDocumentIcon = (type: string) => {
    return <FileText className="w-5 h-5" />;
  };

  const getDocumentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Valid': 'text-green-600 bg-green-50',
      'Pending': 'text-yellow-600 bg-yellow-50',
      'Expired': 'text-red-600 bg-red-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const getSensorIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      gps: <Navigation className="w-5 h-5" />,
      temperature: <Thermometer className="w-5 h-5" />,
      humidity: <Gauge className="w-5 h-5" />,
      fuel: <Fuel className="w-5 h-5" />,
      battery: <Battery className="w-5 h-5" />,
      odometer: <Gauge className="w-5 h-5" />,
    };
    return icons[type];
  };

  const getSensorStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: 'text-green-600 bg-green-50 border-green-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      critical: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const weightUtilization = Math.round((vehicle.currentLoad.weight / vehicle.capacity.weight) * 100);
  const volumeUtilization = Math.round((vehicle.currentLoad.volume / vehicle.capacity.volume) * 100);
  const palletUtilization = Math.round((vehicle.currentLoad.pallets / vehicle.capacity.maxPallets) * 100);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/fleet')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fleet
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vehicle.vehicleNumber}</h1>
              <p className="text-gray-600 mt-1">{vehicle.licensePlate} • {vehicle.make} {vehicle.model} ({vehicle.year})</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
                {vehicle.iotEnabled && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-200">
                    <Radio className="w-4 h-4" />
                    IoT: {vehicle.iotDeviceId}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="primary" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Vehicle
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Location</p>
                <p className="text-lg font-bold text-blue-600">{vehicle.currentLocation}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            {vehicle.assignedRoute && (
              <div className="text-sm text-gray-700">
                <p className="font-medium">Route: {vehicle.assignedRoute}</p>
                {vehicle.estimatedArrival && (
                  <p className="text-gray-500 mt-1">ETA: {vehicle.estimatedArrival}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Driver</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.driver?.name || 'Unassigned'}</p>
              </div>
              <User className="w-8 h-8 text-gray-600" />
            </div>
            {vehicle.driver && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600">{vehicle.driver.phone}</p>
                <p className="text-xs text-gray-500">License: {vehicle.driver.license}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cargo Items</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.currentLoad.itemCount}</p>
              </div>
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">{vehicle.currentLoad.pallets} / {vehicle.capacity.maxPallets} pallets</p>
              <p className="text-xs text-gray-500">{palletUtilization}% utilized</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Weight</p>
                <p className="text-lg font-bold text-gray-900">{vehicle.currentLoad.weight.toLocaleString()} lbs</p>
              </div>
              <Weight className="w-8 h-8 text-gray-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Capacity: {vehicle.capacity.weight.toLocaleString()} lbs</p>
              <p className="text-xs text-gray-500">{weightUtilization}% utilized</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Utilization */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Capacity Utilization
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Weight</span>
                <span className="text-sm font-bold text-blue-600">{weightUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${weightUtilization}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {vehicle.currentLoad.weight.toLocaleString()} / {vehicle.capacity.weight.toLocaleString()} lbs
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Volume</span>
                <span className="text-sm font-bold text-purple-600">{volumeUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${volumeUtilization}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {vehicle.currentLoad.volume.toLocaleString()} / {vehicle.capacity.volume.toLocaleString()} cu ft
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Pallets</span>
                <span className="text-sm font-bold text-green-600">{palletUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${palletUtilization}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {vehicle.currentLoad.pallets} / {vehicle.capacity.maxPallets} pallets
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'cargo', label: 'Cargo Manifest', icon: <ClipboardList className="w-4 h-4" /> },
            { key: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
            { key: 'operations', label: 'Operations History', icon: <Activity className="w-4 h-4" /> },
            { key: 'iot', label: 'IoT Sensors', icon: <Radio className="w-4 h-4" /> },
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

      {/* Cargo Manifest Tab */}
      {activeTab === 'cargo' && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Cargo Manifest - SKU Level Details
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export Manifest
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Special</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicle.cargoManifest.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">{item.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{item.productName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{item.quantity} {item.unit}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{item.weight.toLocaleString()} lbs</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{item.volume} cu ft</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/tracking/${item.shipmentId.split('-')[1]}`)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {item.shipmentId}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600">
                          <div>{item.origin}</div>
                          <div className="text-gray-400">→ {item.destination}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.specialHandling && item.specialHandling.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.specialHandling.map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Logistics Documents
              </CardTitle>
              <Button variant="primary" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {vehicle.documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getDocumentStatusColor(doc.status)}`}>
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-gray-900">{doc.type} - {doc.number}</p>
                        <p className="text-sm text-gray-600">{doc.fileName}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded ${getDocumentStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>Uploaded by {doc.uploadedBy}</span>
                      <span>•</span>
                      <span>{doc.uploadedAt}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      {doc.relatedShipment && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => navigate(`/tracking/${doc.relatedShipment?.split('-')[1]}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Shipment: {doc.relatedShipment}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operations History Tab */}
      {activeTab === 'operations' && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Loading/Unloading Operations History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {vehicle.loadingHistory.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.status === 'Completed'
                        ? 'bg-green-600 text-white'
                        : event.status === 'In Progress'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {event.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : event.status === 'In Progress' ? (
                        <Loader className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    {index !== vehicle.loadingHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{event.type}</p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            event.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{event.timestamp}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg mt-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Coordinator</p>
                          <p className="font-medium text-gray-900">{event.coordinator}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Items Processed</p>
                          <p className="font-medium text-gray-900">{event.itemsProcessed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="font-medium text-gray-900">{event.duration}</p>
                        </div>
                      </div>
                      {event.notes && (
                        <p className="text-xs text-gray-700 mt-3 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* IoT Sensors Tab */}
      {activeTab === 'iot' && vehicle.iotEnabled && vehicle.sensors && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Real-Time IoT Sensor Data
                <span className="text-xs text-gray-500 font-normal ml-2">Device: {vehicle.iotDeviceId}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live Monitoring</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {vehicle.sensors.map((sensor, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-2 ${getSensorStatusColor(sensor.status)} transition-all hover:shadow-lg`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getSensorIcon(sensor.type)}
                      <span className="text-sm font-semibold capitalize">{sensor.type}</span>
                    </div>
                    <Activity className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{sensor.value}</p>
                  {sensor.threshold && (
                    <p className="text-xs text-gray-600 mb-2">
                      Threshold: {sensor.threshold}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Wifi className="w-3 h-3" />
                    <span>{sensor.lastUpdated}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium capitalize ${
                        sensor.status === 'normal' ? 'text-green-600' :
                        sensor.status === 'warning' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {sensor.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">IoT Integration Active</p>
                  <p className="text-sm text-gray-700">
                    This vehicle is equipped with advanced IoT sensors providing real-time monitoring of GPS location, environmental conditions, fuel levels, and battery status.
                    All sensor data is transmitted via cellular network and updated every 2 minutes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default VehicleDetail;
