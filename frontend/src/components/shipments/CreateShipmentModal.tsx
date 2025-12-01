import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Plus, Package, MapPin, User, Building2, Calendar, AlertCircle } from 'lucide-react';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShipmentFormData) => void;
}

export interface ShipmentFormData {
  trackingNumber: string;
  customerName: string;
  customerCompany: string;
  customerPhone: string;
  customerEmail: string;
  originAddress: string;
  originCity: string;
  originState: string;
  originZip: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
  carrier: string;
  packageContents: string;
  packageType: string;
  weight: number;
  dimensions: string;
  value: number;
  priority: 'Standard' | 'Express' | 'Overnight';
  requiresInsurance: boolean;
  insuranceAmount: number;
  estimatedDelivery: string;
  specialInstructions: string;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ShipmentFormData>({
    trackingNumber: `TRK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    customerName: '',
    customerCompany: '',
    customerPhone: '',
    customerEmail: '',
    originAddress: '',
    originCity: '',
    originState: '',
    originZip: '',
    destinationAddress: '',
    destinationCity: '',
    destinationState: '',
    destinationZip: '',
    carrier: '',
    packageContents: '',
    packageType: '',
    weight: 0,
    dimensions: '',
    value: 0,
    priority: 'Standard',
    requiresInsurance: false,
    insuranceAmount: 0,
    estimatedDelivery: '',
    specialInstructions: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShipmentFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShipmentFormData, string>> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
    if (!formData.originAddress.trim()) newErrors.originAddress = 'Origin address is required';
    if (!formData.originCity.trim()) newErrors.originCity = 'Origin city is required';
    if (!formData.originState.trim()) newErrors.originState = 'Origin state is required';
    if (!formData.originZip.trim()) newErrors.originZip = 'Origin ZIP is required';
    if (!formData.destinationAddress.trim()) newErrors.destinationAddress = 'Destination address is required';
    if (!formData.destinationCity.trim()) newErrors.destinationCity = 'Destination city is required';
    if (!formData.destinationState.trim()) newErrors.destinationState = 'Destination state is required';
    if (!formData.destinationZip.trim()) newErrors.destinationZip = 'Destination ZIP is required';
    if (!formData.carrier.trim()) newErrors.carrier = 'Carrier is required';
    if (!formData.packageContents.trim()) newErrors.packageContents = 'Package contents is required';
    if (formData.weight <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (formData.value <= 0) newErrors.value = 'Package value must be greater than 0';
    if (!formData.estimatedDelivery) newErrors.estimatedDelivery = 'Estimated delivery is required';

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
      trackingNumber: `TRK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      customerName: '',
      customerCompany: '',
      customerPhone: '',
      customerEmail: '',
      originAddress: '',
      originCity: '',
      originState: '',
      originZip: '',
      destinationAddress: '',
      destinationCity: '',
      destinationState: '',
      destinationZip: '',
      carrier: '',
      packageContents: '',
      packageType: '',
      weight: 0,
      dimensions: '',
      value: 0,
      priority: 'Standard',
      requiresInsurance: false,
      insuranceAmount: 0,
      estimatedDelivery: '',
      specialInstructions: '',
    });
    setErrors({});
  };

  const handleChange = (field: keyof ShipmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shipment"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Shipment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tracking Number */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Shipment Information
          </h3>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tracking Number (Auto-generated)
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.customerCompany}
                onChange={(e) => handleChange('customerCompany', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.customerPhone && <p className="text-xs text-red-500 mt-1">{errors.customerPhone}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@acmecorp.com"
              />
              {errors.customerEmail && <p className="text-xs text-red-500 mt-1">{errors.customerEmail}</p>}
            </div>
          </div>
        </div>

        {/* Origin Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Origin Address
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.originAddress}
                onChange={(e) => handleChange('originAddress', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.originAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 Warehouse Blvd"
              />
              {errors.originAddress && <p className="text-xs text-red-500 mt-1">{errors.originAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.originCity}
                onChange={(e) => handleChange('originCity', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.originCity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Los Angeles"
              />
              {errors.originCity && <p className="text-xs text-red-500 mt-1">{errors.originCity}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.originState}
                onChange={(e) => handleChange('originState', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.originState ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="CA"
              />
              {errors.originState && <p className="text-xs text-red-500 mt-1">{errors.originState}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.originZip}
                onChange={(e) => handleChange('originZip', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.originZip ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="90001"
              />
              {errors.originZip && <p className="text-xs text-red-500 mt-1">{errors.originZip}</p>}
            </div>
          </div>
        </div>

        {/* Destination Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Destination Address
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destinationAddress}
                onChange={(e) => handleChange('destinationAddress', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.destinationAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="567 Business Plaza"
              />
              {errors.destinationAddress && <p className="text-xs text-red-500 mt-1">{errors.destinationAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destinationCity}
                onChange={(e) => handleChange('destinationCity', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.destinationCity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="New York"
              />
              {errors.destinationCity && <p className="text-xs text-red-500 mt-1">{errors.destinationCity}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destinationState}
                onChange={(e) => handleChange('destinationState', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.destinationState ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="NY"
              />
              {errors.destinationState && <p className="text-xs text-red-500 mt-1">{errors.destinationState}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destinationZip}
                onChange={(e) => handleChange('destinationZip', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.destinationZip ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10001"
              />
              {errors.destinationZip && <p className="text-xs text-red-500 mt-1">{errors.destinationZip}</p>}
            </div>
          </div>
        </div>

        {/* Carrier and Shipping Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Shipping Details
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
                <option value="FedEx Express">FedEx Express</option>
                <option value="UPS Ground">UPS Ground</option>
                <option value="DHL International">DHL International</option>
                <option value="USPS Priority">USPS Priority</option>
                <option value="Old Dominion">Old Dominion</option>
              </select>
              {errors.carrier && <p className="text-xs text-red-500 mt-1">{errors.carrier}</p>}
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
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estimated Delivery <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.estimatedDelivery}
                onChange={(e) => handleChange('estimatedDelivery', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.estimatedDelivery ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.estimatedDelivery && <p className="text-xs text-red-500 mt-1">{errors.estimatedDelivery}</p>}
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Package Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Package Contents <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.packageContents}
                onChange={(e) => handleChange('packageContents', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.packageContents ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Electronic Components"
              />
              {errors.packageContents && <p className="text-xs text-red-500 mt-1">{errors.packageContents}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                value={formData.packageType}
                onChange={(e) => handleChange('packageType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="Box">Box</option>
                <option value="Envelope">Envelope</option>
                <option value="Pallet">Pallet</option>
                <option value="Crate">Wooden Crate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Weight (lbs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dimensions (L x W x H)
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => handleChange('dimensions', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder='48" x 40" x 36"'
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Package Value ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Insurance (Optional)
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresInsurance}
                onChange={(e) => handleChange('requiresInsurance', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Add Insurance Coverage</span>
            </label>

            {formData.requiresInsurance && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Insurance Amount ($)
                </label>
                <input
                  type="number"
                  value={formData.insuranceAmount}
                  onChange={(e) => handleChange('insuranceAmount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="100"
                />
              </div>
            )}
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
            placeholder="Add any special handling instructions..."
          />
        </div>
      </form>
    </Modal>
  );
};
