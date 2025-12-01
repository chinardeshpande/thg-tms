import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShipmentRouteMap } from '../components/map/ShipmentRouteMap';
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  DollarSign,
  Weight,
  Radio,
  Thermometer,
  Gauge,
  Battery,
  Navigation,
  AlertCircle,
  CheckCircle2,
  Truck,
  Building,
  Calendar,
  TrendingUp,
  Activity,
  Wifi,
  Map as MapIcon,
  Download,
  Share2,
  Bell,
  Maximize2,
} from 'lucide-react';

interface IoTSensorReading {
  type: 'gps' | 'temperature' | 'humidity' | 'shock' | 'battery';
  value: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  threshold?: string;
  unit?: string;
}

interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  coordinates: { lat: number; lng: number };
  completedBy?: string;
  notes?: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: {
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates: { lat: number; lng: number };
  };
  currentLocation: string;
  status: 'In Transit' | 'Out for Delivery' | 'Processing' | 'Delayed' | 'Delivered';
  carrier: {
    id: string;
    name: string;
    logo: { text: string; bg: string; color: string };
    contactPerson: string;
    phone: string;
    email: string;
  };
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  eta: string;
  progress: number;
  iotEnabled: boolean;
  iotDeviceId?: string;
  sensors?: IoTSensorReading[];
  trackingHistory: TrackingEvent[];
  shipmentDetails: {
    value: string;
    weight: string;
    dimensions: string;
    contents: string;
    packageType: string;
    priority: 'Standard' | 'Express' | 'Overnight';
    insurance: string;
    createdAt: string;
    estimatedDelivery: string;
  };
}

const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Mock shipment data with full IoT integration
  const shipmentData: Record<string, Shipment> = {
    '1': {
      id: '1',
      trackingNumber: 'FDX-2024-8901',
      origin: {
        address: '1234 Warehouse Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        coordinates: { lat: 34.0522, lng: -118.2437 },
      },
      destination: {
        address: '567 Business Plaza',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        coordinates: { lat: 40.7128, lng: -74.0060 },
      },
      currentLocation: 'Kansas City, MO',
      status: 'In Transit',
      carrier: {
        id: '1',
        name: 'FedEx Express',
        logo: { text: 'FDX', bg: 'bg-purple-600', color: 'text-white' },
        contactPerson: 'John Smith',
        phone: '+1 (800) 463-3339',
        email: 'john.smith@fedex.com',
      },
      customer: {
        name: 'Jane Cooper',
        company: 'Acme Corp',
        phone: '+1 (555) 123-4567',
        email: 'jane.cooper@acmecorp.com',
      },
      eta: '2 hours',
      progress: 75,
      iotEnabled: true,
      iotDeviceId: 'IOT-TRK-8901',
      sensors: [
        { type: 'gps', value: '39.0997° N, 94.5786° W', status: 'normal', lastUpdated: '2 mins ago', unit: 'coordinates' },
        { type: 'temperature', value: '22°C', status: 'normal', lastUpdated: '2 mins ago', threshold: '0-25°C', unit: '°C' },
        { type: 'humidity', value: '45%', status: 'normal', lastUpdated: '2 mins ago', threshold: '30-60%', unit: '%' },
        { type: 'shock', value: '0.2G', status: 'normal', lastUpdated: '2 mins ago', threshold: '<1.0G', unit: 'G' },
        { type: 'battery', value: '87%', status: 'normal', lastUpdated: '5 mins ago', threshold: '>20%', unit: '%' },
      ],
      trackingHistory: [
        {
          id: '5',
          timestamp: '2025-11-29 02:30 PM',
          location: 'Kansas City, MO',
          status: 'In Transit',
          description: 'Package in transit - On track for delivery',
          coordinates: { lat: 39.0997, lng: -94.5786 },
          completedBy: 'Automated Update',
        },
        {
          id: '4',
          timestamp: '2025-11-29 08:15 AM',
          location: 'Denver, CO',
          status: 'In Transit',
          description: 'Departed from Denver distribution center',
          coordinates: { lat: 39.7392, lng: -104.9903 },
          completedBy: 'Distribution Center Staff',
        },
        {
          id: '3',
          timestamp: '2025-11-28 11:45 PM',
          location: 'Denver, CO',
          status: 'Processing',
          description: 'Arrived at distribution center - Sorting in progress',
          coordinates: { lat: 39.7392, lng: -104.9903 },
          completedBy: 'Automated Scan',
        },
        {
          id: '2',
          timestamp: '2025-11-28 06:30 PM',
          location: 'Las Vegas, NV',
          status: 'In Transit',
          description: 'Passed through Las Vegas hub',
          coordinates: { lat: 36.1699, lng: -115.1398 },
          completedBy: 'Hub Operations',
        },
        {
          id: '1',
          timestamp: '2025-11-28 09:00 AM',
          location: 'Los Angeles, CA',
          status: 'Picked Up',
          description: 'Package picked up from origin warehouse',
          coordinates: { lat: 34.0522, lng: -118.2437 },
          completedBy: 'Driver: Michael Rodriguez',
          notes: 'Package in perfect condition',
        },
      ],
      shipmentDetails: {
        value: '$12,450',
        weight: '245 lbs',
        dimensions: '48" x 40" x 36"',
        contents: 'Electronic Components',
        packageType: 'Wooden Crate',
        priority: 'Express',
        insurance: '$15,000',
        createdAt: '2025-11-28 08:30 AM',
        estimatedDelivery: '2025-11-29 05:00 PM',
      },
    },
  };

  const shipment = id ? shipmentData[id] : null;

  if (!shipment) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Shipment Not Found</p>
              <p className="text-sm text-gray-500 mb-6">The shipment you're looking for doesn't exist.</p>
              <Button variant="primary" onClick={() => navigate('/tracking')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Transit': 'bg-blue-100 text-blue-800 border-blue-200',
      'Out for Delivery': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Processing': 'bg-gray-100 text-gray-800 border-gray-200',
      'Delayed': 'bg-red-100 text-red-800 border-red-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSensorIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      gps: <Navigation className="w-5 h-5" />,
      temperature: <Thermometer className="w-5 h-5" />,
      humidity: <Gauge className="w-5 h-5" />,
      shock: <Radio className="w-5 h-5" />,
      battery: <Battery className="w-5 h-5" />,
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Standard': 'bg-gray-100 text-gray-800',
      'Express': 'bg-blue-100 text-blue-800',
      'Overnight': 'bg-purple-100 text-purple-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/tracking')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tracking
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 ${shipment.carrier.logo.bg} rounded-2xl flex items-center justify-center ${shipment.carrier.logo.color} font-bold text-xl shadow-lg`}>
              {shipment.carrier.logo.text}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{shipment.trackingNumber}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${getStatusColor(shipment.status)}`}>
                  {shipment.status}
                </span>
                <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${getPriorityColor(shipment.shipmentDetails.priority)}`}>
                  {shipment.shipmentDetails.priority} Shipping
                </span>
                {shipment.iotEnabled && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-200">
                    <Radio className="w-4 h-4" />
                    IoT Enabled
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
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Shipment Progress</span>
              <span className="text-sm font-bold text-blue-600">{shipment.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${shipment.progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{shipment.origin.city}, {shipment.origin.state}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <Truck className="w-4 h-4" />
              <span>{shipment.currentLocation}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{shipment.destination.city}, {shipment.destination.state}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="w-5 h-5" />
                Real-Time Route Tracking
                <span className="ml-2 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setIsMapExpanded(!isMapExpanded)}
              >
                <Maximize2 className="w-4 h-4" />
                {isMapExpanded ? 'Minimize' : 'Expand'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className={`${isMapExpanded ? 'h-[600px]' : 'h-96'} transition-all duration-300`}>
              <ShipmentRouteMap
                origin={shipment.origin}
                destination={shipment.destination}
                currentLocation={shipment.trackingHistory[0]?.coordinates}
                routePoints={shipment.trackingHistory.slice(1).reverse()}
                trackingNumber={shipment.trackingNumber}
              />
            </div>
          </CardContent>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Destination</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Waypoints</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                IoT Device: {shipment.iotDeviceId} | Updated: {shipment.sensors?.find(s => s.type === 'gps')?.lastUpdated}
              </div>
            </div>
          </div>
        </Card>

        {/* ETA & Details */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">Estimated Delivery</p>
                <p className="text-lg font-bold text-blue-900">{shipment.shipmentDetails.estimatedDelivery}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-blue-700">
                  <TrendingUp className="w-4 h-4" />
                  <span>ETA: {shipment.eta}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-sm font-medium text-gray-900">{shipment.shipmentDetails.createdAt}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 mb-2">Package Details</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-semibold text-green-600">{shipment.shipmentDetails.value}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900">{shipment.shipmentDetails.weight}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Insurance:</span>
                    <span className="font-medium text-gray-900">{shipment.shipmentDetails.insurance}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IoT Sensor Dashboard */}
      {shipment.iotEnabled && shipment.sensors && (
        <Card className="mb-6">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                IoT Sensor Dashboard
                <span className="text-xs text-gray-500 font-normal ml-2">Device ID: {shipment.iotDeviceId}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live Monitoring</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {shipment.sensors.map((sensor, idx) => (
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
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">IoT Integration Active</p>
                  <p className="text-sm text-gray-700">
                    This shipment is equipped with advanced IoT sensors providing real-time environmental monitoring and GPS tracking.
                    All sensor data is transmitted via cellular network and updated every 2 minutes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Origin & Destination */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Origin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">{shipment.origin.address}</p>
              <p className="text-sm text-gray-600">
                {shipment.origin.city}, {shipment.origin.state} {shipment.origin.zip}
              </p>
              <p className="text-xs text-gray-500 mt-3">Coordinates:</p>
              <p className="text-xs font-mono text-gray-700">
                {shipment.origin.coordinates.lat}° N, {shipment.origin.coordinates.lng}° W
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">{shipment.destination.address}</p>
              <p className="text-sm text-gray-600">
                {shipment.destination.city}, {shipment.destination.state} {shipment.destination.zip}
              </p>
              <p className="text-xs text-gray-500 mt-3">Coordinates:</p>
              <p className="text-xs font-mono text-gray-700">
                {shipment.destination.coordinates.lat}° N, {shipment.destination.coordinates.lng}° W
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Contents</p>
                <p className="text-sm font-medium text-gray-900">{shipment.shipmentDetails.contents}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Package Type</p>
                <p className="text-sm font-medium text-gray-900">{shipment.shipmentDetails.packageType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                <p className="text-sm font-medium text-gray-900">{shipment.shipmentDetails.dimensions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Information */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-900">{shipment.customer.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Company</p>
                <p className="text-sm font-medium text-gray-900">{shipment.customer.company}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${shipment.customer.phone}`} className="text-blue-600 hover:text-blue-700">
                  {shipment.customer.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${shipment.customer.email}`} className="text-blue-600 hover:text-blue-700">
                  {shipment.customer.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carrier Information */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Carrier Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${shipment.carrier.logo.bg} rounded-lg flex items-center justify-center ${shipment.carrier.logo.color} font-bold shadow-lg`}>
                {shipment.carrier.logo.text}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{shipment.carrier.name}</p>
                <p className="text-sm text-gray-600">{shipment.carrier.contactPerson}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${shipment.carrier.phone}`} className="text-blue-600 hover:text-blue-700">
                  {shipment.carrier.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${shipment.carrier.email}`} className="text-blue-600 hover:text-blue-700">
                  {shipment.carrier.email}
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => navigate(`/carriers/${shipment.carrier.id}`)}
              >
                View Carrier Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracking History */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tracking History & Delivery Stages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {shipment.trackingHistory.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index === 0 ? (
                      <Activity className="w-5 h-5" />
                    ) : event.status === 'Delivered' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-current" />
                    )}
                  </div>
                  {index !== shipment.trackingHistory.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{event.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.completedBy && (
                    <p className="text-xs text-gray-500 mt-2">Completed by: {event.completedBy}</p>
                  )}
                  {event.notes && (
                    <p className="text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded inline-block">
                      Note: {event.notes}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    {event.coordinates.lat}° N, {event.coordinates.lng}° W
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ShipmentDetail;
