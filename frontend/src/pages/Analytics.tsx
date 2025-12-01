import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Users,
  Globe,
  Zap,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Award,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Route,
  Percent,
} from 'lucide-react';

interface KPI {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: JSX.Element;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

interface CarrierPerformance {
  id: string;
  name: string;
  totalShipments: number;
  onTimeDelivery: number;
  avgCost: number;
  avgTransitDays: number;
  rating: number;
  trend: 'improving' | 'declining' | 'stable';
  monthlySpend: number;
  utilizationRate: number;
}

interface LanePerformance {
  id: string;
  laneName: string;
  origin: string;
  destination: string;
  mode: string;
  shipments: number;
  avgCost: number;
  onTimeRate: number;
  optimizationScore: number;
}

interface CostTrend {
  month: string;
  freight: number;
  fuel: number;
  accessorial: number;
  total: number;
}

interface ExceptionData {
  type: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down';
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30days');
  const [activeTab, setActiveTab] = useState<'overview' | 'carriers' | 'lanes' | 'costs'>('overview');

  // KPI Data
  const kpis: KPI[] = [
    {
      title: 'Total Shipments',
      value: '2,847',
      change: 12.5,
      changeLabel: 'vs last month',
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      trend: 'up',
    },
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      change: 2.1,
      changeLabel: 'vs last month',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      trend: 'up',
    },
    {
      title: 'Total Freight Cost',
      value: '$1.2M',
      change: -5.3,
      changeLabel: 'vs last month',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      trend: 'down',
    },
    {
      title: 'Avg Transit Time',
      value: '3.2 days',
      change: -8.5,
      changeLabel: 'vs last month',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      trend: 'down',
    },
    {
      title: 'Active Carriers',
      value: '24',
      change: 0,
      changeLabel: 'vs last month',
      icon: <Truck className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600',
      trend: 'neutral',
    },
    {
      title: 'Cost Per Mile',
      value: '$2.45',
      change: -3.2,
      changeLabel: 'vs last month',
      icon: <Target className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600',
      trend: 'down',
    },
  ];

  // Carrier Performance Data
  const carrierPerformance: CarrierPerformance[] = [
    {
      id: '1',
      name: 'FedEx Freight',
      totalShipments: 487,
      onTimeDelivery: 96.5,
      avgCost: 850,
      avgTransitDays: 2.1,
      rating: 4.8,
      trend: 'improving',
      monthlySpend: 413950,
      utilizationRate: 89,
    },
    {
      id: '2',
      name: 'UPS Ground',
      totalShipments: 623,
      onTimeDelivery: 94.2,
      avgCost: 620,
      avgTransitDays: 2.8,
      rating: 4.6,
      trend: 'stable',
      monthlySpend: 386260,
      utilizationRate: 92,
    },
    {
      id: '3',
      name: 'XPO Logistics',
      totalShipments: 356,
      onTimeDelivery: 92.1,
      avgCost: 780,
      avgTransitDays: 3.2,
      rating: 4.3,
      trend: 'declining',
      monthlySpend: 277680,
      utilizationRate: 78,
    },
    {
      id: '4',
      name: 'DHL Express',
      totalShipments: 289,
      onTimeDelivery: 97.8,
      avgCost: 1250,
      avgTransitDays: 1.5,
      rating: 4.9,
      trend: 'improving',
      monthlySpend: 361250,
      utilizationRate: 85,
    },
    {
      id: '5',
      name: 'Old Dominion',
      totalShipments: 445,
      onTimeDelivery: 93.8,
      avgCost: 690,
      avgTransitDays: 2.9,
      rating: 4.5,
      trend: 'stable',
      monthlySpend: 307050,
      utilizationRate: 88,
    },
  ];

  // Lane Performance Data
  const lanePerformance: LanePerformance[] = [
    {
      id: '1',
      laneName: 'LA to Seattle Express',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      mode: 'Road',
      shipments: 145,
      avgCost: 850,
      onTimeRate: 98.5,
      optimizationScore: 92,
    },
    {
      id: '2',
      laneName: 'LA to London Air',
      origin: 'Los Angeles, CA',
      destination: 'London, UK',
      mode: 'Air',
      shipments: 89,
      avgCost: 4500,
      onTimeRate: 95.2,
      optimizationScore: 88,
    },
    {
      id: '3',
      laneName: 'LA to Shanghai Ocean',
      origin: 'Los Angeles, CA',
      destination: 'Shanghai, China',
      mode: 'Ocean',
      shipments: 56,
      avgCost: 3200,
      onTimeRate: 91.8,
      optimizationScore: 85,
    },
    {
      id: '4',
      laneName: 'London to Paris Road',
      origin: 'London, UK',
      destination: 'Paris, France',
      mode: 'Road',
      shipments: 234,
      avgCost: 185,
      onTimeRate: 96.7,
      optimizationScore: 94,
    },
    {
      id: '5',
      laneName: 'Chicago to Toronto Rail',
      origin: 'Chicago, IL',
      destination: 'Toronto, ON',
      mode: 'Rail',
      shipments: 67,
      avgCost: 680,
      onTimeRate: 89.3,
      optimizationScore: 78,
    },
  ];

  // Cost Trend Data
  const costTrends: CostTrend[] = [
    { month: 'Jun', freight: 380000, fuel: 45000, accessorial: 15000, total: 440000 },
    { month: 'Jul', freight: 420000, fuel: 52000, accessorial: 18000, total: 490000 },
    { month: 'Aug', freight: 450000, fuel: 58000, accessorial: 22000, total: 530000 },
    { month: 'Sep', freight: 410000, fuel: 51000, accessorial: 19000, total: 480000 },
    { month: 'Oct', freight: 390000, fuel: 47000, accessorial: 16000, total: 453000 },
    { month: 'Nov', freight: 370000, fuel: 43000, accessorial: 14000, total: 427000 },
  ];

  // Exception Data
  const exceptions: ExceptionData[] = [
    { type: 'Late Delivery', count: 87, percentage: 3.1, trend: 'down' },
    { type: 'Damaged Cargo', count: 23, percentage: 0.8, trend: 'down' },
    { type: 'Documentation Issues', count: 45, percentage: 1.6, trend: 'up' },
    { type: 'Route Deviations', count: 34, percentage: 1.2, trend: 'down' },
    { type: 'Customer Complaints', count: 12, percentage: 0.4, trend: 'down' },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral', inverse = false) => {
    if (trend === 'neutral') return 'text-gray-600';
    const isPositive = inverse ? trend === 'down' : trend === 'up';
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getCarrierTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            ★
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Business Intelligence</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into carrier performance, costs, and operational efficiency</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
              <option value="custom">Custom Range</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-lg`}>
                  {kpi.icon}
                </div>
              </div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(kpi.trend, ['Total Freight Cost', 'Avg Transit Time', 'Cost Per Mile'].includes(kpi.title))}`}>
                {getTrendIcon(kpi.trend)}
                <span className="font-medium">{Math.abs(kpi.change)}%</span>
                <span className="text-gray-500 text-xs">{kpi.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'carriers', label: 'Carrier Performance', icon: <Truck className="w-4 h-4" /> },
            { key: 'lanes', label: 'Lane Analytics', icon: <Route className="w-4 h-4" /> },
            { key: 'costs', label: 'Cost Analysis', icon: <DollarSign className="w-4 h-4" /> },
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Shipment Volume Trend */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Shipment Volume Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 flex items-end justify-between gap-2">
                {costTrends.map((trend, index) => {
                  const maxTotal = Math.max(...costTrends.map(t => t.total));
                  const height = (trend.total / maxTotal) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden relative" style={{ height: `${height}%`, minHeight: '40px' }}>
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '100%' }}></div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">{(trend.total / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">{trend.month}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Exception Analysis */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Exception Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {exceptions.map((exception, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{exception.type}</span>
                        <div className={`flex items-center gap-1 ${exception.trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
                          {exception.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{exception.count}</p>
                        <p className="text-xs text-gray-600">{exception.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        style={{ width: `${exception.percentage * 20}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700 font-medium">Perfect Deliveries</p>
                    <p className="text-2xl font-bold text-green-900">2,684</p>
                  </div>
                </div>
                <p className="text-xs text-green-700">94.2% of total shipments</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-red-700 font-medium">Total Exceptions</p>
                    <p className="text-2xl font-bold text-red-900">201</p>
                  </div>
                </div>
                <p className="text-xs text-red-700">7.1% of total shipments</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">International</p>
                    <p className="text-2xl font-bold text-blue-900">423</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700">14.9% of total volume</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Express Service</p>
                    <p className="text-2xl font-bold text-purple-900">856</p>
                  </div>
                </div>
                <p className="text-xs text-purple-700">30.1% of total volume</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Carrier Performance Tab */}
      {activeTab === 'carriers' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Carrier Scorecard
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipments</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">On-Time %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transit Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Spend</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {carrierPerformance.map((carrier) => (
                      <tr key={carrier.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/carriers/${carrier.id}`)}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{carrier.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{carrier.totalShipments}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              carrier.onTimeDelivery >= 95 ? 'text-green-600' :
                              carrier.onTimeDelivery >= 90 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {carrier.onTimeDelivery}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">${carrier.avgCost.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{carrier.avgTransitDays} days</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getRatingStars(carrier.rating)}
                            <span className="text-sm text-gray-600">{carrier.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">${(carrier.monthlySpend / 1000).toFixed(0)}K</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  carrier.utilizationRate >= 85 ? 'bg-green-500' :
                                  carrier.utilizationRate >= 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${carrier.utilizationRate}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{carrier.utilizationRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {getCarrierTrendIcon(carrier.trend)}
                            <span className={`text-xs capitalize ${
                              carrier.trend === 'improving' ? 'text-green-600' :
                              carrier.trend === 'declining' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {carrier.trend}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-700 font-medium mb-1">Highest OTD</p>
                    <p className="text-xl font-bold text-yellow-900">DHL Express</p>
                    <p className="text-sm text-yellow-700 mt-1">97.8% on-time delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">Best Rating</p>
                    <p className="text-xl font-bold text-green-900">DHL Express</p>
                    <p className="text-sm text-green-700 mt-1">4.9 / 5.0 customer rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium mb-1">Best Utilization</p>
                    <p className="text-xl font-bold text-blue-900">UPS Ground</p>
                    <p className="text-sm text-blue-700 mt-1">92% capacity utilization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Lane Analytics Tab */}
      {activeTab === 'lanes' && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Top Performing Lanes
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/routes')}>
                View All Lanes
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {lanePerformance.map((lane) => (
                <div key={lane.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{lane.laneName}</h4>
                      <p className="text-sm text-gray-600">{lane.origin} → {lane.destination}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800">
                        {lane.mode}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Shipments</p>
                      <p className="text-xl font-bold text-gray-900">{lane.shipments}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Avg Cost</p>
                      <p className="text-lg font-bold text-blue-900">${lane.avgCost.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">OTD Rate</p>
                      <p className="text-lg font-bold text-green-900">{lane.onTimeRate}%</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600 mb-1">Optimization</p>
                      <p className={`text-lg font-bold ${
                        lane.optimizationScore >= 90 ? 'text-green-900' :
                        lane.optimizationScore >= 75 ? 'text-yellow-900' :
                        'text-red-900'
                      }`}>
                        {lane.optimizationScore}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Analysis Tab */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 flex items-end justify-between gap-2 mb-6">
                {costTrends.map((trend, index) => {
                  const maxTotal = Math.max(...costTrends.map(t => t.total));
                  const freightHeight = (trend.freight / maxTotal) * 100;
                  const fuelHeight = (trend.fuel / maxTotal) * 100;
                  const accessorialHeight = (trend.accessorial / maxTotal) * 100;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg overflow-hidden relative flex flex-col-reverse" style={{ height: '100%' }}>
                        <div className="bg-blue-500" style={{ height: `${freightHeight}%` }} title={`Freight: $${(trend.freight/1000).toFixed(0)}K`}></div>
                        <div className="bg-orange-500" style={{ height: `${fuelHeight}%` }} title={`Fuel: $${(trend.fuel/1000).toFixed(0)}K`}></div>
                        <div className="bg-purple-500" style={{ height: `${accessorialHeight}%` }} title={`Accessorial: $${(trend.accessorial/1000).toFixed(0)}K`}></div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">${(trend.total / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">{trend.month}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs text-gray-600">Freight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-xs text-gray-600">Fuel Surcharge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-xs text-gray-600">Accessorial</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Freight Cost</p>
                    <p className="text-2xl font-bold text-gray-900">$370K</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="font-medium">5.3%</span>
                  <span className="text-gray-500 text-xs">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Surcharges</p>
                    <p className="text-2xl font-bold text-gray-900">$43K</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="font-medium">8.5%</span>
                  <span className="text-gray-500 text-xs">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Accessorial Charges</p>
                    <p className="text-2xl font-bold text-gray-900">$14K</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="font-medium">12.5%</span>
                  <span className="text-gray-500 text-xs">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Opportunities */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Identified Savings Opportunities</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Based on AI analysis of carrier performance, lane optimization, and rate negotiation opportunities.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">Lane Optimization</p>
                      <p className="text-xl font-bold text-green-600">$12,450/mo</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">Carrier Consolidation</p>
                      <p className="text-xl font-bold text-green-600">$8,200/mo</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">Rate Negotiation</p>
                      <p className="text-xl font-bold text-green-600">$15,800/mo</p>
                    </div>
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

export default Analytics;
