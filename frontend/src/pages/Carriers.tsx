import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Search,
  Star,
  TrendingUp,
  Package,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  Plane,
  Ship,
  Truck as TruckIcon,
  Train,
  Filter,
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
}

const Carriers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [carriers] = useState<Carrier[]>([
    {
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
      serviceAreas: ['North America', 'Europe', 'Asia'],
      avgTransitTime: '1-2 days',
    },
    {
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
      serviceAreas: ['North America', 'International'],
      avgTransitTime: '3-5 days',
    },
    {
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
      serviceAreas: ['Global', 'Asia-Pacific', 'Americas'],
      avgTransitTime: '15-30 days',
    },
    {
      id: '4',
      name: 'DHL Express',
      logo: { text: 'DHL', bg: 'bg-red-600', color: 'text-yellow-400' },
      type: 'Air',
      contactPerson: 'Emma Wilson',
      email: 'e.wilson@dhl.com',
      phone: '+1 (800) 225-5345',
      address: 'Headquarters, Bonn, Germany',
      rating: 4.5,
      activeShipments: 31,
      completedShipments: 850,
      onTimeDelivery: 93.7,
      status: 'active',
      serviceAreas: ['Global', 'Express International'],
      avgTransitTime: '1-3 days',
    },
    {
      id: '5',
      name: 'USPS',
      logo: { text: 'USPS', bg: 'bg-blue-900', color: 'text-white' },
      type: 'Ground',
      contactPerson: 'Robert Davis',
      email: 'r.davis@usps.gov',
      phone: '+1 (800) 275-8777',
      address: '475 L Enfant Plaza SW, Washington, DC 20260',
      rating: 4.2,
      activeShipments: 22,
      completedShipments: 650,
      onTimeDelivery: 89.5,
      status: 'active',
      serviceAreas: ['United States', 'Territories'],
      avgTransitTime: '2-8 days',
    },
    {
      id: '6',
      name: 'MSC',
      logo: { text: 'MSC', bg: 'bg-blue-800', color: 'text-white' },
      type: 'Ocean',
      contactPerson: 'Lisa Martinez',
      email: 'l.martinez@msc.com',
      phone: '+1 (201) 558-4200',
      address: 'Chemin Rieu 12-14, Geneva, Switzerland',
      rating: 4.6,
      activeShipments: 18,
      completedShipments: 520,
      onTimeDelivery: 91.3,
      status: 'active',
      serviceAreas: ['Global', 'Mediterranean', 'Asia'],
      avgTransitTime: '20-35 days',
    },
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

  const filteredCarriers = carriers.filter((carrier) => {
    const matchesType = filterType === 'all' || carrier.type === filterType;
    const matchesSearch =
      carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalActiveShipments = carriers.reduce((sum, c) => sum + c.activeShipments, 0);
  const averageRating = (carriers.reduce((sum, c) => sum + c.rating, 0) / carriers.length).toFixed(1);
  const averageOnTime = (carriers.reduce((sum, c) => sum + c.onTimeDelivery, 0) / carriers.length).toFixed(1);
  const activeCarriers = carriers.filter(c => c.status === 'active').length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carriers</h1>
            <p className="text-gray-600 mt-1">Manage your carrier network and partnerships</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Carrier
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Carriers</p>
                <p className="text-3xl font-bold text-gray-900">{carriers.length}</p>
                <p className="text-xs text-green-600 mt-1">{activeCarriers} active</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <TruckIcon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Shipments</p>
                <p className="text-3xl font-bold text-blue-600">{totalActiveShipments}</p>
                <p className="text-xs text-gray-600 mt-1">across all carriers</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-yellow-600">{averageRating}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg On-Time</p>
                <p className="text-3xl font-bold text-green-600">{averageOnTime}%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2.3% this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by carrier name or contact person..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { value: 'all', label: 'All', icon: <Filter className="w-4 h-4" /> },
                { value: 'Air', label: 'Air', icon: <Plane className="w-4 h-4" /> },
                { value: 'Ocean', label: 'Ocean', icon: <Ship className="w-4 h-4" /> },
                { value: 'Ground', label: 'Ground', icon: <TruckIcon className="w-4 h-4" /> },
                { value: 'Rail', label: 'Rail', icon: <Train className="w-4 h-4" /> },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filterType === type.value
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carriers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCarriers.map((carrier) => (
          <Card key={carrier.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              {/* Header with Logo */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 ${carrier.logo.bg} rounded-xl flex items-center justify-center ${carrier.logo.color} font-bold text-lg shadow-lg`}>
                    {carrier.logo.text}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {carrier.name}
                    </h3>
                    <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border mt-1 ${getTypeColor(carrier.type)}`}>
                      {getTypeIcon(carrier.type)}
                      {carrier.type}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                    carrier.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {carrier.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 truncate">{carrier.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{carrier.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-xs line-clamp-2">{carrier.address}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-200 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{carrier.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-sm font-bold text-blue-600 mb-1">{carrier.activeShipments}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-green-600 mb-1">{carrier.onTimeDelivery}%</p>
                  <p className="text-xs text-gray-500">On-Time</p>
                </div>
              </div>

              {/* Service Areas */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Service Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {carrier.serviceAreas.slice(0, 2).map((area, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {area}
                    </span>
                  ))}
                  {carrier.serviceAreas.length > 2 && (
                    <span className="text-xs text-gray-500">+{carrier.serviceAreas.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => navigate(`/carriers/${carrier.id}`)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Edit ${carrier.name}`);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCarriers.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No carriers found</p>
              <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters</p>
              <Button variant="primary" onClick={() => { setSearchTerm(''); setFilterType('all'); }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Carriers;
