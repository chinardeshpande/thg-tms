import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Truck,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  Box,
  Scale,
  Package,
  Eye,
  Edit,
  Trash2,
  BarChart3,
} from 'lucide-react';
import { VehicleCapacityModal, VehicleCapacityData } from '../components/capacity/VehicleCapacityModal';

interface VehicleCapacity {
  id: string;
  vehicleType: string;
  maxWeight: number;
  maxVolume: number;
  maxLength: number;
  maxWidth: number;
  maxHeight: number;
  maxPallets: number;
  utilizationTarget: number;
  currentUtilization: number;
  activeVehicles: number;
  notes?: string;
  createdAt: string;
}

const VehicleCapacity: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [capacities, setCapacities] = useState<VehicleCapacity[]>([
    {
      id: '1',
      vehicleType: '53ft Dry Van',
      maxWeight: 45000,
      maxVolume: 3800,
      maxLength: 53,
      maxWidth: 8.5,
      maxHeight: 9,
      maxPallets: 26,
      utilizationTarget: 85,
      currentUtilization: 82,
      activeVehicles: 15,
      notes: 'Standard dry van for general freight',
      createdAt: '2025-11-01',
    },
    {
      id: '2',
      vehicleType: '48ft Refrigerated',
      maxWeight: 45000,
      maxVolume: 3600,
      maxLength: 48,
      maxWidth: 8.5,
      maxHeight: 9,
      maxPallets: 24,
      utilizationTarget: 90,
      currentUtilization: 88,
      activeVehicles: 8,
      notes: 'Temperature-controlled transport',
      createdAt: '2025-11-01',
    },
    {
      id: '3',
      vehicleType: '53ft Flatbed',
      maxWeight: 48000,
      maxVolume: 0,
      maxLength: 53,
      maxWidth: 8.5,
      maxHeight: 0,
      maxPallets: 26,
      utilizationTarget: 80,
      currentUtilization: 65,
      activeVehicles: 5,
      notes: 'For oversized and heavy cargo',
      createdAt: '2025-11-01',
    },
    {
      id: '4',
      vehicleType: '26ft Box Truck',
      maxWeight: 12000,
      maxVolume: 1800,
      maxLength: 26,
      maxWidth: 8,
      maxHeight: 8,
      maxPallets: 12,
      utilizationTarget: 75,
      currentUtilization: 78,
      activeVehicles: 12,
      notes: 'Local deliveries and smaller loads',
      createdAt: '2025-11-01',
    },
    {
      id: '5',
      vehicleType: 'Sprinter Van',
      maxWeight: 5000,
      maxVolume: 530,
      maxLength: 14,
      maxWidth: 6,
      maxHeight: 6,
      maxPallets: 6,
      utilizationTarget: 70,
      currentUtilization: 55,
      activeVehicles: 20,
      notes: 'Last-mile and express deliveries',
      createdAt: '2025-11-15',
    },
  ]);

  const filteredCapacities = capacities.filter((capacity) =>
    capacity.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalTypes: capacities.length,
    totalVehicles: capacities.reduce((sum, c) => sum + c.activeVehicles, 0),
    avgUtilization: Math.round(
      capacities.reduce((sum, c) => sum + c.currentUtilization, 0) / capacities.length
    ),
    underUtilized: capacities.filter(c => c.currentUtilization < c.utilizationTarget).length,
    overUtilized: capacities.filter(c => c.currentUtilization > c.utilizationTarget + 5).length,
  };

  const handleCreateCapacity = (data: VehicleCapacityData) => {
    const newCapacity: VehicleCapacity = {
      id: String(capacities.length + 1),
      vehicleType: data.vehicleType,
      maxWeight: data.maxWeight,
      maxVolume: data.maxVolume,
      maxLength: data.maxLength,
      maxWidth: data.maxWidth,
      maxHeight: data.maxHeight,
      maxPallets: data.maxPallets,
      utilizationTarget: data.utilizationTarget,
      currentUtilization: 0,
      activeVehicles: 0,
      notes: data.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCapacities([newCapacity, ...capacities]);
    alert(`Vehicle capacity configuration created for ${newCapacity.vehicleType}`);
  };

  const handleDelete = (capacity: VehicleCapacity) => {
    if (confirm(`Are you sure you want to delete the capacity configuration for ${capacity.vehicleType}?`)) {
      setCapacities(capacities.filter(c => c.id !== capacity.id));
      alert(`Deleted ${capacity.vehicleType} configuration`);
    }
  };

  const handleViewDetails = (capacity: VehicleCapacity) => {
    const details = `
Vehicle Capacity Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vehicle Type: ${capacity.vehicleType}
Active Vehicles: ${capacity.activeVehicles}

Capacity Specifications:
Max Weight: ${capacity.maxWeight.toLocaleString()} lbs
Max Volume: ${capacity.maxVolume} cu ft
Dimensions: ${capacity.maxLength}' L × ${capacity.maxWidth}' W × ${capacity.maxHeight}' H
Max Pallets: ${capacity.maxPallets}

Utilization:
Target: ${capacity.utilizationTarget}%
Current: ${capacity.currentUtilization}%
Status: ${
  capacity.currentUtilization < capacity.utilizationTarget
    ? 'Under-utilized'
    : capacity.currentUtilization > capacity.utilizationTarget + 5
    ? 'Over-utilized'
    : 'Optimal'
}

${capacity.notes ? `Notes: ${capacity.notes}` : ''}
    `.trim();
    alert(details);
  };

  const getUtilizationColor = (current: number, target: number) => {
    if (current < target) return 'text-orange-600';
    if (current > target + 5) return 'text-red-600';
    return 'text-green-600';
  };

  const getUtilizationBgColor = (current: number, target: number) => {
    if (current < target) return 'bg-orange-500';
    if (current > target + 5) return 'bg-red-500';
    return 'bg-green-500';
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vehicle Capacity Planning</h1>
              <p className="text-gray-600 mt-1">Configure and optimize vehicle capacity utilization</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5" />
              Add Vehicle Type
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Vehicle Types</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalTypes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Total Vehicles</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalVehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Avg Utilization
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.avgUtilization}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Under-Utilized</div>
            <div className="text-2xl font-bold text-orange-600">{stats.underUtilized}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Over-Utilized</div>
            <div className="text-2xl font-bold text-red-600">{stats.overUtilized}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vehicle types..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Capacities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCapacities.map((capacity) => (
          <Card key={capacity.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{capacity.vehicleType}</h3>
                    <p className="text-sm text-gray-600">{capacity.activeVehicles} active vehicle{capacity.activeVehicles !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Capacity Specs */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Scale className="w-4 h-4" />
                    <span>Max Weight</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {capacity.maxWeight.toLocaleString()} lbs
                  </span>
                </div>

                {capacity.maxVolume > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Box className="w-4 h-4" />
                      <span>Max Volume</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {capacity.maxVolume} cu ft
                    </span>
                  </div>
                )}

                {capacity.maxPallets > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>Max Pallets</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {capacity.maxPallets}
                    </span>
                  </div>
                )}

                {capacity.maxLength > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Dimensions</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {capacity.maxLength}' × {capacity.maxWidth}' × {capacity.maxHeight}'
                    </span>
                  </div>
                )}
              </div>

              {/* Utilization */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Utilization</span>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${getUtilizationColor(capacity.currentUtilization, capacity.utilizationTarget)}`}>
                      {capacity.currentUtilization}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/ {capacity.utilizationTarget}% target</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getUtilizationBgColor(capacity.currentUtilization, capacity.utilizationTarget)}`}
                    style={{ width: `${Math.min(capacity.currentUtilization, 100)}%` }}
                  />
                </div>
                {capacity.currentUtilization < capacity.utilizationTarget && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Below target by {capacity.utilizationTarget - capacity.currentUtilization}%</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {capacity.notes && (
                <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  {capacity.notes}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleViewDetails(capacity)}
                >
                  <Eye className="w-4 h-4" />
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDelete(capacity)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCapacities.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No vehicle types found</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your search or add a new vehicle type</p>
              <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Add First Vehicle Type
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <VehicleCapacityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCapacity}
      />
    </DashboardLayout>
  );
};

export default VehicleCapacity;
