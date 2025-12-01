import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plane,
  Ship,
  Truck as TruckIcon,
  Train,
  Globe,
  AlertCircle,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface Carrier {
  id: string;
  name: string;
  logo: { text: string; bg: string; color: string };
  type: 'Air' | 'Ocean' | 'Ground' | 'Rail';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  activeShipments: number;
  completedShipments: number;
  onTimeDelivery: number;
  status: 'active' | 'inactive';
  serviceAreas: string[];
  avgTransitTime: string;
  joinedDate: string;
  totalRevenue: string;
  description: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  destination: string;
  origin: string;
  status: string;
  eta: string;
  value: string;
}

const CarrierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock carrier data - in production, this would come from API
  const carriers: Record<string, Carrier> = {
    '1': {
      id: '1',
      name: 'FedEx Express',
      logo: { text: 'FDX', bg: 'bg-purple-600', color: 'text-white' },
      type: 'Air',
      contactPerson: 'John Smith',
      email: 'john.smith@fedex.com',
      phone: '+1 (800) 463-3339',
      address: '3680 Hacks Cross Rd, Memphis, TN 38125',
      rating: 4.8,
      activeShipments: 45,
      completedShipments: 1250,
      onTimeDelivery: 96.5,
      status: 'active',
      serviceAreas: ['North America', 'Europe', 'Asia', 'South America', 'Middle East'],
      avgTransitTime: '1-2 days',
      joinedDate: '2020-03-15',
      totalRevenue: '$2,450,000',
      description: 'FedEx Express is a leading international express delivery service, providing fast and reliable shipping solutions worldwide. Known for exceptional service quality and on-time delivery performance.',
    },
    '2': {
      id: '2',
      name: 'UPS',
      logo: { text: 'UPS', bg: 'bg-yellow-600', color: 'text-white' },
      type: 'Ground',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.j@ups.com',
      phone: '+1 (800) 742-5877',
      address: '55 Glenlake Pkwy NE, Atlanta, GA 30328',
      rating: 4.6,
      activeShipments: 38,
      completedShipments: 980,
      onTimeDelivery: 94.2,
      status: 'active',
      serviceAreas: ['North America', 'International', 'Europe', 'Asia-Pacific'],
      avgTransitTime: '3-5 days',
      joinedDate: '2019-07-20',
      totalRevenue: '$1,850,000',
      description: 'UPS provides comprehensive ground shipping services with extensive coverage across North America and international destinations. Reliable, cost-effective solutions for businesses of all sizes.',
    },
    '3': {
      id: '3',
      name: 'Maersk',
      logo: { text: 'MSK', bg: 'bg-blue-700', color: 'text-white' },
      type: 'Ocean',
      contactPerson: 'Michael Brown',
      email: 'm.brown@maersk.com',
      phone: '+1 (973) 514-6000',
      address: 'Esplanaden 50, Copenhagen, Denmark',
      rating: 4.7,
      activeShipments: 12,
      completedShipments: 450,
      onTimeDelivery: 92.8,
      status: 'active',
      serviceAreas: ['Global', 'Asia-Pacific', 'Americas', 'Europe', 'Africa'],
      avgTransitTime: '15-30 days',
      joinedDate: '2018-11-05',
      totalRevenue: '$3,200,000',
      description: 'Maersk is the world\'s largest container shipping company, offering global ocean freight services with unmatched reliability and comprehensive port coverage.',
    },
  };

  const carrier = id ? carriers[id] : null;

  const [recentShipments] = useState<Shipment[]>([
    { id: '1', trackingNumber: 'FDX-2024-8901', destination: 'New York, NY', origin: 'Los Angeles, CA', status: 'In Transit', eta: '2 hours', value: '$12,450' },
    { id: '2', trackingNumber: 'FDX-2024-8902', destination: 'Chicago, IL', origin: 'Miami, FL', status: 'Out for Delivery', eta: '30 mins', value: '$8,220' },
    { id: '3', trackingNumber: 'FDX-2024-8903', destination: 'Houston, TX', origin: 'Seattle, WA', status: 'Processing', eta: '1 day', value: '$15,890' },
    { id: '4', trackingNumber: 'FDX-2024-8904', destination: 'Phoenix, AZ', origin: 'Boston, MA', status: 'Delivered', eta: 'Completed', value: '$6,780' },
    { id: '5', trackingNumber: 'FDX-2024-8905', destination: 'Dallas, TX', origin: 'Portland, OR', status: 'In Transit', eta: '4 hours', value: '$9,340' },
  ]);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      Air: <Plane className="w-5 h-5" />,
      Ocean: <Ship className="w-5 h-5" />,
      Ground: <TruckIcon className="w-5 h-5" />,
      Rail: <Train className="w-5 h-5" />,
    };
    return icons[type] || <Package className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Air: 'bg-blue-100 text-blue-800 border-blue-200',
      Ocean: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      Ground: 'bg-green-100 text-green-800 border-green-200',
      Rail: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Transit': 'bg-blue-100 text-blue-800 border-blue-200',
      'Out for Delivery': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Processing': 'bg-gray-100 text-gray-800 border-gray-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!carrier) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Carrier Not Found</p>
              <p className="text-sm text-gray-500 mb-6">The carrier you're looking for doesn't exist.</p>
              <Button variant="primary" onClick={() => navigate('/carriers')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Carriers
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/carriers')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Carriers
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 ${carrier.logo.bg} rounded-2xl flex items-center justify-center ${carrier.logo.color} font-bold text-2xl shadow-lg`}>
              {carrier.logo.text}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{carrier.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${getTypeColor(carrier.type)}`}>
                  {getTypeIcon(carrier.type)}
                  {carrier.type} Carrier
                </div>
                <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                  carrier.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {carrier.status}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{carrier.rating}</span>
                  <span className="text-sm text-gray-500">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => alert(`Edit ${carrier.name}`)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => alert(`Delete ${carrier.name}`)}
              className="gap-2 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed">{carrier.description}</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Shipments</p>
                <p className="text-3xl font-bold text-blue-600">{carrier.activeShipments}</p>
                <p className="text-xs text-gray-600 mt-1">currently in transit</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">On-Time Delivery</p>
                <p className="text-3xl font-bold text-green-600">{carrier.onTimeDelivery}%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +1.2% this month
                </p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Transit Time</p>
                <p className="text-3xl font-bold text-purple-600">{carrier.avgTransitTime}</p>
                <p className="text-xs text-gray-600 mt-1">typical delivery time</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-yellow-600">{carrier.totalRevenue}</p>
                <p className="text-xs text-gray-600 mt-1">lifetime value</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Contact Information */}
        <Card className="lg:col-span-1">
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Contact Person</p>
                <p className="text-sm font-medium text-gray-900">{carrier.contactPerson}</p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${carrier.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                    {carrier.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${carrier.phone}`} className="text-sm text-blue-600 hover:text-blue-700">
                    {carrier.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm text-gray-700">{carrier.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Partner Since</p>
                  <p className="text-sm text-gray-700">
                    {new Date(carrier.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Service Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {carrier.serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-900"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Completed Shipments</p>
                  <p className="text-2xl font-bold text-gray-900">{carrier.completedShipments.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">{carrier.onTimeDelivery}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Shipments</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/shipments')}
              className="gap-2"
            >
              View All Shipments
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
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {shipment.origin} → {shipment.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {shipment.value}
                      </span>
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
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs text-gray-500">ETA</p>
                    <p className="text-sm font-medium text-gray-900">{shipment.eta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CarrierDetail;
