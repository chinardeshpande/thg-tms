import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  MapPin,
  Navigation,
  Truck,
  Package,
  Thermometer,
  Droplets,
  Gauge,
  Battery,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Eye,
  Filter,
  Layers,
  Maximize2,
  RefreshCw,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Wind,
  Sun,
  Cloud,
  MessageSquare,
  Bell,
  Settings,
  Download,
  Share2,
} from 'lucide-react';

interface IoTSensor {
  id: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'shock' | 'light' | 'door' | 'fuel' | 'speed' | 'location';
  name: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: string;
  threshold: {
    min?: number;
    max?: number;
    critical?: number;
  };
}

interface VehicleTracking {
  id: string;
  vehicleNumber: string;
  licensePlate: string;
  driver: string;
  status: 'moving' | 'stopped' | 'idle' | 'loading' | 'unloading';
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    eta: string;
  };
  speed: number;
  heading: number;
  shipments: string[];
  sensors: IoTSensor[];
  connectivity: 'online' | 'offline' | 'weak';
  lastPing: string;
  route: Array<{ lat: number; lng: number }>;
  distanceTraveled: number;
  distanceRemaining: number;
  fuelLevel: number;
  engineHours: number;
}

const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'map' | 'satellite' | 'hybrid'>('map');
  const [showTraffic, setShowTraffic] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  const [vehicles] = useState<VehicleTracking[]>([
    {
      id: '1',
      vehicleNumber: 'VEH-001',
      licensePlate: 'CA-TX-8901',
      driver: 'Michael Rodriguez',
      status: 'moving',
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: '1234 Main St',
        city: 'Los Angeles',
        state: 'CA',
      },
      destination: {
        lat: 47.6062,
        lng: -122.3321,
        address: '5678 Pike St',
        city: 'Seattle',
        state: 'WA',
        eta: '14 hours 23 mins',
      },
      speed: 65,
      heading: 340,
      shipments: ['SHP-2024-001', 'SHP-2024-002'],
      sensors: [
        {
          id: 's1',
          type: 'temperature',
          name: 'Cargo Temperature',
          value: 38.2,
          unit: '°F',
          status: 'normal',
          lastUpdate: '2 mins ago',
          threshold: { min: 35, max: 45, critical: 50 },
        },
        {
          id: 's2',
          type: 'humidity',
          name: 'Cargo Humidity',
          value: 65,
          unit: '%',
          status: 'normal',
          lastUpdate: '2 mins ago',
          threshold: { min: 40, max: 70, critical: 80 },
        },
        {
          id: 's3',
          type: 'door',
          name: 'Cargo Door',
          value: 'Locked',
          unit: '',
          status: 'normal',
          lastUpdate: '5 mins ago',
          threshold: {},
        },
        {
          id: 's4',
          type: 'shock',
          name: 'Impact Sensor',
          value: 0.3,
          unit: 'g',
          status: 'normal',
          lastUpdate: '1 min ago',
          threshold: { max: 2, critical: 5 },
        },
        {
          id: 's5',
          type: 'fuel',
          name: 'Fuel Level',
          value: 78,
          unit: '%',
          status: 'normal',
          lastUpdate: '3 mins ago',
          threshold: { min: 20, critical: 10 },
        },
        {
          id: 's6',
          type: 'pressure',
          name: 'Tire Pressure',
          value: 32.5,
          unit: 'PSI',
          status: 'normal',
          lastUpdate: '4 mins ago',
          threshold: { min: 30, max: 35, critical: 28 },
        },
      ],
      connectivity: 'online',
      lastPing: 'Just now',
      route: [
        { lat: 34.0522, lng: -118.2437 },
        { lat: 35.1983, lng: -119.1869 },
        { lat: 36.7783, lng: -119.4179 },
        { lat: 37.7749, lng: -122.4194 },
        { lat: 39.5296, lng: -122.2422 },
        { lat: 41.8781, lng: -122.8644 },
        { lat: 43.6150, lng: -122.9931 },
        { lat: 45.5152, lng: -122.6784 },
        { lat: 47.6062, lng: -122.3321 },
      ],
      distanceTraveled: 324,
      distanceRemaining: 811,
      fuelLevel: 78,
      engineHours: 1248,
    },
    {
      id: '2',
      vehicleNumber: 'VEH-003',
      licensePlate: 'TX-DL-9012',
      driver: 'Sarah Chen',
      status: 'stopped',
      location: {
        lat: 29.7604,
        lng: -95.3698,
        address: 'Shell Gas Station, I-10',
        city: 'Houston',
        state: 'TX',
      },
      destination: {
        lat: 32.7767,
        lng: -96.7970,
        address: '1200 Commerce St',
        city: 'Dallas',
        state: 'TX',
        eta: '3 hours 45 mins',
      },
      speed: 0,
      heading: 45,
      shipments: ['SHP-2024-003'],
      sensors: [
        {
          id: 's7',
          type: 'temperature',
          name: 'Cargo Temperature',
          value: 72.8,
          unit: '°F',
          status: 'warning',
          lastUpdate: '1 min ago',
          threshold: { min: 35, max: 70, critical: 75 },
        },
        {
          id: 's8',
          type: 'humidity',
          name: 'Cargo Humidity',
          value: 82,
          unit: '%',
          status: 'critical',
          lastUpdate: '1 min ago',
          threshold: { min: 40, max: 70, critical: 80 },
        },
        {
          id: 's9',
          type: 'door',
          name: 'Cargo Door',
          value: 'Unlocked',
          unit: '',
          status: 'warning',
          lastUpdate: 'Just now',
          threshold: {},
        },
        {
          id: 's10',
          type: 'fuel',
          name: 'Fuel Level',
          value: 45,
          unit: '%',
          status: 'normal',
          lastUpdate: 'Just now',
          threshold: { min: 20, critical: 10 },
        },
      ],
      connectivity: 'online',
      lastPing: 'Just now',
      route: [
        { lat: 29.7604, lng: -95.3698 },
        { lat: 30.2672, lng: -95.4612 },
        { lat: 31.0689, lng: -95.6989 },
        { lat: 32.0853, lng: -96.2264 },
        { lat: 32.7767, lng: -96.7970 },
      ],
      distanceTraveled: 87,
      distanceRemaining: 152,
      fuelLevel: 45,
      engineHours: 892,
    },
    {
      id: '3',
      vehicleNumber: 'VEH-007',
      licensePlate: 'FL-MI-1234',
      driver: 'Robert Johnson',
      status: 'idle',
      location: {
        lat: 25.7617,
        lng: -80.1918,
        address: 'Miami Distribution Center',
        city: 'Miami',
        state: 'FL',
      },
      destination: {
        lat: 33.7490,
        lng: -84.3880,
        address: 'Atlanta Warehouse',
        city: 'Atlanta',
        state: 'GA',
        eta: 'Scheduled for 4:00 PM',
      },
      speed: 0,
      heading: 0,
      shipments: ['SHP-2024-004', 'SHP-2024-005'],
      sensors: [
        {
          id: 's11',
          type: 'temperature',
          name: 'Cargo Temperature',
          value: 36.5,
          unit: '°F',
          status: 'normal',
          lastUpdate: '5 mins ago',
          threshold: { min: 32, max: 40, critical: 45 },
        },
        {
          id: 's12',
          type: 'door',
          name: 'Cargo Door',
          value: 'Locked',
          unit: '',
          status: 'normal',
          lastUpdate: '10 mins ago',
          threshold: {},
        },
        {
          id: 's13',
          type: 'fuel',
          name: 'Fuel Level',
          value: 92,
          unit: '%',
          status: 'normal',
          lastUpdate: '5 mins ago',
          threshold: { min: 20, critical: 10 },
        },
      ],
      connectivity: 'online',
      lastPing: '30 secs ago',
      route: [
        { lat: 25.7617, lng: -80.1918 },
        { lat: 26.7153, lng: -80.9534 },
        { lat: 28.5383, lng: -81.3792 },
        { lat: 30.3322, lng: -81.6557 },
        { lat: 32.0835, lng: -81.0998 },
        { lat: 33.7490, lng: -84.3880 },
      ],
      distanceTraveled: 0,
      distanceRemaining: 662,
      fuelLevel: 92,
      engineHours: 654,
    },
  ]);

  const selected = vehicles.find(v => v.id === selectedVehicle) || vehicles[0];

  useEffect(() => {
    if (!selectedVehicle && vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [selectedVehicle, vehicles]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        console.log('Refreshing tracking data...');
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      moving: 'bg-green-100 text-green-800 border-green-200',
      stopped: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      idle: 'bg-blue-100 text-blue-800 border-blue-200',
      loading: 'bg-purple-100 text-purple-800 border-purple-200',
      unloading: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSensorStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getSensorIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      temperature: <Thermometer className="w-4 h-4" />,
      humidity: <Droplets className="w-4 h-4" />,
      pressure: <Gauge className="w-4 h-4" />,
      shock: <Activity className="w-4 h-4" />,
      light: <Sun className="w-4 h-4" />,
      door: <Lock className="w-4 h-4" />,
      fuel: <Battery className="w-4 h-4" />,
      speed: <Gauge className="w-4 h-4" />,
      location: <MapPin className="w-4 h-4" />,
    };
    return icons[type] || <Activity className="w-4 h-4" />;
  };

  const stats = {
    totalVehicles: vehicles.length,
    moving: vehicles.filter(v => v.status === 'moving').length,
    stopped: vehicles.filter(v => v.status === 'stopped').length,
    online: vehicles.filter(v => v.connectivity === 'online').length,
    alerts: vehicles.reduce((count, v) => count + v.sensors.filter(s => s.status === 'critical' || s.status === 'warning').length, 0),
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Tracking & IoT Monitoring</h1>
            <p className="text-sm text-gray-600 mt-0.5">Real-time vehicle tracking, route monitoring, and sensor telemetry</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Share View
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export Data
            </Button>
            <Button
              variant={autoRefresh ? 'primary' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-0.5">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Truck className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-0.5">Moving</p>
                <p className="text-2xl font-bold text-green-600">{stats.moving}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
                <Navigation className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-0.5">Stopped</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.stopped}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-md">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-0.5">Online</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.online}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Wifi className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-0.5">Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.alerts}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Information - Above Map */}
      {selected && (
        <Card className="mb-4">
          <CardHeader className="p-3 border-b border-gray-200">
            <CardTitle className="text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Route Information - {selected.vehicleNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Current Location</p>
                <p className="text-sm font-medium text-gray-900">{selected.location.address}</p>
                <p className="text-xs text-gray-600">{selected.location.city}, {selected.location.state}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Destination</p>
                <p className="text-sm font-medium text-gray-900">{selected.destination.address}</p>
                <p className="text-xs text-gray-600">{selected.destination.city}, {selected.destination.state}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ETA: {selected.destination.eta}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-0.5">Traveled</p>
                  <p className="text-sm font-bold text-blue-900">{selected.distanceTraveled} mi</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 mb-0.5">Remaining</p>
                  <p className="text-sm font-bold text-green-900">{selected.distanceRemaining} mi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map View and Vehicle Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between p-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                Live Map View
              </CardTitle>
              <div className="flex gap-2">
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setMapView('map')}
                    className={`px-2.5 py-1 text-xs font-medium ${
                      mapView === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Map
                  </button>
                  <button
                    onClick={() => setMapView('satellite')}
                    className={`px-2.5 py-1 text-xs font-medium border-l border-gray-300 ${
                      mapView === 'satellite' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Satellite
                  </button>
                  <button
                    onClick={() => setMapView('hybrid')}
                    className={`px-2.5 py-1 text-xs font-medium border-l border-gray-300 ${
                      mapView === 'hybrid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Hybrid
                  </button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowTraffic(!showTraffic)}>
                  <Layers className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative h-[500px]">
              {/* Map Placeholder with Visual Route */}
              <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                {/* Grid overlay for map effect */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Vehicle Markers */}
                {vehicles.map((vehicle, idx) => (
                  <div
                    key={vehicle.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                      selectedVehicle === vehicle.id ? 'scale-125 z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${25 + idx * 25}%`,
                      top: `${30 + idx * 15}%`,
                    }}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <div className={`relative ${selectedVehicle === vehicle.id ? 'animate-pulse' : ''}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                          vehicle.status === 'moving'
                            ? 'bg-green-600'
                            : vehicle.status === 'stopped'
                            ? 'bg-yellow-600'
                            : 'bg-blue-600'
                        } text-white`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      {selectedVehicle === vehicle.id && (
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-2 whitespace-nowrap border-2 border-blue-500">
                          <p className="text-xs font-bold text-gray-900">{vehicle.vehicleNumber}</p>
                          <p className="text-xs text-gray-600">{vehicle.driver}</p>
                          <p className="text-xs text-gray-500">{vehicle.speed} mph</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Route Path */}
                {showRoute && selected && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <path
                      d={`M ${selected.route.map((_, i) => `${25 + (i / selected.route.length) * 50}% ${30 + (i / selected.route.length) * 40}%`).join(' L ')}`}
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray="10,5"
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>
                )}

                {/* Traffic Layer Simulation */}
                {showTraffic && (
                  <>
                    <div className="absolute top-1/4 left-1/3 w-20 h-1 bg-green-500 opacity-70 rounded"></div>
                    <div className="absolute top-1/2 right-1/4 w-16 h-1 bg-yellow-500 opacity-70 rounded"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-12 h-1 bg-red-500 opacity-70 rounded"></div>
                  </>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs">
                  <p className="font-semibold text-gray-900 mb-1.5">Status Legend</p>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span className="text-gray-700">Moving</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                    <span className="text-gray-700">Stopped</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-gray-700">Idle</span>
                  </div>
                </div>

                {/* Traffic Legend */}
                {showTraffic && (
                  <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 text-xs">
                    <p className="font-semibold text-gray-900 mb-1.5">Traffic</p>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-3 h-1 bg-green-500"></div>
                      <span className="text-gray-700">Light</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-3 h-1 bg-yellow-500"></div>
                      <span className="text-gray-700">Moderate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-1 bg-red-500"></div>
                      <span className="text-gray-700">Heavy</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Selector */}
        <div>
          <Card>
            <CardHeader className="p-3 border-b border-gray-200">
              <CardTitle className="text-sm">Select Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1.5">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`w-full p-2.5 rounded-lg text-left transition-all ${
                      selectedVehicle === vehicle.id
                        ? 'bg-blue-50 border-2 border-blue-600'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900">{vehicle.vehicleNumber}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{vehicle.driver}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {vehicle.location.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        {vehicle.speed} mph
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* IoT Sensor Data */}
      {selected && (
        <Card>
          <CardHeader className="p-3 border-b border-gray-200">
            <CardTitle className="text-sm flex items-center gap-2">
              <Radio className="w-4 h-4" />
              IoT Sensor Data - {selected.vehicleNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {selected.sensors.map((sensor) => (
                      <div
                        key={sensor.id}
                        className={`p-2.5 rounded-lg border ${
                          sensor.status === 'critical'
                            ? 'bg-red-50 border-red-200'
                            : sensor.status === 'warning'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className={getSensorStatusColor(sensor.status)}>
                              {getSensorIcon(sensor.type)}
                            </div>
                            <span className="text-xs font-semibold text-gray-900">{sensor.name}</span>
                          </div>
                          {sensor.status === 'critical' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                          {sensor.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                          {sensor.status === 'normal' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className={`text-lg font-bold ${getSensorStatusColor(sensor.status)}`}>
                            {sensor.value} {sensor.unit}
                          </span>
                          <span className="text-xs text-gray-500">{sensor.lastUpdate}</span>
                        </div>
                        {(sensor.threshold.min !== undefined || sensor.threshold.max !== undefined) && (
                          <div className="mt-1.5">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  sensor.status === 'critical'
                                    ? 'bg-red-600'
                                    : sensor.status === 'warning'
                                    ? 'bg-yellow-600'
                                    : 'bg-green-600'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    ((Number(sensor.value) - (sensor.threshold.min || 0)) /
                                      ((sensor.threshold.max || 100) - (sensor.threshold.min || 0))) *
                                      100
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                              <span>Min: {sensor.threshold.min}</span>
                              <span>Max: {sensor.threshold.max}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default LiveTracking;
