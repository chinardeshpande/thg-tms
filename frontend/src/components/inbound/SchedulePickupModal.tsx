import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Calendar, Plus, MapPin, Building2, Truck, Clock } from 'lucide-react';

interface SchedulePickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PickupScheduleData) => void;
}

export interface PickupScheduleData {
  supplier: string;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  pickupDate: string;
  pickupTime: string;
  carrier: string;
  expectedItems: number;
  expectedPallets: number;
  expectedWeight: number;
  contactName: string;
  contactPhone: string;
  specialInstructions: string;
  priority: 'Standard' | 'Urgent' | 'Critical';
}

export const SchedulePickupModal: React.FC<SchedulePickupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PickupScheduleData>({
    supplier: '',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    pickupDate: '',
    pickupTime: '',
    carrier: '',
    expectedItems: 0,
    expectedPallets: 0,
    expectedWeight: 0,
    contactName: '',
    contactPhone: '',
    specialInstructions: '',
    priority: 'Standard',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PickupScheduleData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PickupScheduleData, string>> = {};

    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!formData.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required';
    if (!formData.pickupCity.trim()) newErrors.pickupCity = 'City is required';
    if (!formData.pickupState.trim()) newErrors.pickupState = 'State is required';
    if (!formData.pickupZip.trim()) newErrors.pickupZip = 'ZIP code is required';
    if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!formData.carrier.trim()) newErrors.carrier = 'Carrier is required';
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
      supplier: '',
      pickupAddress: '',
      pickupCity: '',
      pickupState: '',
      pickupZip: '',
      pickupDate: '',
      pickupTime: '',
      carrier: '',
      expectedItems: 0,
      expectedPallets: 0,
      expectedWeight: 0,
      contactName: '',
      contactPhone: '',
      specialInstructions: '',
      priority: 'Standard',
    });
    setErrors({});
  };

  const handleChange = (field: keyof PickupScheduleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Supplier Pickup"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <Plus className="w-4 h-4" />
            Schedule Pickup
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Supplier Information
          </h3>
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
        </div>

        {/* Pickup Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Pickup Address
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => handleChange('pickupAddress', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pickupAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 Supplier Street"
              />
              {errors.pickupAddress && <p className="text-xs text-red-500 mt-1">{errors.pickupAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupCity}
                onChange={(e) => handleChange('pickupCity', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pickupCity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="San Jose"
              />
              {errors.pickupCity && <p className="text-xs text-red-500 mt-1">{errors.pickupCity}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupState}
                onChange={(e) => handleChange('pickupState', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pickupState ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="CA"
                maxLength={2}
              />
              {errors.pickupState && <p className="text-xs text-red-500 mt-1">{errors.pickupState}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupZip}
                onChange={(e) => handleChange('pickupZip', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pickupZip ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="95110"
              />
              {errors.pickupZip && <p className="text-xs text-red-500 mt-1">{errors.pickupZip}</p>}
            </div>
          </div>
        </div>

        {/* Pickup Schedule */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Pickup Schedule
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pickup Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleChange('pickupDate', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pickupDate && <p className="text-xs text-red-500 mt-1">{errors.pickupDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pickup Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.pickupTime}
                onChange={(e) => handleChange('pickupTime', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pickupTime && <p className="text-xs text-red-500 mt-1">{errors.pickupTime}</p>}
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

        {/* Carrier Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Carrier Information
          </h3>
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
        </div>

        {/* Expected Cargo */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Expected Cargo (Optional)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Expected Items
              </label>
              <input
                type="number"
                value={formData.expectedItems}
                onChange={(e) => handleChange('expectedItems', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Expected Pallets
              </label>
              <input
                type="number"
                value={formData.expectedPallets}
                onChange={(e) => handleChange('expectedPallets', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Expected Weight (lbs)
              </label>
              <input
                type="number"
                value={formData.expectedWeight}
                onChange={(e) => handleChange('expectedWeight', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">On-Site Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.contactName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) => handleChange('specialInstructions', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Loading dock access, special equipment needed, etc..."
          />
        </div>
      </form>
    </Modal>
  );
};
