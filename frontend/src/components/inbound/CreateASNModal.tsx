import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Plus, X, Building2, Package, Calendar, AlertCircle } from 'lucide-react';

interface CreateASNModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ASNFormData) => void;
}

export interface ASNFormData {
  poNumber: string;
  supplier: string;
  appointmentDate: string;
  appointmentTime: string;
  shipmentType: 'Purchase Order' | 'Transfer' | 'Return to Vendor' | 'Cross-Dock';
  priority: 'Standard' | 'Urgent' | 'Critical';
  carrier: string;
  trackingNumber: string;
  totalItems: number;
  totalPallets: number;
  totalWeight: number;
  requiresInspection: boolean;
  temperatureControlled: boolean;
  hazmat: boolean;
  notes: string;
}

export const CreateASNModal: React.FC<CreateASNModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ASNFormData>({
    poNumber: '',
    supplier: '',
    appointmentDate: '',
    appointmentTime: '',
    shipmentType: 'Purchase Order',
    priority: 'Standard',
    carrier: '',
    trackingNumber: '',
    totalItems: 0,
    totalPallets: 0,
    totalWeight: 0,
    requiresInspection: false,
    temperatureControlled: false,
    hazmat: false,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ASNFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ASNFormData, string>> = {};

    if (!formData.poNumber.trim()) newErrors.poNumber = 'PO Number is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Appointment time is required';
    if (!formData.carrier.trim()) newErrors.carrier = 'Carrier is required';
    if (!formData.trackingNumber.trim()) newErrors.trackingNumber = 'Tracking number is required';
    if (formData.totalItems <= 0) newErrors.totalItems = 'Total items must be greater than 0';
    if (formData.totalPallets <= 0) newErrors.totalPallets = 'Total pallets must be greater than 0';
    if (formData.totalWeight <= 0) newErrors.totalWeight = 'Total weight must be greater than 0';

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
      poNumber: '',
      supplier: '',
      appointmentDate: '',
      appointmentTime: '',
      shipmentType: 'Purchase Order',
      priority: 'Standard',
      carrier: '',
      trackingNumber: '',
      totalItems: 0,
      totalPallets: 0,
      totalWeight: 0,
      requiresInspection: false,
      temperatureControlled: false,
      hazmat: false,
      notes: '',
    });
    setErrors({});
  };

  const handleChange = (field: keyof ASNFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Advanced Shipping Notice (ASN)"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <Plus className="w-4 h-4" />
            Create ASN
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                PO Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.poNumber}
                onChange={(e) => handleChange('poNumber', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.poNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="PO-2024-XXXX"
              />
              {errors.poNumber && <p className="text-xs text-red-500 mt-1">{errors.poNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.supplier ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Supplier</option>
                <option value="Tech Components Inc.">Tech Components Inc.</option>
                <option value="Global Textiles Ltd.">Global Textiles Ltd.</option>
                <option value="Fresh Foods Distribution">Fresh Foods Distribution</option>
                <option value="Industrial Parts Supply">Industrial Parts Supply</option>
                <option value="Pacific Electronics">Pacific Electronics</option>
              </select>
              {errors.supplier && <p className="text-xs text-red-500 mt-1">{errors.supplier}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shipment Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.shipmentType}
                onChange={(e) => handleChange('shipmentType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Purchase Order">Purchase Order</option>
                <option value="Transfer">Transfer</option>
                <option value="Return to Vendor">Return to Vendor</option>
                <option value="Cross-Dock">Cross-Dock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointment */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Appointment Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => handleChange('appointmentDate', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointmentDate && <p className="text-xs text-red-500 mt-1">{errors.appointmentDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => handleChange('appointmentTime', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointmentTime && <p className="text-xs text-red-500 mt-1">{errors.appointmentTime}</p>}
            </div>
          </div>
        </div>

        {/* Carrier Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Carrier Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Carrier <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.carrier}
                onChange={(e) => handleChange('carrier', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.carrier ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Carrier</option>
                <option value="FedEx Freight">FedEx Freight</option>
                <option value="UPS Freight">UPS Freight</option>
                <option value="XPO Logistics">XPO Logistics</option>
                <option value="Old Dominion">Old Dominion</option>
                <option value="DHL Freight">DHL Freight</option>
              </select>
              {errors.carrier && <p className="text-xs text-red-500 mt-1">{errors.carrier}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tracking Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) => handleChange('trackingNumber', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.trackingNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="FXF-2024-XXXX"
              />
              {errors.trackingNumber && <p className="text-xs text-red-500 mt-1">{errors.trackingNumber}</p>}
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Cargo Details
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Total Items <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.totalItems}
                onChange={(e) => handleChange('totalItems', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalItems ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.totalItems && <p className="text-xs text-red-500 mt-1">{errors.totalItems}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Total Pallets <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.totalPallets}
                onChange={(e) => handleChange('totalPallets', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalPallets ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.totalPallets && <p className="text-xs text-red-500 mt-1">{errors.totalPallets}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Total Weight (lbs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.totalWeight}
                onChange={(e) => handleChange('totalWeight', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalWeight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.totalWeight && <p className="text-xs text-red-500 mt-1">{errors.totalWeight}</p>}
            </div>
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Special Requirements
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresInspection}
                onChange={(e) => handleChange('requiresInspection', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Requires Quality Inspection</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.temperatureControlled}
                onChange={(e) => handleChange('temperatureControlled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Temperature Controlled</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hazmat}
                onChange={(e) => handleChange('hazmat', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Hazardous Materials (HAZMAT)</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Notes / Special Instructions
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add any special instructions or notes..."
          />
        </div>
      </form>
    </Modal>
  );
};
