import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Shield,
  Plus,
  Search,
  Filter,
  LogIn,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Truck,
  User,
  FileText,
  Eye,
  Printer,
  Download,
} from 'lucide-react';
import { CreateGatePassModal, GatePassData } from '../components/gatepass/CreateGatePassModal';

interface GatePass {
  id: string;
  passNumber: string;
  passType: 'inbound' | 'outbound' | 'visitor';
  status: 'Active' | 'Checked In' | 'Checked Out' | 'Expired' | 'Cancelled';
  driverName: string;
  driverLicense: string;
  driverPhone: string;
  vehicleType: string;
  vehiclePlate: string;
  trailerNumber?: string;
  companyName: string;
  purpose: string;
  referenceNumber?: string;
  entryTime?: string;
  exitTime?: string;
  expectedDuration: number;
  actualDuration?: number;
  securityNotes?: string;
  requiresInspection: boolean;
  requiresEscort: boolean;
  inspectionCompleted: boolean;
  accessAreas: string[];
  createdAt: string;
  createdBy: string;
}

const GatePass: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [gatePasses, setGatePasses] = useState<GatePass[]>([
    {
      id: '1',
      passNumber: 'GP-2024-001',
      passType: 'inbound',
      status: 'Checked In',
      driverName: 'Mike Wilson',
      driverLicense: 'DL123456789',
      driverPhone: '+1 (555) 123-4567',
      vehicleType: '53ft Trailer',
      vehiclePlate: 'ABC-1234',
      trailerNumber: 'TRL-12345',
      companyName: 'FedEx Freight',
      purpose: 'Delivery',
      referenceNumber: 'ASN-2024-001',
      entryTime: '08:15',
      expectedDuration: 120,
      securityNotes: 'Live unload required',
      requiresInspection: true,
      requiresEscort: false,
      inspectionCompleted: true,
      accessAreas: ['Receiving Dock', 'Warehouse Floor'],
      createdAt: '2025-11-30 08:00',
      createdBy: 'Security Team',
    },
    {
      id: '2',
      passNumber: 'GP-2024-002',
      passType: 'outbound',
      status: 'Active',
      driverName: 'Sarah Johnson',
      driverLicense: 'DL987654321',
      driverPhone: '+1 (555) 234-5678',
      vehicleType: 'Box Truck',
      vehiclePlate: 'XYZ-5678',
      companyName: 'UPS Freight',
      purpose: 'Pickup',
      referenceNumber: 'SO-2024-002',
      expectedDuration: 90,
      requiresInspection: false,
      requiresEscort: false,
      inspectionCompleted: false,
      accessAreas: ['Shipping Dock', 'Loading Zone'],
      createdAt: '2025-11-30 10:00',
      createdBy: 'Security Team',
    },
    {
      id: '3',
      passNumber: 'GP-2024-003',
      passType: 'visitor',
      status: 'Checked Out',
      driverName: 'Tom Brown',
      driverLicense: 'DL555444333',
      driverPhone: '+1 (555) 345-6789',
      vehicleType: 'Car',
      vehiclePlate: 'DEF-9012',
      companyName: 'ABC Consulting',
      purpose: 'Meeting',
      entryTime: '09:00',
      exitTime: '11:30',
      expectedDuration: 120,
      actualDuration: 150,
      requiresInspection: false,
      requiresEscort: true,
      inspectionCompleted: false,
      accessAreas: ['Office Area'],
      createdAt: '2025-11-30 08:45',
      createdBy: 'Security Team',
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'bg-blue-100 text-blue-800 border-blue-200',
      'Checked In': 'bg-green-100 text-green-800 border-green-200',
      'Checked Out': 'bg-gray-100 text-gray-800 border-gray-200',
      'Expired': 'bg-red-100 text-red-800 border-red-200',
      'Cancelled': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'inbound': 'bg-blue-50 text-blue-700 border-blue-200',
      'outbound': 'bg-green-50 text-green-700 border-green-200',
      'visitor': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredPasses = gatePasses.filter((pass) => {
    const matchesStatus = filterStatus === 'all' || pass.status === filterStatus;
    const matchesType = filterType === 'all' || pass.passType === filterType;
    const matchesSearch =
      pass.passNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: gatePasses.length,
    active: gatePasses.filter(p => p.status === 'Active').length,
    checkedIn: gatePasses.filter(p => p.status === 'Checked In').length,
    onSite: gatePasses.filter(p => p.status === 'Active' || p.status === 'Checked In').length,
    todayEntries: gatePasses.filter(p => p.entryTime).length,
    todayExits: gatePasses.filter(p => p.exitTime).length,
  };

  const handleCreateGatePass = (data: GatePassData) => {
    const newPass: GatePass = {
      id: String(gatePasses.length + 1),
      passNumber: `GP-2024-${String(gatePasses.length + 1).padStart(3, '0')}`,
      passType: data.passType,
      status: 'Active',
      driverName: data.driverName,
      driverLicense: data.driverLicense,
      driverPhone: data.driverPhone,
      vehicleType: data.vehicleType,
      vehiclePlate: data.vehiclePlate,
      trailerNumber: data.trailerNumber,
      companyName: data.companyName,
      purpose: data.purpose,
      referenceNumber: data.referenceNumber,
      expectedDuration: data.expectedDuration,
      securityNotes: data.securityNotes,
      requiresInspection: data.requiresInspection,
      requiresEscort: data.requiresEscort,
      inspectionCompleted: false,
      accessAreas: data.accessAreas,
      createdAt: new Date().toLocaleString(),
      createdBy: 'Security Team',
    };
    setGatePasses([newPass, ...gatePasses]);
    alert(`Gate pass ${newPass.passNumber} created successfully!\nDriver: ${newPass.driverName}\nVehicle: ${newPass.vehiclePlate}`);
  };

  const handleCheckIn = (pass: GatePass) => {
    setGatePasses(gatePasses.map(p =>
      p.id === pass.id
        ? { ...p, status: 'Checked In', entryTime: new Date().toLocaleTimeString() }
        : p
    ));
    alert(`Vehicle ${pass.vehiclePlate} checked in at ${new Date().toLocaleTimeString()}`);
  };

  const handleCheckOut = (pass: GatePass) => {
    const exitTime = new Date().toLocaleTimeString();
    const entryTime = pass.entryTime ? new Date(`2025-11-30 ${pass.entryTime}`) : new Date();
    const exit = new Date(`2025-11-30 ${exitTime}`);
    const actualDuration = Math.round((exit.getTime() - entryTime.getTime()) / 60000);

    setGatePasses(gatePasses.map(p =>
      p.id === pass.id
        ? { ...p, status: 'Checked Out', exitTime, actualDuration }
        : p
    ));
    alert(`Vehicle ${pass.vehiclePlate} checked out\nDuration: ${actualDuration} minutes`);
  };

  const handleViewDetails = (pass: GatePass) => {
    const details = `
Gate Pass Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pass Number: ${pass.passNumber}
Type: ${pass.passType.toUpperCase()}
Status: ${pass.status}

Driver Information:
Name: ${pass.driverName}
License: ${pass.driverLicense}
Phone: ${pass.driverPhone}

Vehicle Information:
Type: ${pass.vehicleType}
Plate: ${pass.vehiclePlate}
${pass.trailerNumber ? `Trailer: ${pass.trailerNumber}` : ''}

Visit Details:
Company: ${pass.companyName}
Purpose: ${pass.purpose}
${pass.referenceNumber ? `Reference: ${pass.referenceNumber}` : ''}

Timing:
Expected Duration: ${pass.expectedDuration} min
${pass.entryTime ? `Entry: ${pass.entryTime}` : 'Not checked in yet'}
${pass.exitTime ? `Exit: ${pass.exitTime}` : ''}
${pass.actualDuration ? `Actual Duration: ${pass.actualDuration} min` : ''}

Access Areas:
${pass.accessAreas.join(', ')}

Security:
Inspection Required: ${pass.requiresInspection ? 'Yes' : 'No'}
Escort Required: ${pass.requiresEscort ? 'Yes' : 'No'}
${pass.requiresInspection ? `Inspection Completed: ${pass.inspectionCompleted ? 'Yes' : 'No'}` : ''}
${pass.securityNotes ? `Notes: ${pass.securityNotes}` : ''}
    `.trim();
    alert(details);
  };

  const handlePrintPass = (pass: GatePass) => {
    window.print();
  };

  const handleCompleteInspection = (pass: GatePass) => {
    setGatePasses(gatePasses.map(p =>
      p.id === pass.id
        ? { ...p, inspectionCompleted: true }
        : p
    ));
    alert(`Inspection completed for vehicle ${pass.vehiclePlate}`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gate Pass Management</h1>
              <p className="text-gray-600 mt-1">Manage visitor and vehicle gate passes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5" />
              Create Gate Pass
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Total Passes</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">On-Site</div>
            <div className="text-2xl font-bold text-green-600">{stats.onSite}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Checked In</div>
            <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Today Entries</div>
            <div className="text-2xl font-bold text-purple-600">{stats.todayEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 mb-1">Today Exits</div>
            <div className="text-2xl font-bold text-orange-600">{stats.todayExits}</div>
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
                placeholder="Search by pass number, driver, vehicle, or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <div className="flex gap-2 border-r border-gray-300 pr-2">
                {['all', 'inbound', 'outbound', 'visitor'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      filterType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {['all', 'Active', 'Checked In', 'Checked Out'].map((status) => (
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

      {/* Gate Passes List */}
      <div className="space-y-4">
        {filteredPasses.map((pass) => (
          <Card key={pass.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pass.passNumber}</h3>
                      <p className="text-sm text-gray-600">{pass.companyName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(pass.status)}`}>
                          {pass.status}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getTypeColor(pass.passType)}`}>
                          {pass.passType.toUpperCase()}
                        </span>
                        {pass.requiresInspection && (
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            pass.inspectionCompleted
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {pass.inspectionCompleted ? 'Inspection ✓' : 'Inspection Required'}
                          </span>
                        )}
                        {pass.requiresEscort && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200">
                            Escort Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Driver
                      </p>
                      <p className="text-sm font-medium text-gray-900">{pass.driverName}</p>
                      <p className="text-xs text-gray-600">{pass.driverLicense}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Vehicle
                      </p>
                      <p className="text-sm font-medium text-gray-900">{pass.vehiclePlate}</p>
                      <p className="text-xs text-gray-600">{pass.vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Purpose
                      </p>
                      <p className="text-sm font-medium text-gray-900">{pass.purpose}</p>
                      {pass.referenceNumber && (
                        <p className="text-xs text-gray-600">{pass.referenceNumber}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Timing
                      </p>
                      {pass.entryTime ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">In: {pass.entryTime}</p>
                          {pass.exitTime && (
                            <p className="text-xs text-gray-600">Out: {pass.exitTime}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{pass.expectedDuration} min</p>
                      )}
                    </div>
                  </div>

                  {/* Access Areas */}
                  {pass.accessAreas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Authorized Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {pass.accessAreas.map((area) => (
                          <span key={area} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security Notes */}
                  {pass.securityNotes && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-gray-500 mb-0.5">Security Notes:</p>
                      <p className="text-sm text-gray-900">{pass.securityNotes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="lg:w-48 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full"
                    onClick={() => handleViewDetails(pass)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>

                  {pass.status === 'Active' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-2 w-full"
                      onClick={() => handleCheckIn(pass)}
                    >
                      <LogIn className="w-4 h-4" />
                      Check In
                    </Button>
                  )}

                  {pass.status === 'Checked In' && (
                    <>
                      {pass.requiresInspection && !pass.inspectionCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 w-full"
                          onClick={() => handleCompleteInspection(pass)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Complete Inspection
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-2 w-full"
                        onClick={() => handleCheckOut(pass)}
                      >
                        <LogOut className="w-4 h-4" />
                        Check Out
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full"
                    onClick={() => handlePrintPass(pass)}
                  >
                    <Printer className="w-4 h-4" />
                    Print Pass
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full"
                  >
                    <QrCode className="w-4 h-4" />
                    View QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPasses.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-2">No gate passes found</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Create First Gate Pass
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Gate Pass Modal */}
      <CreateGatePassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGatePass}
      />
    </DashboardLayout>
  );
};

export default GatePass;
