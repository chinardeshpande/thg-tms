import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  BarChart3,
  Users,
  ArrowRight,
  MapPin,
  AlertCircle,
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface RecentShipment {
  id: string;
  trackingNumber: string;
  destination: string;
  status: string;
  eta: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [metrics] = useState<MetricCard[]>([
    {
      title: 'Active Shipments',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'In Transit',
      value: '856',
      change: '+8.2%',
      trend: 'up',
      icon: <Truck className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Delivered Today',
      value: '423',
      change: '+15.3%',
      trend: 'up',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Pending Pickup',
      value: '89',
      change: '-3.1%',
      trend: 'down',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
    },
  ]);

  const [recentShipments] = useState<RecentShipment[]>([
    { id: '1', trackingNumber: 'TRK-2024-001', destination: 'New York, NY', status: 'In Transit', eta: '2 hours' },
    { id: '2', trackingNumber: 'TRK-2024-002', destination: 'Los Angeles, CA', status: 'Out for Delivery', eta: '30 mins' },
    { id: '3', trackingNumber: 'TRK-2024-003', destination: 'Chicago, IL', status: 'Processing', eta: '1 day' },
    { id: '4', trackingNumber: 'TRK-2024-004', destination: 'Houston, TX', status: 'In Transit', eta: '4 hours' },
    { id: '5', trackingNumber: 'TRK-2024-005', destination: 'Phoenix, AZ', status: 'Delivered', eta: 'Completed' },
  ]);

  const [alerts] = useState([
    { id: '1', type: 'warning', message: '3 shipments delayed due to weather', time: '10 mins ago' },
    { id: '2', type: 'info', message: 'New carrier rate update available', time: '1 hour ago' },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Transit': 'bg-blue-100 text-blue-800 border-blue-200',
      'Out for Delivery': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Processing': 'bg-gray-100 text-gray-800 border-gray-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const quickActions = [
    { label: 'Create Shipment', icon: <Plus className="w-5 h-5" />, action: () => navigate('/shipments'), variant: 'primary' as const },
    { label: 'Track Shipment', icon: <Search className="w-5 h-5" />, action: () => navigate('/tracking'), variant: 'outline' as const },
    { label: 'View Analytics', icon: <BarChart3 className="w-5 h-5" />, action: () => navigate('/analytics'), variant: 'outline' as const },
    { label: 'Manage Carriers', icon: <Users className="w-5 h-5" />, action: () => navigate('/carriers'), variant: 'outline' as const },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your shipments.</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                }`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow duration-300 cursor-pointer" hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-lg`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Shipments</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/shipments')}
                className="group"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {recentShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/tracking?id=${shipment.trackingNumber}`)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{shipment.trackingNumber}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {shipment.destination}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>
                    <div className="text-right min-w-[80px]">
                      <p className="text-xs text-gray-500">ETA</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.eta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  className="w-full justify-start gap-3"
                  onClick={action.action}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-6">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Shipment Performance</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')}>
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-900 font-semibold text-lg mb-2">Performance Chart</p>
                <p className="text-sm text-gray-600 mb-4">Interactive visualization coming soon</p>
                <Button variant="primary" size="sm" onClick={() => navigate('/analytics')}>
                  Go to Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
