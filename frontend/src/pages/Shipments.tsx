import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreateShipmentModal, ShipmentFormData } from '../components/shipments/CreateShipmentModal';
import { EditShipmentModal, EditShipmentData } from '../components/shipments/EditShipmentModal';
import shipmentsService, { Shipment as APIShipment } from '../services/shipments.service';

interface Shipment {
  id: string;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  weight: number;
  estimatedDelivery: string;
  carrier: string;
}

const Shipments: React.FC = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch shipments from API
  useEffect(() => {
    fetchShipments();
  }, [page, filterStatus]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const statusFilter = filterStatus === 'all' ? undefined : filterStatus.toUpperCase().replace('-', '_') as any;
      const response = await shipmentsService.getAll(page, 20, statusFilter);

      // Map API shipments to UI format
      const mapped = response.data.map((s: APIShipment) => ({
        id: s.id,
        trackingNumber: s.trackingNumber,
        customer: s.customerId, // TODO: Fetch customer name
        origin: `${s.originCity}, ${s.originState}`,
        destination: `${s.destinationCity}, ${s.destinationState}`,
        status: s.status.toLowerCase().replace('_', '-') as any,
        weight: s.weight,
        estimatedDelivery: s.estimatedDeliveryDate || 'TBD',
        carrier: s.carrierId || 'Unassigned',
      }));

      setShipments(mapped);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      console.error('Error fetching shipments:', err);
      setError(err.response?.data?.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const [mockShipments] = useState<Shipment[]>([
    {
      id: '1',
      trackingNumber: 'TRK-2024-001',
      customer: 'Acme Corp',
      origin: 'Los Angeles, CA',
      destination: 'New York, NY',
      status: 'in-transit',
      weight: 45.5,
      estimatedDelivery: '2025-12-02',
      carrier: 'FedEx',
    },
    {
      id: '2',
      trackingNumber: 'TRK-2024-002',
      customer: 'Tech Solutions Inc',
      origin: 'Chicago, IL',
      destination: 'Miami, FL',
      status: 'pending',
      weight: 23.2,
      estimatedDelivery: '2025-12-03',
      carrier: 'UPS',
    },
    {
      id: '3',
      trackingNumber: 'TRK-2024-003',
      customer: 'Global Industries',
      origin: 'Seattle, WA',
      destination: 'Boston, MA',
      status: 'delivered',
      weight: 67.8,
      estimatedDelivery: '2025-11-28',
      carrier: 'DHL',
    },
    {
      id: '4',
      trackingNumber: 'TRK-2024-004',
      customer: 'Retail Plus',
      origin: 'Dallas, TX',
      destination: 'San Francisco, CA',
      status: 'in-transit',
      weight: 12.3,
      estimatedDelivery: '2025-12-01',
      carrier: 'FedEx',
    },
    {
      id: '5',
      trackingNumber: 'TRK-2024-005',
      customer: 'Manufacturing Co',
      origin: 'Phoenix, AZ',
      destination: 'Denver, CO',
      status: 'in-transit',
      weight: 89.4,
      estimatedDelivery: '2025-12-02',
      carrier: 'USPS',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [showEditShipment, setShowEditShipment] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Use API shipments if available, otherwise use mock data
  const displayShipments = shipments.length > 0 ? shipments : mockShipments;

  const filteredShipments = displayShipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handler functions
  const handleCreateShipment = async (data: ShipmentFormData) => {
    try {
      const createDto = {
        trackingNumber: data.trackingNumber,
        type: 'DOMESTIC' as const,
        customerId: 'customer-id-placeholder', // TODO: Get from customer selection
        originAddress: `${data.originStreet}, ${data.originCity}, ${data.originState} ${data.originZip}`,
        destinationAddress: `${data.destinationStreet}, ${data.destinationCity}, ${data.destinationState} ${data.destinationZip}`,
        originCity: data.originCity,
        originState: data.originState,
        originCountry: data.originCountry || 'USA',
        originZip: data.originZip,
        destinationCity: data.destinationCity,
        destinationState: data.destinationState,
        destinationCountry: data.destinationCountry || 'USA',
        destinationZip: data.destinationZip,
        weight: data.weight,
        estimatedDeliveryDate: data.estimatedDelivery,
        carrierId: data.carrier,
      };

      await shipmentsService.create(createDto);
      alert(`Shipment created successfully: ${data.trackingNumber}`);
      fetchShipments(); // Refresh list
    } catch (err: any) {
      console.error('Error creating shipment:', err);
      alert(err.response?.data?.message || 'Failed to create shipment');
    }
  };

  const handleEditShipment = async (data: EditShipmentData) => {
    if (!selectedShipment) return;
    try {
      const updateDto = {
        status: data.status.toUpperCase().replace('-', '_') as any,
        carrierId: data.carrier,
        weight: data.weight,
        estimatedDeliveryDate: data.estimatedDelivery,
      };

      await shipmentsService.update(selectedShipment.id, updateDto);
      alert(`Shipment ${selectedShipment.trackingNumber} updated successfully!`);
      fetchShipments(); // Refresh list
    } catch (err: any) {
      console.error('Error updating shipment:', err);
      alert(err.response?.data?.message || 'Failed to update shipment');
    }
  };

  const handleViewShipment = (shipmentId: string) => {
    navigate(`/tracking/${shipmentId}`);
  };

  const handleEditClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowEditShipment(true);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
            <p className="text-gray-600 mt-1">Manage and track all your shipments</p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateShipment(true)}>
            <span className="mr-2">+</span>
            Create Shipment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">Total Shipments</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{shipments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">In Transit</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {shipments.filter((s) => s.status === 'in-transit').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">Delivered</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {shipments.filter((s) => s.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">
              {shipments.filter((s) => s.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by tracking number, customer, or destination..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'in-transit', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="text-5xl">📦</div>
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Loading shipments...</p>
              <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-5xl">📦</div>
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Error loading shipments</p>
              <p className="text-sm text-red-600 mb-6">{error}</p>
              <Button variant="primary" onClick={fetchShipments}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipments Table */}
      {!loading && !error && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{shipment.trackingNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.customer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div>{shipment.origin}</div>
                        <div className="text-gray-400">→ {shipment.destination}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.carrier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.weight} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                          shipment.status
                        )}`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.estimatedDelivery}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleViewShipment(shipment.id)}
                      >
                        View
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => handleEditClick(shipment)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            {filteredShipments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-gray-600 font-medium">No shipments found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CreateShipmentModal
        isOpen={showCreateShipment}
        onClose={() => setShowCreateShipment(false)}
        onSubmit={handleCreateShipment}
      />

      {selectedShipment && (
        <EditShipmentModal
          isOpen={showEditShipment}
          onClose={() => {
            setShowEditShipment(false);
            setSelectedShipment(null);
          }}
          shipment={selectedShipment}
          onSubmit={handleEditShipment}
        />
      )}
    </DashboardLayout>
  );
};

export default Shipments;
