import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Calendar, Clock, Warehouse, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScheduleDockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DockAppointmentData) => void;
  appointmentType: 'inbound' | 'outbound';
}

export interface DockAppointmentData {
  appointmentType: 'inbound' | 'outbound';
  dockDoor: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  carrier: string;
  referenceNumber: string;
  vehicleType: string;
  trailerNumber: string;
  expectedPallets: number;
  specialRequirements: string;
  contactName: string;
  contactPhone: string;
  notes: string;
}

export const ScheduleDockModal: React.FC<ScheduleDockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  appointmentType,
}) => {
  const [formData, setFormData] = useState<DockAppointmentData>({
    appointmentType,
    dockDoor: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: 60,
    carrier: '',
    referenceNumber: '',
    vehicleType: '',
    trailerNumber: '',
    expectedPallets: 0,
    specialRequirements: '',
    contactName: '',
    contactPhone: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DockAppointmentData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DockAppointmentData, string>> = {};

    if (!formData.dockDoor.trim()) newErrors.dockDoor = 'Dock door is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Appointment time is required';
    if (!formData.carrier.trim()) newErrors.carrier = 'Carrier is required';
    if (!formData.referenceNumber.trim()) newErrors.referenceNumber = 'Reference number is required';
    if (!formData.vehicleType.trim()) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setFormData({
      appointmentType,
      dockDoor: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: 60,
      carrier: '',
      referenceNumber: '',
      vehicleType: '',
      trailerNumber: '',
      expectedPallets: 0,
      specialRequirements: '',
      contactName: '',
      contactPhone: '',
      notes: '',
    });
    setErrors({});
  };

  const handleChange = (field: keyof DockAppointmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const dockDoors = [
    { id: 'DOCK-A1', name: 'Dock A1 - Inbound Primary', type: 'inbound' },
    { id: 'DOCK-A2', name: 'Dock A2 - Inbound Secondary', type: 'inbound' },
    { id: 'DOCK-A3', name: 'Dock A3 - Inbound Overflow', type: 'inbound' },
    { id: 'DOCK-B1', name: 'Dock B1 - Outbound Primary', type: 'outbound' },
    { id: 'DOCK-B2', name: 'Dock B2 - Outbound Secondary', type: 'outbound' },
    { id: 'DOCK-B3', name: 'Dock B3 - Outbound Overflow', type: 'outbound' },
    { id: 'DOCK-C1', name: 'Dock C1 - Multi-Purpose', type: 'both' },
    { id: 'DOCK-C2', name: 'Dock C2 - Multi-Purpose', type: 'both' },
  ];

  const filteredDocks = dockDoors.filter(
    dock => dock.type === appointmentType || dock.type === 'both'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule ${appointmentType === 'inbound' ? 'Inbound' : 'Outbound'} Dock Appointment`}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Schedule Appointment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dock Door Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dock Door <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={formData.dockDoor}
              onChange={(e) => handleChange('dockDoor', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dockDoor ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Dock Door</option>
              {filteredDocks.map(dock => (
                <option key={dock.id} value={dock.id}>{dock.name}</option>
              ))}
            </select>
          </div>
          {errors.dockDoor && <p className="text-xs text-red-500 mt-1">{errors.dockDoor}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Appointment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => handleChange('appointmentDate', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.appointmentDate && <p className="text-xs text-red-500 mt-1">{errors.appointmentDate}</p>}
          </div>

          {/* Appointment Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => handleChange('appointmentTime', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.appointmentTime && <p className="text-xs text-red-500 mt-1">{errors.appointmentTime}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Carrier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={formData.carrier}
                onChange={(e) => handleChange('carrier', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.carrier ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Carrier</option>
                <option value="FedEx Freight">FedEx Freight</option>
                <option value="UPS Freight">UPS Freight</option>
                <option value="XPO Logistics">XPO Logistics</option>
                <option value="Old Dominion">Old Dominion</option>
                <option value="DHL Freight">DHL Freight</option>
                <option value="Private Fleet">Private Fleet</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.carrier && <p className="text-xs text-red-500 mt-1">{errors.carrier}</p>}
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => handleChange('referenceNumber', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.referenceNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={appointmentType === 'inbound' ? 'ASN / PO Number' : 'Order / Shipment Number'}
            />
            {errors.referenceNumber && <p className="text-xs text-red-500 mt-1">{errors.referenceNumber}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => handleChange('vehicleType', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.vehicleType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Type</option>
              <option value="53ft Trailer">53ft Trailer</option>
              <option value="48ft Trailer">48ft Trailer</option>
              <option value="Box Truck">Box Truck</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Refrigerated">Refrigerated</option>
              <option value="Van">Van</option>
            </select>
            {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>}
          </div>

          {/* Trailer Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trailer Number
            </label>
            <input
              type="text"
              value={formData.trailerNumber}
              onChange={(e) => handleChange('trailerNumber', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Expected Pallets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Pallets
          </label>
          <input
            type="number"
            value={formData.expectedPallets}
            onChange={(e) => handleChange('expectedPallets', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            placeholder="0"
          />
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requirements
          </label>
          <select
            value={formData.specialRequirements}
            onChange={(e) => handleChange('specialRequirements', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">None</option>
            <option value="Temperature Controlled">Temperature Controlled</option>
            <option value="Hazmat">Hazardous Materials</option>
            <option value="Oversize">Oversize Load</option>
            <option value="Live Unload">Live Unload Required</option>
            <option value="Cross-Dock">Cross-Dock</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Contact Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.contactName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Driver or coordinator name"
            />
            {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.contactPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Special instructions, delivery notes, etc."
          />
        </div>

        {/* Warning for Special Requirements */}
        {formData.specialRequirements && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Special Handling Required</p>
                <p className="text-xs text-blue-700 mt-1">
                  This appointment has special requirements: {formData.specialRequirements}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
