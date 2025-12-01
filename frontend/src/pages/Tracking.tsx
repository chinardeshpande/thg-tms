import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Search,
  Package,
  MapPin,
  Truck,
  Clock,
  TrendingUp,
  Radio,
  Thermometer,
  Gauge,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Eye,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface IoTSensor {
  type: 'gps' | 'temperature' | 'humidity' | 'shock' | 'battery';
  value: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status: 'In Transit' | 'Out for Delivery' | 'Processing' | 'Delayed' | 'Delivered';
  carrier: {
    id: string;
    name: string;
    logo: { text: string; bg: string; color: string };
  };
  eta: string;
  progress: number;
  iotEnabled: boolean;
  sensors?: IoTSensor[];
  coordinates: { lat: number; lng: number };
  customer: string;
  value: string;
  weight: string;
}

const Tracking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('id') || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [shipments, setShipments] = useState<Shipment[]>([]);

  // Mock shipments data with IoT integration
  const mockShipments: Shipment[] = [
    {
      id: '1',
      trackingNumber: 'FDX-2024-8901',
      origin: 'Los Angeles, CA',
      destination: 'New York, NY',
      currentLocation: 'Kansas City, MO',
      status: 'In Transit',
      carrier: {
        id: '1',
        name: 'FedEx Express',
        logo: { text: 'FDX', bg: 'bg-purple-600', color: 'text-white' },
      },
      eta: '2 hours',
      progress: 75,
      iotEnabled: true,
      sensors: [
        { type: 'gps', value: '39.0997° N, 94.5786° W', status: 'normal', lastUpdated: '2 mins ago' },
        { type: 'temperature', value: '22°C', status: 'normal', lastUpdated: '2 mins ago' },
        { type: 'humidity', value: '45%', status: 'normal', lastUpdated: '2 mins ago' },
        { type: 'shock', value: '0.2G', status: 'normal', lastUpdated: '2 mins ago' },
        { type: 'battery', value: '87%', status: 'normal', lastUpdated: '5 mins ago' },
      ],
      coordinates: { lat: 39.0997, lng: -94.5786 },
      customer: 'Acme Corp',
      value: '$12,450',
      weight: '245 lbs',
    },
    {
      id: '2',
      trackingNumber: 'UPS-2024-5632',
      origin: 'Seattle, WA',
      destination: 'Miami, FL',
      currentLocation: 'Phoenix, AZ',
      status: 'In Transit',
      carrier: {
        id: '2',
        name: 'UPS',
        logo: { text: 'UPS', bg: 'bg-yellow-600', color: 'text-white' },
      },
      eta: '5 hours',
      progress: 60,
      iotEnabled: true,
      sensors: [
        { type: 'gps', value: '33.4484° N, 112.0740° W', status: 'normal', lastUpdated: '1 min ago' },
        { type: 'temperature', value: '28°C', status: 'warning', lastUpdated: '1 min ago' },
        { type: 'humidity', value: '38%', status: 'normal', lastUpdated: '1 min ago' },
        { type: 'shock', value: '0.1G', status: 'normal', lastUpdated: '1 min ago' },
        { type: 'battery', value: '92%', status: 'normal', lastUpdated: '3 mins ago' },
      ],
      coordinates: { lat: 33.4484, lng: -112.0740 },
      customer: 'TechStart Inc',
      value: '$8,220',
      weight: '180 lbs',
    },
    {
      id: '3',
      trackingNumber: 'DHL-2024-9234',
      origin: 'Boston, MA',
      destination: 'San Francisco, CA',
      currentLocation: 'Denver, CO',
      status: 'In Transit',
      carrier: {
        id: '4',
        name: 'DHL Express',
        logo: { text: 'DHL', bg: 'bg-red-600', color: 'text-yellow-400' },
      },
      eta: '4 hours',
      progress: 65,
      iotEnabled: true,
      sensors: [
        { type: 'gps', value: '39.7392° N, 104.9903° W', status: 'normal', lastUpdated: '3 mins ago' },
        { type: 'temperature', value: '20°C', status: 'normal', lastUpdated: '3 mins ago' },
        { type: 'humidity', value: '52%', status: 'normal', lastUpdated: '3 mins ago' },
        { type: 'shock', value: '0.3G', status: 'warning', lastUpdated: '3 mins ago' },
        { type: 'battery', value: '78%', status: 'normal', lastUpdated: '6 mins ago' },
      ],
      coordinates: { lat: 39.7392, lng: -104.9903 },
      customer: 'Global Logistics',
      value: '$15,890',
      weight: '320 lbs',
    },
    {
      id: '4',
      trackingNumber: 'FDX-2024-7721',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      currentLocation: 'Atlanta Distribution Center',
      status: 'Out for Delivery',
      carrier: {
        id: '1',
        name: 'FedEx Express',
        logo: { text: 'FDX', bg: 'bg-purple-600', color: 'text-white' },
      },
      eta: '30 mins',
      progress: 95,
      iotEnabled: true,
      sensors: [
        { type: 'gps', value: '33.7490° N, 84.3880° W', status: 'normal', lastUpdated: '1 min ago' },
        { type: 'temperature', value: '23°C', status: 'normal', lastUpdated: '1 min ago' },
        { type: 'humidity', value: '48%', status: 'normal', lastUpdated: '1 min ago' },
        { type: 'shock', value: '0.1G', status: 'normal', lastUpdated: '1 min ago' },
        { type: 'battery', value: '65%', status: 'warning', lastUpdated: '4 mins ago' },
      ],
      coordinates: { lat: 33.7490, lng: -84.3880 },
      customer: 'Southern Wholesale',
      value: '$6,780',
      weight: '120 lbs',
    },
    {
      id: '5',
      trackingNumber: 'MSK-2024-3345',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, CA',
      currentLocation: 'Pacific Ocean',
      status: 'In Transit',
      carrier: {
        id: '3',
        name: 'Maersk',
        logo: { text: 'MSK', bg: 'bg-blue-700', color: 'text-white' },
      },
      eta: '5 days',
      progress: 40,
      iotEnabled: true,
      sensors: [
        { type: 'gps', value: '35.0000° N, 150.0000° W', status: 'normal', lastUpdated: '15 mins ago' },
        { type: 'temperature', value: '18°C', status: 'normal', lastUpdated: '15 mins ago' },
        { type: 'humidity', value: '72%', status: 'normal', lastUpdated: '15 mins ago' },
        { type: 'shock', value: '0.4G', status: 'normal', lastUpdated: '15 mins ago' },
        { type: 'battery', value: '94%', status: 'normal', lastUpdated: '20 mins ago' },
      ],
      coordinates: { lat: 35.0000, lng: -150.0000 },
      customer: 'Import Solutions LLC',
      value: '$85,000',
      weight: '12,500 lbs',
    },
    {
      id: '6',
      trackingNumber: 'UPS-2024-4456',
      origin: 'Dallas, TX',
      destination: 'Portland, OR',
      currentLocation: 'Salt Lake City, UT',
      status: 'Delayed',
      carrier: {
        id: '2',
        name: 'UPS',
        logo: { text: 'UPS', bg: 'bg-yellow-600', color: 'text-white' },
      },
      eta: '8 hours',
      progress: 55,
      iotEnabled: true,
      sensors: [
        { type: 'gps', value: '40.7608° N, 111.8910° W', status: 'normal', lastUpdated: '5 mins ago' },
        { type: 'temperature', value: '32°C', status: 'critical', lastUpdated: '5 mins ago' },
        { type: 'humidity', value: '28%', status: 'warning', lastUpdated: '5 mins ago' },
        { type: 'shock', value: '0.2G', status: 'normal', lastUpdated: '5 mins ago' },
        { type: 'battery', value: '56%', status: 'warning', lastUpdated: '7 mins ago' },
      ],
      coordinates: { lat: 40.7608, lng: -111.8910 },
      customer: 'Northwest Trading',
      value: '$9,340',
      weight: '195 lbs',
    },
  ];

  useEffect(() => {
    setShipments(mockShipments);
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesSearch =
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
      gps: <Navigation className="w-4 h-4" />,
      temperature: <Thermometer className="w-4 h-4" />,
      humidity: <Gauge className="w-4 h-4" />,
      shock: <Radio className="w-4 h-4" />,
      battery: <Battery className="w-4 h-4" />,
    };
    return icons[type];
  };

  const getSensorStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    outForDelivery: shipments.filter(s => s.status === 'Out for Delivery').length,
    delayed: shipments.filter(s => s.status === 'Delayed').length,
    iotEnabled: shipments.filter(s => s.iotEnabled).length,
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
            <p className="text-gray-600 mt-1">Real-time shipment tracking with IoT sensor integration</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShipments([...mockShipments])}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Shipments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Package className="w-6 h-6" />
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
                <p className="text-sm font-medium text-gray-600 mb-1">Out for Delivery</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.outForDelivery}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Delayed</p>
                <p className="text-3xl font-bold text-red-600">{stats.delayed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">IoT Enabled</p>
                <p className="text-3xl font-bold text-green-600">{stats.iotEnabled}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <Radio className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by tracking number, customer, or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { value: 'all', label: 'All' },
                { value: 'In Transit', label: 'In Transit' },
                { value: 'Out for Delivery', label: 'Out for Delivery' },
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

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Section - Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${shipment.carrier.logo.bg} rounded-lg flex items-center justify-center ${shipment.carrier.logo.color} font-bold shadow-lg`}>
                        {shipment.carrier.logo.text}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {shipment.trackingNumber}
                        </h3>
                        <p className="text-sm text-gray-600">{shipment.carrier.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                      {shipment.iotEnabled && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          <Radio className="w-3 h-3" />
                          IoT Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Origin</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Destination</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.destination}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Location</p>
                      <p className="text-sm font-medium text-blue-600">{shipment.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ETA</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {shipment.eta}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Progress</span>
                      <span className="text-xs font-bold text-blue-600">{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* IoT Sensors */}
                  {shipment.iotEnabled && shipment.sensors && (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Radio className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-900">IoT Sensor Data</span>
                        <span className="text-xs text-gray-500 ml-auto">Live Updates</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {shipment.sensors.map((sensor, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-lg border border-gray-200">
                            <div className={`flex items-center gap-1.5 mb-1 ${getSensorStatusColor(sensor.status)}`}>
                              {getSensorIcon(sensor.type)}
                              <span className="text-xs font-medium capitalize">{sensor.type}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{sensor.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{sensor.lastUpdated}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section - Actions */}
                <div className="flex flex-col justify-between items-end gap-3 min-w-[140px]">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <p className="text-sm font-medium text-gray-900">{shipment.customer}</p>
                    <p className="text-xs text-gray-500 mt-2">Value</p>
                    <p className="text-sm font-bold text-green-600">{shipment.value}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => navigate(`/tracking/${shipment.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredShipments.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No shipments found</p>
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

export default Tracking;
