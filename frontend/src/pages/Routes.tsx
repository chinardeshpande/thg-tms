import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import routesService, { Route as APIRoute } from '../services/routes.service';
import {
  Search,
  Plus,
  Route as RouteIcon,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Plane,
  Ship,
  Train,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  Edit,
  Eye,
  Copy,
  Zap,
  Filter,
  Globe,
  Navigation,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Calendar,
  RefreshCw,
} from 'lucide-react';

interface LaneRate {
  carrierId: string;
  carrierName: string;
  baseRate: number;
  fuelSurcharge: number;
  currency: string;
  transitDays: number;
  serviceLevel: 'Express' | 'Standard' | 'Economy';
  validFrom: string;
  validTo: string;
  minimumCharge: number;
  status: 'Active' | 'Expired' | 'Pending';
}

interface Lane {
  id: string;
  laneCode: string;
  name: string;
  origin: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  destination: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  transportMode: 'Road' | 'Air' | 'Ocean' | 'Rail' | 'Multimodal';
  distance: {
    value: number;
    unit: 'mi' | 'km';
  };
  serviceType: 'Domestic' | 'International' | 'Cross-Border';
  status: 'Active' | 'Inactive' | 'Under Review';
  rates: LaneRate[];
  activeShipments: number;
  totalShipmentsYTD: number;
  avgTransitTime: string;
  onTimeDeliveryRate: number;
  costPerMile: number;
  volumeDiscount: boolean;
  customsRequired: boolean;
  equipmentType: string[];
  frequency: string;
  preferredCarrier?: string;
  alternateCarriers: string[];
  optimizationScore: number; // 0-100
  lastOptimized: string;
}

const Routes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'lanes' | 'rates' | 'optimization'>('lanes');
  const [apiRoutes, setApiRoutes] = useState<APIRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOTE: This page currently shows lane management mock data.
  // The backend API focuses on route planning (driver/vehicle assignments).
  // A future refactoring should separate "Lanes" (carrier rates/corridors)
  // from "Routes" (actual driver routes with stops).

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await routesService.getAll(1, 20);
      setApiRoutes(response.data);
    } catch (err: any) {
      console.error('Error fetching routes:', err);
      setError(err.response?.data?.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const [lanes] = useState<Lane[]>([
    {
      id: '1',
      laneCode: 'US-WEST-001',
      name: 'LA to Seattle Express',
      origin: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postalCode: '90001',
      },
      destination: {
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        postalCode: '98101',
      },
      transportMode: 'Road',
      distance: { value: 1135, unit: 'mi' },
      serviceType: 'Domestic',
      status: 'Active',
      rates: [
        {
          carrierId: '1',
          carrierName: 'FedEx Express',
          baseRate: 850,
          fuelSurcharge: 85,
          currency: 'USD',
          transitDays: 1,
          serviceLevel: 'Express',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 500,
          status: 'Active',
        },
        {
          carrierId: '2',
          carrierName: 'UPS Ground',
          baseRate: 620,
          fuelSurcharge: 62,
          currency: 'USD',
          transitDays: 2,
          serviceLevel: 'Standard',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 350,
          status: 'Active',
        },
      ],
      activeShipments: 12,
      totalShipmentsYTD: 487,
      avgTransitTime: '18 hours',
      onTimeDeliveryRate: 98.5,
      costPerMile: 0.75,
      volumeDiscount: true,
      customsRequired: false,
      equipmentType: ['Dry Van', 'Reefer'],
      frequency: 'Daily',
      preferredCarrier: 'FedEx Express',
      alternateCarriers: ['UPS Ground', 'XPO Logistics'],
      optimizationScore: 92,
      lastOptimized: '2025-11-28 14:30',
    },
    {
      id: '2',
      laneCode: 'TRANS-AIR-001',
      name: 'LA to London Air Freight',
      origin: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postalCode: '90045',
      },
      destination: {
        city: 'London',
        state: 'England',
        country: 'UK',
        postalCode: 'LHR',
      },
      transportMode: 'Air',
      distance: { value: 5456, unit: 'mi' },
      serviceType: 'International',
      status: 'Active',
      rates: [
        {
          carrierId: '3',
          carrierName: 'British Airways Cargo',
          baseRate: 4500,
          fuelSurcharge: 675,
          currency: 'USD',
          transitDays: 2,
          serviceLevel: 'Express',
          validFrom: '2025-01-01',
          validTo: '2025-06-30',
          minimumCharge: 2500,
          status: 'Active',
        },
        {
          carrierId: '4',
          carrierName: 'DHL Air Freight',
          baseRate: 4200,
          fuelSurcharge: 630,
          currency: 'USD',
          transitDays: 3,
          serviceLevel: 'Standard',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 2000,
          status: 'Active',
        },
      ],
      activeShipments: 8,
      totalShipmentsYTD: 156,
      avgTransitTime: '2 days',
      onTimeDeliveryRate: 95.2,
      costPerMile: 0.92,
      volumeDiscount: true,
      customsRequired: true,
      equipmentType: ['Air Pallet', 'ULD Container'],
      frequency: 'Daily',
      preferredCarrier: 'DHL Air Freight',
      alternateCarriers: ['British Airways Cargo', 'Lufthansa Cargo'],
      optimizationScore: 88,
      lastOptimized: '2025-11-29 08:00',
    },
    {
      id: '3',
      laneCode: 'OCEAN-ASIA-001',
      name: 'LA to Shanghai Ocean FCL',
      origin: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postalCode: '90731',
      },
      destination: {
        city: 'Shanghai',
        state: 'Shanghai',
        country: 'China',
        postalCode: '200000',
      },
      transportMode: 'Ocean',
      distance: { value: 6434, unit: 'mi' },
      serviceType: 'International',
      status: 'Active',
      rates: [
        {
          carrierId: '5',
          carrierName: 'Maersk Line',
          baseRate: 3200,
          fuelSurcharge: 480,
          currency: 'USD',
          transitDays: 14,
          serviceLevel: 'Standard',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 2000,
          status: 'Active',
        },
        {
          carrierId: '6',
          carrierName: 'MSC Mediterranean',
          baseRate: 2950,
          fuelSurcharge: 442,
          currency: 'USD',
          transitDays: 16,
          serviceLevel: 'Economy',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 1800,
          status: 'Active',
        },
      ],
      activeShipments: 5,
      totalShipmentsYTD: 89,
      avgTransitTime: '14 days',
      onTimeDeliveryRate: 91.8,
      costPerMile: 0.57,
      volumeDiscount: true,
      customsRequired: true,
      equipmentType: ['40ft Container', '20ft Container'],
      frequency: 'Weekly',
      preferredCarrier: 'Maersk Line',
      alternateCarriers: ['MSC Mediterranean', 'COSCO Shipping'],
      optimizationScore: 85,
      lastOptimized: '2025-11-27 10:00',
    },
    {
      id: '4',
      laneCode: 'EU-CROSS-001',
      name: 'London to Paris Cross-Border',
      origin: {
        city: 'London',
        state: 'England',
        country: 'UK',
        postalCode: 'EC1A',
      },
      destination: {
        city: 'Paris',
        state: 'Île-de-France',
        country: 'France',
        postalCode: '75001',
      },
      transportMode: 'Road',
      distance: { value: 291, unit: 'mi' },
      serviceType: 'Cross-Border',
      status: 'Active',
      rates: [
        {
          carrierId: '7',
          carrierName: 'DPD UK',
          baseRate: 185,
          fuelSurcharge: 18.5,
          currency: 'GBP',
          transitDays: 1,
          serviceLevel: 'Express',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 100,
          status: 'Active',
        },
      ],
      activeShipments: 15,
      totalShipmentsYTD: 623,
      avgTransitTime: '24 hours',
      onTimeDeliveryRate: 96.7,
      costPerMile: 0.70,
      volumeDiscount: false,
      customsRequired: true,
      equipmentType: ['Van', 'Small Truck'],
      frequency: 'Daily',
      preferredCarrier: 'DPD UK',
      alternateCarriers: ['Eurotunnel Freight', 'GLS'],
      optimizationScore: 94,
      lastOptimized: '2025-11-29 06:30',
    },
    {
      id: '5',
      laneCode: 'RAIL-NORTH-001',
      name: 'Chicago to Toronto Rail',
      origin: {
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        postalCode: '60601',
      },
      destination: {
        city: 'Toronto',
        state: 'ON',
        country: 'Canada',
        postalCode: 'M5H',
      },
      transportMode: 'Rail',
      distance: { value: 515, unit: 'mi' },
      serviceType: 'Cross-Border',
      status: 'Active',
      rates: [
        {
          carrierId: '8',
          carrierName: 'CN Rail',
          baseRate: 680,
          fuelSurcharge: 68,
          currency: 'USD',
          transitDays: 3,
          serviceLevel: 'Standard',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 400,
          status: 'Active',
        },
      ],
      activeShipments: 3,
      totalShipmentsYTD: 45,
      avgTransitTime: '3 days',
      onTimeDeliveryRate: 89.3,
      costPerMile: 1.45,
      volumeDiscount: true,
      customsRequired: true,
      equipmentType: ['Rail Container', 'Boxcar'],
      frequency: 'Twice Weekly',
      preferredCarrier: 'CN Rail',
      alternateCarriers: ['CP Rail'],
      optimizationScore: 78,
      lastOptimized: '2025-11-25 16:00',
    },
    {
      id: '6',
      laneCode: 'MULTI-ASIA-001',
      name: 'NY to Tokyo Multimodal',
      origin: {
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      },
      destination: {
        city: 'Tokyo',
        state: 'Tokyo',
        country: 'Japan',
        postalCode: '100-0001',
      },
      transportMode: 'Multimodal',
      distance: { value: 6737, unit: 'mi' },
      serviceType: 'International',
      status: 'Active',
      rates: [
        {
          carrierId: '9',
          carrierName: 'Kuehne + Nagel',
          baseRate: 5200,
          fuelSurcharge: 780,
          currency: 'USD',
          transitDays: 10,
          serviceLevel: 'Standard',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          minimumCharge: 3000,
          status: 'Active',
        },
      ],
      activeShipments: 2,
      totalShipmentsYTD: 34,
      avgTransitTime: '10 days',
      onTimeDeliveryRate: 93.1,
      costPerMile: 0.89,
      volumeDiscount: true,
      customsRequired: true,
      equipmentType: ['Container', 'Air Pallet', 'Truck'],
      frequency: 'Weekly',
      preferredCarrier: 'Kuehne + Nagel',
      alternateCarriers: ['DHL Global Forwarding', 'DB Schenker'],
      optimizationScore: 81,
      lastOptimized: '2025-11-26 12:00',
    },
  ]);

  const filteredLanes = lanes.filter((lane) => {
    const matchesMode = filterMode === 'all' || lane.transportMode === filterMode;
    const matchesService = filterService === 'all' || lane.serviceType === filterService;
    const matchesSearch =
      lane.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lane.laneCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lane.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lane.destination.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMode && matchesService && matchesSearch;
  });

  const getModeIcon = (mode: string) => {
    const icons: Record<string, JSX.Element> = {
      'Road': <Truck className="w-5 h-5" />,
      'Air': <Plane className="w-5 h-5" />,
      'Ocean': <Ship className="w-5 h-5" />,
      'Rail': <Train className="w-5 h-5" />,
      'Multimodal': <Navigation className="w-5 h-5" />,
    };
    return icons[mode] || <RouteIcon className="w-5 h-5" />;
  };

  const getModeColor = (mode: string) => {
    const colors: Record<string, string> = {
      'Road': 'bg-blue-100 text-blue-800 border-blue-200',
      'Air': 'bg-purple-100 text-purple-800 border-purple-200',
      'Ocean': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Rail': 'bg-green-100 text-green-800 border-green-200',
      'Multimodal': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[mode] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getServiceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Domestic': 'bg-green-100 text-green-700',
      'International': 'bg-blue-100 text-blue-700',
      'Cross-Border': 'bg-purple-100 text-purple-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getOptimizationColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    totalLanes: lanes.length,
    activeLanes: lanes.filter(l => l.status === 'Active').length,
    totalShipments: lanes.reduce((sum, l) => sum + l.activeShipments, 0),
    avgOptimization: Math.round(lanes.reduce((sum, l) => sum + l.optimizationScore, 0) / lanes.length),
    avgOnTimeRate: (lanes.reduce((sum, l) => sum + l.onTimeDeliveryRate, 0) / lanes.length).toFixed(1),
    multiModalLanes: lanes.filter(l => l.transportMode === 'Multimodal' || l.transportMode === 'Air' || l.transportMode === 'Ocean').length,
  };

  return (
    <DashboardLayout>
      {/* API Status Notice */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Currently displaying mock lane data. API connection: {error}
          </p>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lane Management & Optimization</h1>
            <p className="text-gray-600 mt-1">Multi-modal route planning, rate management, and intelligent optimization</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Zap className="w-5 h-5" />
              Auto-Optimize
            </Button>
            <Button variant="primary" className="gap-2">
              <Plus className="w-5 h-5" />
              Create Lane
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
                <p className="text-sm font-medium text-gray-600 mb-1">Total Lanes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalLanes}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <RouteIcon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeLanes}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Active Shipments</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalShipments}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Multi-Modal</p>
                <p className="text-3xl font-bold text-orange-600">{stats.multiModalLanes}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <Globe className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Optimization</p>
                <p className={`text-3xl font-bold ${getOptimizationColor(stats.avgOptimization)}`}>{stats.avgOptimization}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">On-Time Rate</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.avgOnTimeRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'lanes', label: 'Lane Management', icon: <RouteIcon className="w-4 h-4" /> },
            { key: 'rates', label: 'Rate Comparison', icon: <DollarSign className="w-4 h-4" /> },
            { key: 'optimization', label: 'Optimization Engine', icon: <Zap className="w-4 h-4" /> },
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

      {/* Lane Management Tab */}
      {activeTab === 'lanes' && (
        <>
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by lane code, name, origin, or destination..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Modes</option>
                    <option value="Road">Road</option>
                    <option value="Air">Air</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Rail">Rail</option>
                    <option value="Multimodal">Multimodal</option>
                  </select>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Services</option>
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                    <option value="Cross-Border">Cross-Border</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lanes Grid */}
          <div className="space-y-4">
            {filteredLanes.map((lane) => (
              <Card key={lane.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${getModeColor(lane.transportMode).split(' ').slice(0, 2).join(' ')}`}>
                            {getModeIcon(lane.transportMode)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-gray-900">{lane.name}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getModeColor(lane.transportMode)}`}>
                                {lane.transportMode}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 font-mono">{lane.laneCode}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded ${getServiceTypeColor(lane.serviceType)}`}>
                                {lane.serviceType}
                              </span>
                              {lane.customsRequired && (
                                <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 border border-yellow-200">
                                  Customs Required
                                </span>
                              )}
                              {lane.volumeDiscount && (
                                <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                                  Volume Discount
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Origin</p>
                          <p className="text-sm font-medium text-gray-900">{lane.origin.city}, {lane.origin.country}</p>
                          <p className="text-xs text-gray-500">{lane.origin.postalCode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Destination</p>
                          <p className="text-sm font-medium text-gray-900">{lane.destination.city}, {lane.destination.country}</p>
                          <p className="text-xs text-gray-500">{lane.destination.postalCode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Distance</p>
                          <p className="text-sm font-medium text-gray-900">{lane.distance.value.toLocaleString()} {lane.distance.unit}</p>
                          <p className="text-xs text-gray-500">Avg: {lane.avgTransitTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Preferred Carrier</p>
                          <p className="text-sm font-medium text-blue-600">{lane.preferredCarrier || 'Not Set'}</p>
                          <p className="text-xs text-gray-500">{lane.alternateCarriers.length} alternates</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-600 mb-1">Active Shipments</p>
                          <p className="text-2xl font-bold text-blue-900">{lane.activeShipments}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-600 mb-1">YTD Shipments</p>
                          <p className="text-2xl font-bold text-green-900">{lane.totalShipmentsYTD}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-xs text-purple-600 mb-1">On-Time Rate</p>
                          <p className="text-2xl font-bold text-purple-900">{lane.onTimeDeliveryRate}%</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-600 mb-1">Optimization</p>
                          <p className={`text-2xl font-bold ${getOptimizationColor(lane.optimizationScore)}`}>{lane.optimizationScore}%</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">
                              ${lane.costPerMile.toFixed(2)}/mile • {lane.rates.length} carrier rate(s) • {lane.frequency}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last optimized: {lane.lastOptimized}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button variant="primary" size="sm" className="w-full gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <DollarSign className="w-4 h-4" />
                        Manage Rates
                      </Button>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Zap className="w-4 h-4" />
                        Optimize
                      </Button>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Lane
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Rate Comparison Tab */}
      {activeTab === 'rates' && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Carrier Rate Comparison & Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {filteredLanes.map((lane) => (
                <div key={lane.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{lane.name}</h4>
                      <p className="text-sm text-gray-600">{lane.laneCode} • {lane.transportMode}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Rate
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service Level</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Base Rate</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fuel Surcharge</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transit Days</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valid Period</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {lane.rates.map((rate, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{rate.carrierName}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                rate.serviceLevel === 'Express' ? 'bg-blue-100 text-blue-700' :
                                rate.serviceLevel === 'Standard' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {rate.serviceLevel}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">${rate.baseRate.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">${rate.fuelSurcharge.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm font-bold text-green-600">${(rate.baseRate + rate.fuelSurcharge).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{rate.transitDays} days</td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {rate.validFrom} → {rate.validTo}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                rate.status === 'Active' ? 'bg-green-100 text-green-700' :
                                rate.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {rate.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Engine Tab */}
      {activeTab === 'optimization' && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Route Optimization Engine
              </CardTitle>
              <Button variant="primary" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Run Optimization
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Intelligent Lane Optimization</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Our AI-powered optimization engine analyzes carrier performance, cost trends, transit times, and service levels
                      to recommend the best routing decisions. The system considers multiple factors including:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Cost Efficiency</p>
                        <p className="text-sm font-bold text-blue-600">Real-time rates</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Service Quality</p>
                        <p className="text-sm font-bold text-green-600">On-time performance</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Carrier Capacity</p>
                        <p className="text-sm font-bold text-purple-600">Availability</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Transit Speed</p>
                        <p className="text-sm font-bold text-orange-600">Fastest routes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-700 font-medium">High Performance Lanes</p>
                        <p className="text-2xl font-bold text-green-900">4</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-700">Optimization score &gt; 90%</p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-sm text-yellow-700 font-medium">Needs Optimization</p>
                        <p className="text-2xl font-bold text-yellow-900">2</p>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-700">Optimization score &lt; 80%</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Potential Savings</p>
                        <p className="text-2xl font-bold text-blue-900">$12,450</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700">Per month if optimized</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4">Optimization Recommendations</h4>
                <div className="space-y-3">
                  {filteredLanes.filter(l => l.optimizationScore < 90).map((lane) => (
                    <div key={lane.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-gray-900">{lane.name}</h5>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getOptimizationColor(lane.optimizationScore)}`}>
                              Score: {lane.optimizationScore}%
                            </span>
                          </div>
                          <div className="space-y-2">
                            {lane.optimizationScore < 85 && (
                              <div className="flex items-start gap-2 text-sm">
                                <TrendingDown className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700">
                                  Consider switching to {lane.alternateCarriers[0]} - potential 8% cost savings
                                </p>
                              </div>
                            )}
                            {lane.onTimeDeliveryRate < 95 && (
                              <div className="flex items-start gap-2 text-sm">
                                <Clock className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700">
                                  On-time delivery below target (current: {lane.onTimeDeliveryRate}%) - review carrier performance
                                </p>
                              </div>
                            )}
                            {!lane.volumeDiscount && (
                              <div className="flex items-start gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700">
                                  Volume qualifies for discount - negotiate better rates with preferred carrier
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-4">
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Routes;
