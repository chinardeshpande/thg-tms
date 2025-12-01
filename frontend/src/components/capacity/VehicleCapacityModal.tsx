import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Truck, Box, Scale, Package, CheckCircle2, AlertTriangle } from 'lucide-react';

interface VehicleCapacityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleCapacityData) => void;
}

export interface VehicleCapacityData {
  vehicleType: string;
  maxWeight: number;
  maxVolume: number;
  maxLength: number;
  maxWidth: number;
  maxHeight: number;
  maxPallets: number;
  utilizationTarget: number;
  notes: string;
}

export const VehicleCapacityModal: React.FC<VehicleCapacityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<VehicleCapacityData>({
    vehicleType: '',
    maxWeight: 0,
    maxVolume: 0,
    maxLength: 0,
    maxWidth: 0,
    maxHeight: 0,
    maxPallets: 0,
    utilizationTarget: 85,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VehicleCapacityData, string>>>({});

  const vehicleTemplates = {
    '53ft Dry Van': { maxWeight: 45000, maxVolume: 3800, maxLength: 53, maxWidth: 8.5, maxHeight: 9, maxPallets: 26 },
    '48ft Refrigerated': { maxWeight: 45000, maxVolume: 3600, maxLength: 48, maxWidth: 8.5, maxHeight: 9, maxPallets: 24 },
    '53ft Flatbed': { maxWeight: 48000, maxVolume: 0, maxLength: 53, maxWidth: 8.5, maxHeight: 0, maxPallets: 26 },
    '26ft Box Truck': { maxWeight: 12000, maxVolume: 1800, maxLength: 26, maxWidth: 8, maxHeight: 8, maxPallets: 12 },
    'Sprinter Van': { maxWeight: 5000, maxVolume: 530, maxLength: 14, maxWidth: 6, maxHeight: 6, maxPallets: 6 },
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof VehicleCapacityData, string>> = {};

    if (!formData.vehicleType.trim()) newErrors.vehicleType = 'Vehicle type is required';
    if (formData.maxWeight <= 0) newErrors.maxWeight = 'Max weight must be greater than 0';
    if (formData.utilizationTarget < 0 || formData.utilizationTarget > 100) {
      newErrors.utilizationTarget = 'Target must be between 0 and 100';
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
      vehicleType: '',
      maxWeight: 0,
      maxVolume: 0,
      maxLength: 0,
      maxWidth: 0,
      maxHeight: 0,
      maxPallets: 0,
      utilizationTarget: 85,
      notes: '',
    });
    setErrors({});
  };

  const handleChange = (field: keyof VehicleCapacityData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTemplateSelect = (template: string) => {
    const specs = vehicleTemplates[template as keyof typeof vehicleTemplates];
    if (specs) {
      setFormData(prev => ({
        ...prev,
        vehicleType: template,
        ...specs,
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Vehicle Capacity"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Save Configuration
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Type Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select Vehicle Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(vehicleTemplates).map((template) => (
              <button
                key={template}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                  formData.vehicleType === template
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Truck className="w-4 h-4 inline-block mr-1" />
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.vehicleType}
            onChange={(e) => handleChange('vehicleType', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.vehicleType ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 53ft Dry Van"
          />
          {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>}
        </div>

        {/* Weight and Volume */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Scale className="w-4 h-4 inline-block mr-1" />
              Max Weight (lbs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.maxWeight}
              onChange={(e) => handleChange('maxWeight', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.maxWeight ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              step="100"
            />
            {errors.maxWeight && <p className="text-xs text-red-500 mt-1">{errors.maxWeight}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Box className="w-4 h-4 inline-block mr-1" />
              Max Volume (cu ft)
            </label>
            <input
              type="number"
              value={formData.maxVolume}
              onChange={(e) => handleChange('maxVolume', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="10"
            />
          </div>
        </div>

        {/* Dimensions */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Cargo Area Dimensions</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length (ft)
              </label>
              <input
                type="number"
                value={formData.maxLength}
                onChange={(e) => handleChange('maxLength', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (ft)
              </label>
              <input
                type="number"
                value={formData.maxWidth}
                onChange={(e) => handleChange('maxWidth', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (ft)
              </label>
              <input
                type="number"
                value={formData.maxHeight}
                onChange={(e) => handleChange('maxHeight', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Pallet Capacity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Package className="w-4 h-4 inline-block mr-1" />
              Max Pallets (40"x48")
            </label>
            <input
              type="number"
              value={formData.maxPallets}
              onChange={(e) => handleChange('maxPallets', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Utilization (%)
            </label>
            <input
              type="number"
              value={formData.utilizationTarget}
              onChange={(e) => handleChange('utilizationTarget', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.utilizationTarget ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              max="100"
              step="1"
            />
            {errors.utilizationTarget && <p className="text-xs text-red-500 mt-1">{errors.utilizationTarget}</p>}
          </div>
        </div>

        {/* Calculated Info */}
        {formData.maxLength > 0 && formData.maxWidth > 0 && formData.maxHeight > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Box className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Calculated Capacity</p>
                <p className="text-xs text-blue-700 mt-1">
                  Total Cubic Feet: {(formData.maxLength * formData.maxWidth * formData.maxHeight).toFixed(1)} cu ft
                  {formData.maxVolume > 0 && formData.maxVolume !== (formData.maxLength * formData.maxWidth * formData.maxHeight) && (
                    <span className="ml-2 text-orange-600">
                      (Note: Specified volume differs from calculated)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Any special notes about this vehicle type..."
          />
        </div>

        {/* Warning for Low Utilization Target */}
        {formData.utilizationTarget < 70 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Low Utilization Target</p>
                <p className="text-xs text-orange-700 mt-1">
                  Setting a target below 70% may result in inefficient vehicle usage and increased costs.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
