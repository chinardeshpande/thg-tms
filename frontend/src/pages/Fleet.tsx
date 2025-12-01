import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Search,
  Plus,
  Truck,
  Navigation,
  Radio,
  Fuel,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  User,
  MapPin,
  Filter,
  Eye,
  Edit,
  Calendar,
  Activity,
  TrendingUp,
  Wrench,
} from 'lucide-react';

interface Vehicle {
  id: string;
  vehicleNumber: string;
  licensePlate: string;
  type: 'Truck' | 'Van' | 'Semi-Trailer' | 'Container';
  make: string;
  model: string;
  year: number;
  status: 'Available' | 'In Transit' | 'Loading' | 'Unloading' | 'Maintenance' | 'Out of Service';
  currentLocation: string;
  coordinates: { lat: number; lng: number };
  driver: {
    name: string;
    phone: string;
    license: string;
  } | null;
  capacity: {
    weight: number;
    volume: number;
  };
  currentLoad: {
    weight: number;
    volume: number;
    shipmentCount: number;
  };
  iotEnabled: boolean;
  iotDeviceId?: string;
  fuelLevel: number;
  odometer: number;
  nextMaintenance: string;
  lastMaintenance: string;
  assignedRoute?: string;
  estimatedArrival?: string;
}

const Fleet: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [vehicles] = useState<Vehicle[]>([
    {
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
        license: 'CDL-A-12345',
      },
      capacity: {
        weight: 45000,
        volume: 3000,
      },
      currentLoad: {
        weight: 32000,
        volume: 2100,
        shipmentCount: 8,
      },
      iotEnabled: true,
      iotDeviceId: 'IOT-VEH-001',
      fuelLevel: 68,
      odometer: 145320,
      nextMaintenance: '2025-12-15',
      lastMaintenance: '2025-10-15',
      assignedRoute: 'LA → NY',
      estimatedArrival: '2 hours',
    },
    {
      id: '2',
      vehicleNumber: 'VEH-002',
      licensePlate: 'NY-MX-4567',
      type: 'Van',
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2023,
      status: 'Loading',
      currentLocation: 'New York Distribution Center',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      driver: {
        name: 'Sarah Chen',
        phone: '+1 (555) 345-6789',
        license: 'CDL-B-67890',
      },
      capacity: {
        weight: 5000,
        volume: 500,
      },
      currentLoad: {
        weight: 1800,
        volume: 180,
        shipmentCount: 12,
      },
      iotEnabled: true,
      iotDeviceId: 'IOT-VEH-002',
      fuelLevel: 92,
      odometer: 45600,
      nextMaintenance: '2026-01-20',
      lastMaintenance: '2025-11-10',
      assignedRoute: 'NY → Boston',
      estimatedArrival: '4 hours',
    },
    {
      id: '3',
      vehicleNumber: 'VEH-003',
      licensePlate: 'TX-DL-9012',
      type: 'Semi-Trailer',
      make: 'Kenworth',
      model: 'T680',
      year: 2021,
      status: 'In Transit',
      currentLocation: 'Denver, CO',
      coordinates: { lat: 39.7392, lng: -104.9903 },
      driver: {
        name: 'James Wilson',
        phone: '+1 (555) 456-7890',
        license: 'CDL-A-34567',
      },
      capacity: {
        weight: 80000,
        volume: 5000,
      },
      currentLoad: {
        weight: 65000,
        volume: 4200,
        shipmentCount: 15,
      },
      iotEnabled: true,
      iotDeviceId: 'IOT-VEH-003',
      fuelLevel: 45,
      odometer: 234890,
      nextMaintenance: '2025-12-05',
      lastMaintenance: '2025-09-20',
      assignedRoute: 'Seattle → Miami',
      estimatedArrival: '12 hours',
    },
    {
      id: '4',
      vehicleNumber: 'VEH-004',
      licensePlate: 'FL-MI-3456',
      type: 'Truck',
      make: 'Volvo',
      model: 'VNL 760',
      year: 2023,
      status: 'Available',
      currentLocation: 'Atlanta Distribution Center',
      coordinates: { lat: 33.7490, lng: -84.3880 },
      driver: null,
      capacity: {
        weight: 50000,
        volume: 3500,
      },
      currentLoad: {
        weight: 0,
        volume: 0,
        shipmentCount: 0,
      },
      iotEnabled: true,
      iotDeviceId: 'IOT-VEH-004',
      fuelLevel: 100,
      odometer: 23450,
      nextMaintenance: '2026-02-10',
      lastMaintenance: '2025-11-25',
    },
    {
      id: '5',
      vehicleNumber: 'VEH-005',
      licensePlate: 'IL-CH-7890',
      type: 'Truck',
      make: 'Peterbilt',
      model: '579',
      year: 2020,
      status: 'Maintenance',
      currentLocation: 'Chicago Service Center',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      driver: null,
      capacity: {
        weight: 48000,
        volume: 3200,
      },
      currentLoad: {
        weight: 0,
        volume: 0,
        shipmentCount: 0,
      },
      iotEnabled: true,
      iotDeviceId: 'IOT-VEH-005',
      fuelLevel: 25,
      odometer: 198750,
      nextMaintenance: '2025-12-01',
      lastMaintenance: '2025-11-28',
    },
    {
      id: '6',
      vehicleNumber: 'VEH-006',
      licensePlate: 'AZ-PH-5678',
      type: 'Container',
      make: 'Mack',
      model: 'Anthem',
      year: 2022,
      status: 'Unloading',
      currentLocation: 'Phoenix Warehouse',
      coordinates: { lat: 33.4484, lng: -112.0740 },
      driver: {
        name: 'David Martinez',
        phone: '+1 (555) 567-8901',
        license: 'CDL-A-45678',
      },
      capacity: {
        weight: 70000,
        volume: 4500,
      },
      currentLoad: {
        weight: 48000,
        volume: 3100,
        shipmentCount: 10,
      },
      iotEnabled: true,
      iotDeviceId: 'IOT-VEH-006',
      fuelLevel: 55,
      odometer: 167890,
      nextMaintenance: '2025-12-20',
      lastMaintenance: '2025-10-05',
      assignedRoute: 'LA → Phoenix',
      estimatedArrival: 'Arrived',
    },
  ]);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    const matchesSearch =
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Available': 'bg-green-100 text-green-800 border-green-200',
      'In Transit': 'bg-blue-100 text-blue-800 border-blue-200',
      'Loading': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Unloading': 'bg-orange-100 text-orange-800 border-orange-200',
      'Maintenance': 'bg-purple-100 text-purple-800 border-purple-200',
      'Out of Service': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    return <Truck className="w-5 h-5" />;
  };

  const getFuelColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available').length,
    inTransit: vehicles.filter(v => v.status === 'In Transit').length,
    loading: vehicles.filter(v => v.status === 'Loading' || v.status === 'Unloading').length,
    maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
    iotEnabled: vehicles.filter(v => v.iotEnabled).length,
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your vehicle fleet in real-time</p>
          </div>
          <Button
            variant="primary"
            onClick={() => alert('Add Vehicle')}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Available</p>
                <p className="text-3xl font-bold text-green-600">{stats.available}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Navigation className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Loading/Unloading</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.loading}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Maintenance</p>
                <p className="text-3xl font-bold text-purple-600">{stats.maintenance}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <Wrench className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">IoT Enabled</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.iotEnabled}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
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
                placeholder="Search by vehicle number, license plate, driver, or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { value: 'all', label: 'All' },
                { value: 'Available', label: 'Available' },
                { value: 'In Transit', label: 'In Transit' },
                { value: 'Loading', label: 'Loading' },
                { value: 'Maintenance', label: 'Maintenance' },
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

      {/* Vehicles Grid */}
      <div className="space-y-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Section - Vehicle Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Truck className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {vehicle.vehicleNumber}
                        </h3>
                        <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                      {vehicle.iotEnabled && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          <Radio className="w-3 h-3" />
                          IoT: {vehicle.iotDeviceId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Location</p>
                      <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {vehicle.currentLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Driver</p>
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle.driver ? vehicle.driver.name : 'Unassigned'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Load Capacity</p>
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle.currentLoad.weight.toLocaleString()} / {vehicle.capacity.weight.toLocaleString()} lbs
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Shipments</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {vehicle.currentLoad.shipmentCount}
                      </p>
                    </div>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Weight Utilization</span>
                      <span className="text-xs font-bold text-blue-600">
                        {Math.round((vehicle.currentLoad.weight / vehicle.capacity.weight) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(vehicle.currentLoad.weight / vehicle.capacity.weight) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Vehicle Metrics */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <div className={`flex items-center gap-1.5 mb-1 ${getFuelColor(vehicle.fuelLevel)}`}>
                          <Fuel className="w-4 h-4" />
                          <span className="text-xs font-medium">Fuel</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{vehicle.fuelLevel}%</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-1.5 mb-1 text-gray-600">
                          <Gauge className="w-4 h-4" />
                          <span className="text-xs font-medium">Odometer</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{vehicle.odometer.toLocaleString()} mi</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-1.5 mb-1 text-purple-600">
                          <Wrench className="w-4 h-4" />
                          <span className="text-xs font-medium">Next Service</span>
                        </div>
                        <p className="text-xs font-bold text-gray-900">{vehicle.nextMaintenance}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                          <Navigation className="w-4 h-4" />
                          <span className="text-xs font-medium">Coordinates</span>
                        </div>
                        <p className="text-xs font-mono text-gray-900">
                          {vehicle.coordinates.lat.toFixed(2)}°, {vehicle.coordinates.lng.toFixed(2)}°
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions & Route */}
                <div className="flex flex-col justify-between items-end gap-3 min-w-[180px]">
                  {vehicle.assignedRoute && (
                    <div className="text-right w-full">
                      <p className="text-xs text-gray-500 mb-1">Assigned Route</p>
                      <p className="text-sm font-medium text-gray-900">{vehicle.assignedRoute}</p>
                      {vehicle.estimatedArrival && (
                        <div className="flex items-center justify-end gap-1 mt-2 text-sm text-blue-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span>ETA: {vehicle.estimatedArrival}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-2 w-full">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => navigate(`/fleet/${vehicle.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Edit ${vehicle.vehicleNumber}`);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No vehicles found</p>
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

export default Fleet;
