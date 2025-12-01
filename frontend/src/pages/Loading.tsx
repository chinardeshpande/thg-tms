import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Package2,
  Plus,
  Search,
  Filter,
  Truck,
  Scale,
  Box,
  CheckCircle2,
  AlertCircle,
  Eye,
  Printer,
  Download,
  Camera,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { LoadPlanModal, LoadPlanData } from '../components/loading/LoadPlanModal';

interface LoadPlan {
  id: string;
  loadNumber: string;
  vehicleId: string;
  vehicleType: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'Verified' | 'Departed';
  loadType: 'Full' | 'Partial' | 'LTL';
  orders: string[];
  totalWeight: number;
  totalVolume: number;
  maxWeight: number;
  maxVolume: number;
  numberOfPallets: number;
  numberOfBoxes: number;
  loadSequence?: string;
  specialInstructions?: string;
  fragile: boolean;
  stackable: boolean;
  temperatureControlled: boolean;
  hazmat: boolean;
  loadedBy: string;
  loadStartTime?: string;
  loadCompleteTime?: string;
  verifiedBy?: string;
  photosTaken: number;
  notes?: string;
  createdAt: string;
}

const Loading: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [loadPlans, setLoadPlans] = useState<LoadPlan[]>([
    {
      id: '1',
      loadNumber: 'LOAD-2024-001',
      vehicleId: 'TRUCK-001',
      vehicleType: '53ft Dry Van',
      status: 'In Progress',
      loadType: 'Full',
      orders: ['SO-2024-001', 'SO-2024-002', 'SO-2024-003'],
      totalWeight: 38500,
      totalVolume: 3200,
      maxWeight: 45000,
      maxVolume: 3800,
      numberOfPallets: 22,
      numberOfBoxes: 0,
      loadSequence: 'Heavy pallets in front, lighter items in rear',
      fragile: false,
      stackable: true,
      temperatureControlled: false,
      hazmat: false,
      loadedBy: 'John Martinez',
      loadStartTime: '08:00',
      photosTaken: 3,
      createdAt: '2025-11-30 07:45',
    },
    {
      id: '2',
      loadNumber: 'LOAD-2024-002',
      vehicleId: 'TRUCK-002',
      vehicleType: '48ft Refrigerated',
      status: 'Completed',
      loadType: 'Full',
      orders: ['SO-2024-004', 'SO-2024-005'],
      totalWeight: 42000,
      totalVolume: 3400,
      maxWeight: 45000,
      maxVolume: 3600,
      numberOfPallets: 20,
      numberOfBoxes: 150,
      fragile: true,
      stackable: false,
      temperatureControlled: true,
      hazmat: false,
      loadedBy: 'Sarah Chen',
      loadStartTime: '06:00',
      loadCompleteTime: '08:30',
      photosTaken: 8,
      notes: 'Temperature set to 35°F, all items verified',
      createdAt: '2025-11-30 05:45',
    },
    {
      id: '3',
      loadNumber: 'LOAD-2024-003',
      vehicleId: 'TRUCK-004',
      vehicleType: '26ft Box Truck',
      status: 'Planning',
      loadType: 'LTL',
      orders: ['SO-2024-006'],
      totalWeight: 5200,
      totalVolume: 800,
      maxWeight: 12000,
      maxVolume: 1800,
      numberOfPallets: 4,
      numberOfBoxes: 45,
      fragile: false,
      stackable: true,
      temperatureControlled: false,
      hazmat: false,
      loadedBy: 'Mike Wilson',
      photosTaken: 0,
      createdAt: '2025-11-30 09:00',
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Planning': 'bg-gray-100 text-gray-800 border-gray-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Completed': 'bg-blue-100 text-blue-800 border-blue-200',
      'Verified': 'bg-green-100 text-green-800 border-green-200',
      'Departed': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLoadTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Full': 'bg-green-50 text-green-700 border-green-200',
      'Partial': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'LTL': 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredPlans = loadPlans.filter((plan) => {
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesType = filterType === 'all' || plan.loadType === filterType;
    const matchesSearch =
      plan.loadNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.orders.some(o => o.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: loadPlans.length,
    planning: loadPlans.filter(p => p.status === 'Planning').length,
    inProgress: loadPlans.filter(p => p.status === 'In Progress').length,
    completed: loadPlans.filter(p => p.status === 'Completed').length,
    verified: loadPlans.filter(p => p.status === 'Verified').length,
    avgUtilization: Math.round(
      loadPlans.reduce((acc, plan) => acc + (plan.totalWeight / plan.maxWeight) * 100, 0) / loadPlans.length
    ),
  };

  const handleCreateLoadPlan = (data: LoadPlanData) => {
    const newPlan: LoadPlan = {
      id: String(loadPlans.length + 1),
      loadNumber: `LOAD-2024-${String(loadPlans.length + 1).padStart(3, '0')}`,
      vehicleId: data.vehicleId,
      vehicleType: data.vehicleId.includes('001') ? '53ft Dry Van' : data.vehicleId.includes('002') ? '48ft Refrigerated' : '26ft Box Truck',
      status: 'Planning',
      loadType: data.loadType,
      orders: data.orders,
      totalWeight: data.totalWeight,
      totalVolume: data.totalVolume,
      maxWeight: 45000,
      maxVolume: 3800,
      numberOfPallets: data.numberOfPallets,
      numberOfBoxes: data.numberOfBoxes,
      loadSequence: data.loadSequence,
      specialInstructions: data.specialInstructions,
      fragile: data.fragile,
      stackable: data.stackable,
      temperatureControlled: data.temperatureControlled,
      hazmat: data.hazmat,
      loadedBy: data.loadedBy,
      photosTaken: 0,
      notes: data.notes,
      createdAt: new Date().toLocaleString(),
    };
    setLoadPlans([newPlan, ...loadPlans]);
    alert(`Load plan ${newPlan.loadNumber} created successfully!\nVehicle: ${newPlan.vehicleId}\nOrders: ${newPlan.orders.length}\nWeight: ${newPlan.totalWeight} lbs`);
  };

  const handleStartLoading = (plan: LoadPlan) => {
    setLoadPlans(loadPlans.map(p =>
      p.id === plan.id
        ? { ...p, status: 'In Progress', loadStartTime: new Date().toLocaleTimeString() }
        : p
    ));
    alert(`Loading started for ${plan.loadNumber}`);
  };

  const handleCompleteLoading = (plan: LoadPlan) => {
    setLoadPlans(loadPlans.map(p =>
      p.id === plan.id
        ? { ...p, status: 'Completed', loadCompleteTime: new Date().toLocaleTimeString() }
        : p
    ));
    alert(`Loading completed for ${plan.loadNumber}`);
  };

  const handleVerifyLoad = (plan: LoadPlan) => {
    setLoadPlans(loadPlans.map(p =>
      p.id === plan.id
        ? { ...p, status: 'Verified', verifiedBy: 'Supervisor' }
        : p
    ));
    alert(`Load verified for ${plan.loadNumber}`);
  };

  const handleTakePhoto = (plan: LoadPlan) => {
    setLoadPlans(loadPlans.map(p =>
      p.id === plan.id
        ? { ...p, photosTaken: p.photosTaken + 1 }
        : p
    ));
    alert(`Photo ${plan.photosTaken + 1} captured for ${plan.loadNumber}`);
  };

  const handleViewDetails = (plan: LoadPlan) => {
    const weightUtilization = ((plan.totalWeight / plan.maxWeight) * 100).toFixed(1);
    const volumeUtilization = ((plan.totalVolume / plan.maxVolume) * 100).toFixed(1);

    const details = `
Load Plan Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Load Number: ${plan.loadNumber}
Vehicle: ${plan.vehicleId} (${plan.vehicleType})
Status: ${plan.status}
Load Type: ${plan.loadType}

Orders:
${plan.orders.map(o => `- ${o}`).join('\n')}

Capacity:
Weight: ${plan.totalWeight} / ${plan.maxWeight} lbs (${weightUtilization}% utilized)
Volume: ${plan.totalVolume} / ${plan.maxVolume} cu ft (${volumeUtilization}% utilized)

Load Composition:
Pallets: ${plan.numberOfPallets}
Boxes: ${plan.numberOfBoxes}

Special Requirements:
${plan.fragile ? '✓ Fragile Items' : ''}
${plan.stackable ? '✓ Stackable' : ''}
${plan.temperatureControlled ? '✓ Temperature Controlled' : ''}
${plan.hazmat ? '✓ Hazmat' : ''}

${plan.loadSequence ? `Load Sequence:\n${plan.loadSequence}` : ''}

Loaded By: ${plan.loadedBy}
${plan.loadStartTime ? `Start Time: ${plan.loadStartTime}` : ''}
${plan.loadCompleteTime ? `Complete Time: ${plan.loadCompleteTime}` : ''}
${plan.verifiedBy ? `Verified By: ${plan.verifiedBy}` : ''}

Photos: ${plan.photosTaken}
${plan.notes ? `Notes: ${plan.notes}` : ''}
    `.trim();
    alert(details);
  };

  const handlePrint = (plan: LoadPlan) => {
    window.print();
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Package2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loading Management</h1>
              <p className="text-gray-600 mt-1">Plan and manage vehicle loading operations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5" />
              Create Load Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Total Loads</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Planning</div>
            <div className="text-2xl font-bold text-gray-600">{stats.planning}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Verified</div>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Avg Utilization
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.avgUtilization}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by load number, vehicle, or order..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <div className="flex gap-2 border-r border-gray-300 pr-2">
                {['all', 'Full', 'Partial', 'LTL'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      filterType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {['all', 'Planning', 'In Progress', 'Completed', 'Verified'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Load Plans List */}
      <div className="space-y-4">
        {filteredPlans.map((plan) => {
          const weightUtilization = ((plan.totalWeight / plan.maxWeight) * 100).toFixed(1);
          const volumeUtilization = ((plan.totalVolume / plan.maxVolume) * 100).toFixed(1);

          return (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{plan.loadNumber}</h3>
                        <p className="text-sm text-gray-600">{plan.vehicleId} - {plan.vehicleType}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getLoadTypeColor(plan.loadType)}`}>
                            {plan.loadType === 'LTL' ? 'Less Than Load' : `${plan.loadType} Load`}
                          </span>
                          {plan.fragile && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-orange-50 text-orange-700 border-orange-200">
                              Fragile
                            </span>
                          )}
                          {plan.temperatureControlled && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                              Temp Controlled
                            </span>
                          )}
                          {plan.hazmat && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                              Hazmat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Orders</p>
                        <p className="text-sm font-medium text-gray-900">{plan.orders.length} orders</p>
                        <p className="text-xs text-gray-600">{plan.orders.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Scale className="w-3 h-3" />
                          Weight
                        </p>
                        <p className="text-sm font-medium text-gray-900">{plan.totalWeight.toLocaleString()} lbs</p>
                        <p className="text-xs text-gray-600">{weightUtilization}% utilized</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Box className="w-3 h-3" />
                          Load
                        </p>
                        <p className="text-sm font-medium text-gray-900">{plan.numberOfPallets} pallets</p>
                        <p className="text-xs text-gray-600">{plan.numberOfBoxes} boxes</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Loaded By</p>
                        <p className="text-sm font-medium text-gray-900">{plan.loadedBy}</p>
                        {plan.loadStartTime && (
                          <p className="text-xs text-gray-600">Started: {plan.loadStartTime}</p>
                        )}
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Weight Utilization</span>
                          <span className="text-xs font-bold text-gray-900">{weightUtilization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              parseFloat(weightUtilization) > 90 ? 'bg-red-500' :
                              parseFloat(weightUtilization) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${weightUtilization}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">Volume Utilization</span>
                          <span className="text-xs font-bold text-gray-900">{volumeUtilization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              parseFloat(volumeUtilization) > 90 ? 'bg-red-500' :
                              parseFloat(volumeUtilization) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${volumeUtilization}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {plan.photosTaken > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Camera className="w-3 h-3" />
                        {plan.photosTaken} photo{plan.photosTaken > 1 ? 's' : ''} taken
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:w-48 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full"
                      onClick={() => handleViewDetails(plan)}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>

                    {plan.status === 'Planning' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-2 w-full"
                        onClick={() => handleStartLoading(plan)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Start Loading
                      </Button>
                    )}

                    {plan.status === 'In Progress' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 w-full"
                          onClick={() => handleTakePhoto(plan)}
                        >
                          <Camera className="w-4 h-4" />
                          Take Photo
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="gap-2 w-full"
                          onClick={() => handleCompleteLoading(plan)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Complete Loading
                        </Button>
                      </>
                    )}

                    {plan.status === 'Completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-2 w-full"
                        onClick={() => handleVerifyLoad(plan)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Verify Load
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full"
                      onClick={() => handlePrint(plan)}
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No load plans found</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Create First Load Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Load Plan Modal */}
      <LoadPlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLoadPlan}
      />
    </DashboardLayout>
  );
};

export default Loading;
