import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Package, Scale, Box, Truck, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface LoadPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LoadPlanData) => void;
  vehicleCapacity?: {
    maxWeight: number;
    maxVolume: number;
    maxLength: number;
    maxWidth: number;
    maxHeight: number;
  };
}

export interface LoadPlanData {
  vehicleId: string;
  loadType: 'Full' | 'Partial' | 'LTL';
  orders: string[];
  totalWeight: number;
  totalVolume: number;
  numberOfPallets: number;
  numberOfBoxes: number;
  loadSequence: string;
  specialInstructions: string;
  fragile: boolean;
  stackable: boolean;
  temperatureControlled: boolean;
  hazmat: boolean;
  loadedBy: string;
  notes: string;
}

export const LoadPlanModal: React.FC<LoadPlanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicleCapacity = {
    maxWeight: 45000,
    maxVolume: 3800,
    maxLength: 53,
    maxWidth: 8.5,
    maxHeight: 9,
  },
}) => {
  const [formData, setFormData] = useState<LoadPlanData>({
    vehicleId: '',
    loadType: 'Full',
    orders: [],
    totalWeight: 0,
    totalVolume: 0,
    numberOfPallets: 0,
    numberOfBoxes: 0,
    loadSequence: '',
    specialInstructions: '',
    fragile: false,
    stackable: true,
    temperatureControlled: false,
    hazmat: false,
    loadedBy: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoadPlanData, string>>>({});
  const [orderInput, setOrderInput] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoadPlanData, string>> = {};

    if (!formData.vehicleId.trim()) newErrors.vehicleId = 'Vehicle is required';
    if (formData.orders.length === 0) newErrors.orders = 'At least one order is required';
    if (formData.totalWeight <= 0) newErrors.totalWeight = 'Weight must be greater than 0';
    if (!formData.loadedBy.trim()) newErrors.loadedBy = 'Loader name is required';

    // Check capacity limits
    if (formData.totalWeight > vehicleCapacity.maxWeight) {
      newErrors.totalWeight = `Weight exceeds vehicle capacity (${vehicleCapacity.maxWeight} lbs)`;
    }
    if (formData.totalVolume > vehicleCapacity.maxVolume) {
      newErrors.totalVolume = `Volume exceeds vehicle capacity (${vehicleCapacity.maxVolume} cu ft)`;
    }

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
      vehicleId: '',
      loadType: 'Full',
      orders: [],
      totalWeight: 0,
      totalVolume: 0,
      numberOfPallets: 0,
      numberOfBoxes: 0,
      loadSequence: '',
      specialInstructions: '',
      fragile: false,
      stackable: true,
      temperatureControlled: false,
      hazmat: false,
      loadedBy: '',
      notes: '',
    });
    setOrderInput('');
    setErrors({});
  };

  const handleChange = (field: keyof LoadPlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddOrder = () => {
    if (orderInput.trim()) {
      const newOrders = [...formData.orders, orderInput.trim()];
      handleChange('orders', newOrders);
      setOrderInput('');
    }
  };

  const handleRemoveOrder = (index: number) => {
    const newOrders = formData.orders.filter((_, i) => i !== index);
    handleChange('orders', newOrders);
  };

  const weightUtilization = ((formData.totalWeight / vehicleCapacity.maxWeight) * 100).toFixed(1);
  const volumeUtilization = ((formData.totalVolume / vehicleCapacity.maxVolume) * 100).toFixed(1);

  const isOverCapacity = formData.totalWeight > vehicleCapacity.maxWeight || formData.totalVolume > vehicleCapacity.maxVolume;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Load Plan"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2" disabled={isOverCapacity}>
            <CheckCircle2 className="w-4 h-4" />
            Create Load Plan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Load Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Load Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {(['Full', 'Partial', 'LTL'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('loadType', type)}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                  formData.loadType === type
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {type === 'LTL' ? 'Less Than Load' : `${type} Load`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={formData.vehicleId}
                onChange={(e) => handleChange('vehicleId', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.vehicleId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Vehicle</option>
                <option value="TRUCK-001">TRUCK-001 - 53ft Dry Van</option>
                <option value="TRUCK-002">TRUCK-002 - 48ft Refrigerated</option>
                <option value="TRUCK-003">TRUCK-003 - 53ft Flatbed</option>
                <option value="TRUCK-004">TRUCK-004 - 26ft Box Truck</option>
              </select>
            </div>
            {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
          </div>

          {/* Loaded By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loaded By <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.loadedBy}
              onChange={(e) => handleChange('loadedBy', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.loadedBy ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Loader name"
            />
            {errors.loadedBy && <p className="text-xs text-red-500 mt-1">{errors.loadedBy}</p>}
          </div>
        </div>

        {/* Orders */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orders to Load <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOrder())}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter order number and press Enter"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddOrder}>
              Add
            </Button>
          </div>
          {formData.orders.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {formData.orders.map((order, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                >
                  {order}
                  <button
                    type="button"
                    onClick={() => handleRemoveOrder(index)}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.orders && <p className="text-xs text-red-500 mt-1">{errors.orders}</p>}
        </div>

        {/* Load Metrics */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Load Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Weight (lbs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.totalWeight}
                onChange={(e) => handleChange('totalWeight', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalWeight ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.1"
              />
              {errors.totalWeight && <p className="text-xs text-red-500 mt-1">{errors.totalWeight}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Capacity: {vehicleCapacity.maxWeight} lbs ({weightUtilization}% utilized)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Volume (cu ft)
              </label>
              <input
                type="number"
                value={formData.totalVolume}
                onChange={(e) => handleChange('totalVolume', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalVolume ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.1"
              />
              {errors.totalVolume && <p className="text-xs text-red-500 mt-1">{errors.totalVolume}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Capacity: {vehicleCapacity.maxVolume} cu ft ({volumeUtilization}% utilized)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Pallets
              </label>
              <input
                type="number"
                value={formData.numberOfPallets}
                onChange={(e) => handleChange('numberOfPallets', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Boxes
              </label>
              <input
                type="number"
                value={formData.numberOfBoxes}
                onChange={(e) => handleChange('numberOfBoxes', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Capacity Warnings */}
        {isOverCapacity && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Over Capacity!</p>
                <p className="text-xs text-red-700 mt-1">
                  {formData.totalWeight > vehicleCapacity.maxWeight && 'Weight exceeds vehicle capacity. '}
                  {formData.totalVolume > vehicleCapacity.maxVolume && 'Volume exceeds vehicle capacity.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Load Sequence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Load Sequence
          </label>
          <textarea
            value={formData.loadSequence}
            onChange={(e) => handleChange('loadSequence', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="e.g., Pallets in rear, boxes in front, fragile items on top..."
          />
        </div>

        {/* Special Requirements */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Special Requirements</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fragile}
                onChange={(e) => handleChange('fragile', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Fragile Items</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.stackable}
                onChange={(e) => handleChange('stackable', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Stackable</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.temperatureControlled}
                onChange={(e) => handleChange('temperatureControlled', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Temperature Controlled</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hazmat}
                onChange={(e) => handleChange('hazmat', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Hazmat</span>
            </label>
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) => handleChange('specialInstructions', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Any special loading instructions..."
          />
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
            rows={2}
            placeholder="Any other notes..."
          />
        </div>

        {/* Warnings for Special Requirements */}
        {(formData.hazmat || formData.temperatureControlled) && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Special Handling Required</p>
                <p className="text-xs text-orange-700 mt-1">
                  {formData.hazmat && 'Hazmat certification required. '}
                  {formData.temperatureControlled && 'Temperature monitoring required.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
