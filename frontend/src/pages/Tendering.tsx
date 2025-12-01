import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Search,
  Plus,
  Send,
  Check,
  X,
  Clock,
  DollarSign,
  Truck,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Zap,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  ArrowRight,
  Timer,
  Target,
  BarChart3,
  Settings,
  FileText,
  Users,
} from 'lucide-react';

interface CarrierBid {
  carrierId: string;
  carrierName: string;
  bidAmount: number;
  currency: string;
  transitDays: number;
  serviceLevel: 'Express' | 'Standard' | 'Economy';
  estimatedPickup: string;
  estimatedDelivery: string;
  bidStatus: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
  bidSubmittedAt: string;
  bidExpiresAt: string;
  onTimeRate: number;
  carrierRating: number;
  capacityConfirmed: boolean;
  equipmentType: string;
  fuelSurcharge: number;
  accessorialCharges: number;
  totalCost: number;
  notes?: string;
}

interface TenderLoad {
  id: string;
  tenderNumber: string;
  status: 'Draft' | 'Pending' | 'In Progress' | 'Awarded' | 'Rejected' | 'Expired' | 'Cancelled';
  loadType: 'FTL' | 'LTL' | 'Intermodal' | 'Expedited';
  priority: 'Standard' | 'High' | 'Critical';
  origin: {
    name: string;
    city: string;
    state: string;
    postalCode: string;
  };
  destination: {
    name: string;
    city: string;
    state: string;
    postalCode: string;
  };
  pickupDate: string;
  deliveryDate: string;
  distance: number;
  weight: number;
  pallets: number;
  commodity: string;
  specialRequirements: string[];
  estimatedCost: number;
  targetCost: number;
  carrierBids: CarrierBid[];
  selectedCarrier?: string;
  awardedAmount?: number;
  createdAt: string;
  tenderSentAt?: string;
  responseDeadline: string;
  autoAward: boolean;
  autoAwardCriteria: 'Lowest Cost' | 'Best Rating' | 'Fastest Transit' | 'Balanced Score';
  customer: string;
  shipmentId?: string;
  rules: SelectionRule[];
}

interface SelectionRule {
  id: string;
  name: string;
  priority: number;
  criteria: 'cost' | 'rating' | 'transit_time' | 'on_time_rate' | 'capacity';
  operator: 'min' | 'max' | 'threshold';
  value: number;
  weight: number;
  enabled: boolean;
}

interface CarrierPool {
  id: string;
  name: string;
  carrierIds: string[];
  laneTypes: string[];
  serviceTypes: string[];
  autoTender: boolean;
  priority: number;
}

const Tendering: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tenders' | 'bids' | 'automation' | 'performance'>('tenders');

  const [tenderLoads] = useState<TenderLoad[]>([
    {
      id: '1',
      tenderNumber: 'TND-2024-001',
      status: 'In Progress',
      loadType: 'FTL',
      priority: 'High',
      origin: {
        name: 'LA Distribution Center',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
      },
      destination: {
        name: 'Seattle Warehouse',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
      },
      pickupDate: '2025-11-30 08:00 AM',
      deliveryDate: '2025-12-01 05:00 PM',
      distance: 1135,
      weight: 42000,
      pallets: 20,
      commodity: 'Electronics',
      specialRequirements: ['Temperature Controlled', 'Liftgate Required'],
      estimatedCost: 2800,
      targetCost: 2600,
      carrierBids: [
        {
          carrierId: '1',
          carrierName: 'FedEx Freight',
          bidAmount: 2650,
          currency: 'USD',
          transitDays: 1,
          serviceLevel: 'Express',
          estimatedPickup: '2025-11-30 08:00 AM',
          estimatedDelivery: '2025-12-01 04:00 PM',
          bidStatus: 'Pending',
          bidSubmittedAt: '2025-11-29 02:30 PM',
          bidExpiresAt: '2025-11-29 06:00 PM',
          onTimeRate: 96.5,
          carrierRating: 4.8,
          capacityConfirmed: true,
          equipmentType: 'Dry Van 53ft',
          fuelSurcharge: 265,
          accessorialCharges: 150,
          totalCost: 3065,
          notes: 'Can provide temperature-controlled trailer',
        },
        {
          carrierId: '2',
          carrierName: 'UPS Freight',
          bidAmount: 2450,
          currency: 'USD',
          transitDays: 2,
          serviceLevel: 'Standard',
          estimatedPickup: '2025-11-30 10:00 AM',
          estimatedDelivery: '2025-12-01 06:00 PM',
          bidStatus: 'Pending',
          bidSubmittedAt: '2025-11-29 02:15 PM',
          bidExpiresAt: '2025-11-29 06:00 PM',
          onTimeRate: 94.2,
          carrierRating: 4.6,
          capacityConfirmed: true,
          equipmentType: 'Dry Van 53ft',
          fuelSurcharge: 245,
          accessorialCharges: 100,
          totalCost: 2795,
        },
        {
          carrierId: '3',
          carrierName: 'XPO Logistics',
          bidAmount: 2350,
          currency: 'USD',
          transitDays: 2,
          serviceLevel: 'Standard',
          estimatedPickup: '2025-11-30 12:00 PM',
          estimatedDelivery: '2025-12-01 08:00 PM',
          bidStatus: 'Pending',
          bidSubmittedAt: '2025-11-29 01:45 PM',
          bidExpiresAt: '2025-11-29 06:00 PM',
          onTimeRate: 92.1,
          carrierRating: 4.3,
          capacityConfirmed: true,
          equipmentType: 'Dry Van 53ft',
          fuelSurcharge: 235,
          accessorialCharges: 120,
          totalCost: 2705,
          notes: 'Limited temperature control capability',
        },
      ],
      createdAt: '2025-11-29 01:00 PM',
      tenderSentAt: '2025-11-29 01:15 PM',
      responseDeadline: '2025-11-29 06:00 PM',
      autoAward: true,
      autoAwardCriteria: 'Balanced Score',
      customer: 'Best Buy - Phoenix',
      rules: [
        { id: '1', name: 'Cost Optimization', priority: 1, criteria: 'cost', operator: 'min', value: 0, weight: 40, enabled: true },
        { id: '2', name: 'Quality Threshold', priority: 2, criteria: 'rating', operator: 'threshold', value: 4.5, weight: 30, enabled: true },
        { id: '3', name: 'On-Time Performance', priority: 3, criteria: 'on_time_rate', operator: 'threshold', value: 95, weight: 30, enabled: true },
      ],
    },
    {
      id: '2',
      tenderNumber: 'TND-2024-002',
      status: 'Awarded',
      loadType: 'LTL',
      priority: 'Standard',
      origin: {
        name: 'Chicago Hub',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
      },
      destination: {
        name: 'Toronto Distribution',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5H',
      },
      pickupDate: '2025-11-30 10:00 AM',
      deliveryDate: '2025-12-02 03:00 PM',
      distance: 515,
      weight: 8500,
      pallets: 5,
      commodity: 'Industrial Parts',
      specialRequirements: [],
      estimatedCost: 680,
      targetCost: 650,
      carrierBids: [
        {
          carrierId: '4',
          carrierName: 'CN Rail',
          bidAmount: 630,
          currency: 'USD',
          transitDays: 3,
          serviceLevel: 'Standard',
          estimatedPickup: '2025-11-30 10:00 AM',
          estimatedDelivery: '2025-12-02 02:00 PM',
          bidStatus: 'Accepted',
          bidSubmittedAt: '2025-11-28 03:20 PM',
          bidExpiresAt: '2025-11-29 12:00 PM',
          onTimeRate: 89.3,
          carrierRating: 4.5,
          capacityConfirmed: true,
          equipmentType: 'Rail Container',
          fuelSurcharge: 63,
          accessorialCharges: 50,
          totalCost: 743,
        },
      ],
      selectedCarrier: 'CN Rail',
      awardedAmount: 630,
      createdAt: '2025-11-28 02:00 PM',
      tenderSentAt: '2025-11-28 02:30 PM',
      responseDeadline: '2025-11-29 12:00 PM',
      autoAward: false,
      autoAwardCriteria: 'Lowest Cost',
      customer: 'Automotive Parts Ltd',
      shipmentId: 'SHP-2024-1234',
      rules: [
        { id: '1', name: 'Cost Optimization', priority: 1, criteria: 'cost', operator: 'min', value: 0, weight: 60, enabled: true },
        { id: '2', name: 'Transit Time', priority: 2, criteria: 'transit_time', operator: 'max', value: 3, weight: 40, enabled: true },
      ],
    },
    {
      id: '3',
      tenderNumber: 'TND-2024-003',
      status: 'Pending',
      loadType: 'Expedited',
      priority: 'Critical',
      origin: {
        name: 'Miami Dock',
        city: 'Miami',
        state: 'FL',
        postalCode: '33101',
      },
      destination: {
        name: 'Atlanta Distribution',
        city: 'Atlanta',
        state: 'GA',
        postalCode: '30301',
      },
      pickupDate: '2025-11-29 06:00 PM',
      deliveryDate: '2025-11-30 08:00 AM',
      distance: 662,
      weight: 15000,
      pallets: 10,
      commodity: 'Perishable Food',
      specialRequirements: ['Temperature Controlled', 'Expedited Service', '24/7 Monitoring'],
      estimatedCost: 1500,
      targetCost: 1400,
      carrierBids: [],
      createdAt: '2025-11-29 03:00 PM',
      responseDeadline: '2025-11-29 05:00 PM',
      autoAward: true,
      autoAwardCriteria: 'Fastest Transit',
      customer: 'Fresh Foods Inc',
      rules: [
        { id: '1', name: 'Transit Speed', priority: 1, criteria: 'transit_time', operator: 'max', value: 1, weight: 50, enabled: true },
        { id: '2', name: 'Quality Threshold', priority: 2, criteria: 'rating', operator: 'threshold', value: 4.7, weight: 30, enabled: true },
        { id: '3', name: 'Capacity Confirmed', priority: 3, criteria: 'capacity', operator: 'threshold', value: 1, weight: 20, enabled: true },
      ],
    },
    {
      id: '4',
      tenderNumber: 'TND-2024-004',
      status: 'Rejected',
      loadType: 'FTL',
      priority: 'Standard',
      origin: {
        name: 'Houston Plant',
        city: 'Houston',
        state: 'TX',
        postalCode: '77001',
      },
      destination: {
        name: 'Dallas Warehouse',
        city: 'Dallas',
        state: 'TX',
        postalCode: '75201',
      },
      pickupDate: '2025-11-28 09:00 AM',
      deliveryDate: '2025-11-28 06:00 PM',
      distance: 239,
      weight: 38000,
      pallets: 18,
      commodity: 'Textiles',
      specialRequirements: [],
      estimatedCost: 450,
      targetCost: 400,
      carrierBids: [
        {
          carrierId: '5',
          carrierName: 'Old Dominion',
          bidAmount: 520,
          currency: 'USD',
          transitDays: 1,
          serviceLevel: 'Standard',
          estimatedPickup: '2025-11-28 09:00 AM',
          estimatedDelivery: '2025-11-28 06:00 PM',
          bidStatus: 'Rejected',
          bidSubmittedAt: '2025-11-27 04:00 PM',
          bidExpiresAt: '2025-11-28 08:00 AM',
          onTimeRate: 93.8,
          carrierRating: 4.5,
          capacityConfirmed: false,
          equipmentType: 'Dry Van 53ft',
          fuelSurcharge: 52,
          accessorialCharges: 75,
          totalCost: 647,
          notes: 'Bid exceeds target cost significantly',
        },
      ],
      createdAt: '2025-11-27 03:00 PM',
      tenderSentAt: '2025-11-27 03:30 PM',
      responseDeadline: '2025-11-28 08:00 AM',
      autoAward: false,
      autoAwardCriteria: 'Lowest Cost',
      customer: 'Global Textiles Ltd',
      rules: [
        { id: '1', name: 'Cost Cap', priority: 1, criteria: 'cost', operator: 'threshold', value: 450, weight: 100, enabled: true },
      ],
    },
  ]);

  const [carrierPools] = useState<CarrierPool[]>([
    {
      id: '1',
      name: 'Premium Express Carriers',
      carrierIds: ['1', '4'],
      laneTypes: ['FTL', 'Expedited'],
      serviceTypes: ['Express', 'Standard'],
      autoTender: true,
      priority: 1,
    },
    {
      id: '2',
      name: 'Standard Freight Network',
      carrierIds: ['2', '3', '5'],
      laneTypes: ['FTL', 'LTL'],
      serviceTypes: ['Standard', 'Economy'],
      autoTender: true,
      priority: 2,
    },
    {
      id: '3',
      name: 'Temperature-Controlled Specialists',
      carrierIds: ['1', '6'],
      laneTypes: ['FTL', 'Expedited'],
      serviceTypes: ['Express'],
      autoTender: true,
      priority: 1,
    },
  ]);

  const filteredTenders = tenderLoads.filter((tender) => {
    const matchesStatus = filterStatus === 'all' || tender.status === filterStatus;
    const matchesSearch =
      tender.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.destination.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Awarded': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Expired': 'bg-orange-100 text-orange-800 border-orange-200',
      'Cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getBidStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Expired': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Standard': 'bg-gray-100 text-gray-700',
      'High': 'bg-orange-100 text-orange-700',
      'Critical': 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const calculateBestBid = (bids: CarrierBid[]) => {
    if (bids.length === 0) return null;
    return bids.reduce((best, current) => {
      if (current.bidStatus === 'Rejected' || current.bidStatus === 'Expired') return best;
      if (!best) return current;
      // Balanced score: 40% cost, 30% rating, 30% on-time rate
      const currentScore = (1 - current.totalCost / 5000) * 0.4 + (current.carrierRating / 5) * 0.3 + (current.onTimeRate / 100) * 0.3;
      const bestScore = (1 - best.totalCost / 5000) * 0.4 + (best.carrierRating / 5) * 0.3 + (best.onTimeRate / 100) * 0.3;
      return currentScore > bestScore ? current : best;
    }, bids[0]);
  };

  const stats = {
    activeTenders: tenderLoads.filter(t => t.status === 'In Progress' || t.status === 'Pending').length,
    awarded: tenderLoads.filter(t => t.status === 'Awarded').length,
    pending: tenderLoads.filter(t => t.status === 'Pending').length,
    totalBids: tenderLoads.reduce((sum, t) => sum + t.carrierBids.length, 0),
    avgBidsPerTender: (tenderLoads.reduce((sum, t) => sum + t.carrierBids.length, 0) / tenderLoads.length).toFixed(1),
    autoAwardRate: ((tenderLoads.filter(t => t.autoAward && t.status === 'Awarded').length / tenderLoads.filter(t => t.status === 'Awarded').length) * 100).toFixed(0),
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automated Carrier Tendering</h1>
            <p className="text-gray-600 mt-1">Intelligent carrier selection, automated bidding, and award management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="w-5 h-5" />
              Configure Rules
            </Button>
            <Button variant="primary" className="gap-2">
              <Plus className="w-5 h-5" />
              Create Tender
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
                <p className="text-sm font-medium text-gray-600 mb-1">Active Tenders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeTenders}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Send className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Awarded</p>
                <p className="text-3xl font-bold text-green-600">{stats.awarded}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Response</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Total Bids</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalBids}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Bids/Tender</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.avgBidsPerTender}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Auto-Award Rate</p>
                <p className="text-3xl font-bold text-orange-600">{stats.autoAwardRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'tenders', label: 'Active Tenders', icon: <Send className="w-4 h-4" /> },
            { key: 'bids', label: 'Bid Comparison', icon: <DollarSign className="w-4 h-4" /> },
            { key: 'automation', label: 'Automation Rules', icon: <Zap className="w-4 h-4" /> },
            { key: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
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

      {/* Active Tenders Tab */}
      {activeTab === 'tenders' && (
        <>
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by tender number, customer, or location..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Awarded', label: 'Awarded' },
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

          {/* Tenders List */}
          <div className="space-y-4">
            {filteredTenders.map((tender) => {
              const bestBid = calculateBestBid(tender.carrierBids);
              const savings = tender.estimatedCost - (bestBid?.totalCost || 0);

              return (
                <Card key={tender.id} className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                              <Send className="w-8 h-8" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-blue-600 cursor-pointer hover:text-blue-800">
                                  {tender.tenderNumber}
                                </h3>
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(tender.status)}`}>
                                  {tender.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{tender.customer} • {tender.loadType}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs rounded ${getPriorityColor(tender.priority)}`}>
                                  {tender.priority}
                                </span>
                                {tender.autoAward && (
                                  <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Auto-Award
                                  </span>
                                )}
                                {tender.carrierBids.length > 0 && (
                                  <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                                    {tender.carrierBids.length} bid{tender.carrierBids.length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Origin</p>
                            <p className="text-sm font-medium text-gray-900">{tender.origin.city}, {tender.origin.state}</p>
                            <p className="text-xs text-gray-500">{tender.origin.postalCode}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Destination</p>
                            <p className="text-sm font-medium text-gray-900">{tender.destination.city}, {tender.destination.state}</p>
                            <p className="text-xs text-gray-500">{tender.destination.postalCode}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
                            <p className="text-sm font-medium text-gray-900">{tender.pickupDate}</p>
                            <p className="text-xs text-gray-500">{tender.distance.toLocaleString()} mi</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Load Details</p>
                            <p className="text-sm font-medium text-gray-900">{tender.weight.toLocaleString()} lbs</p>
                            <p className="text-xs text-gray-500">{tender.pallets} pallets • {tender.commodity}</p>
                          </div>
                        </div>

                        {tender.specialRequirements.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Special Requirements</p>
                            <div className="flex flex-wrap gap-1">
                              {tender.specialRequirements.map((req, idx) => (
                                <span key={idx} className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-800 border border-orange-200">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Best Bid Highlight */}
                        {bestBid && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-green-600" />
                                <p className="font-bold text-gray-900">Best Bid: {bestBid.carrierName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">${bestBid.totalCost.toLocaleString()}</p>
                                {savings > 0 && (
                                  <p className="text-xs text-green-700">Save ${savings.toFixed(0)} vs estimate</p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <div className="text-center">
                                <p className="text-xs text-gray-600">Base Rate</p>
                                <p className="text-sm font-medium text-gray-900">${bestBid.bidAmount}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-600">Transit</p>
                                <p className="text-sm font-medium text-gray-900">{bestBid.transitDays} days</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-600">OTD Rate</p>
                                <p className="text-sm font-medium text-gray-900">{bestBid.onTimeRate}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-600">Rating</p>
                                <p className="text-sm font-medium text-gray-900">{bestBid.carrierRating}/5.0</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {tender.carrierBids.length === 0 && tender.status === 'Pending' && (
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-yellow-600" />
                              <p className="text-sm font-medium text-yellow-900">
                                Awaiting carrier responses • Deadline: {tender.responseDeadline}
                              </p>
                            </div>
                          </div>
                        )}

                        {tender.selectedCarrier && (
                          <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-900">
                              <strong>Awarded to:</strong> {tender.selectedCarrier} at ${tender.awardedAmount?.toLocaleString()}
                              {tender.shipmentId && ` • Shipment: ${tender.shipmentId}`}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full gap-2"
                          disabled={tender.status === 'Awarded' || tender.status === 'Rejected'}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        {tender.carrierBids.length > 0 && tender.status === 'In Progress' && (
                          <Button variant="outline" size="sm" className="w-full gap-2 text-green-600 border-green-600 hover:bg-green-50">
                            <Check className="w-4 h-4" />
                            Award Tender
                          </Button>
                        )}
                        {tender.status === 'Pending' && (
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Send className="w-4 h-4" />
                            Send to Carriers
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Edit className="w-4 h-4" />
                          Edit Tender
                        </Button>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Re-tender
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Bid Comparison Tab */}
      {activeTab === 'bids' && (
        <div className="space-y-6">
          {filteredTenders.filter(t => t.carrierBids.length > 0).map((tender) => (
            <Card key={tender.id}>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {tender.tenderNumber} - Bid Comparison
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {tender.origin.city}, {tender.origin.state} → {tender.destination.city}, {tender.destination.state}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(tender.status)}`}>
                    {tender.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel + Fees</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OTD Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tender.carrierBids.map((bid, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{bid.carrierName}</p>
                              <p className="text-xs text-gray-500">{bid.serviceLevel}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">${bid.bidAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">${(bid.fuelSurcharge + bid.accessorialCharges).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <p className="text-lg font-bold text-green-600">${bid.totalCost.toLocaleString()}</p>
                            {bid.totalCost < tender.targetCost && (
                              <p className="text-xs text-green-700">Under target</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{bid.transitDays} days</td>
                          <td className="px-4 py-3">
                            <span className={`font-medium ${
                              bid.onTimeRate >= 95 ? 'text-green-600' :
                              bid.onTimeRate >= 90 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {bid.onTimeRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{bid.carrierRating}/5.0</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getBidStatusColor(bid.bidStatus)}`}>
                              {bid.bidStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {bid.bidStatus === 'Pending' && (
                                <>
                                  <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                                    <Check className="w-3 h-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                    <X className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Automation Rules Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Intelligent Auto-Award System</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Configure automated carrier selection rules based on cost, quality, transit time, and capacity.
                    The system evaluates bids against your criteria and automatically awards loads to the best carrier.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Rule
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Rule Templates
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Carrier Pools</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {carrierPools.map((pool) => (
                  <div key={pool.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          pool.autoTender ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{pool.name}</h4>
                          <p className="text-sm text-gray-600">{pool.carrierIds.length} carriers • Priority {pool.priority}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pool.autoTender && (
                          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Auto-Tender Enabled
                          </span>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {pool.laneTypes.map((type, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                          {type}
                        </span>
                      ))}
                      {pool.serviceTypes.map((type, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Selection Rules</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {tenderLoads[0].rules.map((rule) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          rule.enabled ? 'bg-blue-600' : 'bg-gray-400'
                        }`}>
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">{rule.name}</h5>
                          <p className="text-xs text-gray-600">Priority {rule.priority} • Weight {rule.weight}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={rule.enabled ? 'text-green-600 border-green-600' : 'text-gray-600'}
                        >
                          {rule.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium capitalize">{rule.criteria.replace('_', ' ')}</span>
                      {' '}{rule.operator === 'min' ? 'minimize' : rule.operator === 'max' ? 'maximize' : `threshold ${rule.value}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Avg Cost Savings</p>
                    <p className="text-3xl font-bold text-green-900">12.5%</p>
                  </div>
                </div>
                <p className="text-xs text-green-700">vs estimated costs</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Timer className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Avg Response Time</p>
                    <p className="text-3xl font-bold text-blue-900">2.3 hrs</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700">from tender to first bid</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Award Success Rate</p>
                    <p className="text-3xl font-bold text-purple-900">94.7%</p>
                  </div>
                </div>
                <p className="text-xs text-purple-700">tenders successfully awarded</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Tendering Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Auto-Award Success Rate</span>
                    <span className="text-sm font-bold text-green-600">87.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Carrier Response Rate</span>
                    <span className="text-sm font-bold text-blue-600">92.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '92.3%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cost Target Achievement</span>
                    <span className="text-sm font-bold text-purple-600">78.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '78.9%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Avg Bids per Tender</span>
                    <span className="text-sm font-bold text-orange-600">2.5 carriers</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '62.5%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tendering;
