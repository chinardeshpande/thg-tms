import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Box, Plus, Minus, CheckCircle2, Package, Weight, Ruler } from 'lucide-react';

interface PackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PackOrderData) => void;
  order: {
    orderNumber: string;
    totalItems: number;
    pickedItems: number;
  };
}

export interface PackOrderData {
  numberOfBoxes: number;
  numberOfPallets: number;
  totalWeight: number;
  packingMaterial: string;
  packedBy: string;
  boxDimensions: string;
  fragile: boolean;
  notes: string;
}

export const PackOrderModal: React.FC<PackOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  order,
}) => {
  const [formData, setFormData] = useState<PackOrderData>({
    numberOfBoxes: 1,
    numberOfPallets: 0,
    totalWeight: 0,
    packingMaterial: '',
    packedBy: '',
    boxDimensions: '',
    fragile: false,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PackOrderData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PackOrderData, string>> = {};

    if (!formData.packedBy.trim()) newErrors.packedBy = 'Packer name is required';
    if (formData.numberOfBoxes <= 0 && formData.numberOfPallets <= 0) {
      newErrors.numberOfBoxes = 'Must have at least 1 box or pallet';
    }
    if (formData.totalWeight <= 0) newErrors.totalWeight = 'Total weight is required';
    if (!formData.packingMaterial.trim()) newErrors.packingMaterial = 'Packing material is required';

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
      numberOfBoxes: 1,
      numberOfPallets: 0,
      totalWeight: 0,
      packingMaterial: '',
      packedBy: '',
      boxDimensions: '',
      fragile: false,
      notes: '',
    });
    setErrors({});
  };

  const handleChange = (field: keyof PackOrderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const incrementBoxes = () => {
    setFormData({ ...formData, numberOfBoxes: formData.numberOfBoxes + 1 });
  };

  const decrementBoxes = () => {
    if (formData.numberOfBoxes > 0) {
      setFormData({ ...formData, numberOfBoxes: formData.numberOfBoxes - 1 });
    }
  };

  const incrementPallets = () => {
    setFormData({ ...formData, numberOfPallets: formData.numberOfPallets + 1 });
  };

  const decrementPallets = () => {
    if (formData.numberOfPallets > 0) {
      setFormData({ ...formData, numberOfPallets: formData.numberOfPallets - 1 });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pack Order - ${order.orderNumber}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Confirm Packing
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Info */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <p className="text-sm font-semibold text-purple-900">Order Items</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-purple-700">Total Items:</p>
              <p className="font-bold text-purple-900">{order.totalItems}</p>
            </div>
            <div>
              <p className="text-purple-700">Picked Items:</p>
              <p className="font-bold text-purple-900">{order.pickedItems}</p>
            </div>
          </div>
        </div>

        {/* Number of Boxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Boxes <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementBoxes}
              disabled={formData.numberOfBoxes <= 0}
              type="button"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              type="number"
              value={formData.numberOfBoxes}
              onChange={(e) => handleChange('numberOfBoxes', parseInt(e.target.value) || 0)}
              className={`flex-1 px-4 py-2 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.numberOfBoxes ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={incrementBoxes}
              type="button"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {errors.numberOfBoxes && <p className="text-xs text-red-500 mt-1">{errors.numberOfBoxes}</p>}
        </div>

        {/* Number of Pallets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Pallets
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementPallets}
              disabled={formData.numberOfPallets <= 0}
              type="button"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              type="number"
              value={formData.numberOfPallets}
              onChange={(e) => handleChange('numberOfPallets', parseInt(e.target.value) || 0)}
              className="flex-1 px-4 py-2 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={incrementPallets}
              type="button"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Total Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Weight (lbs) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.totalWeight}
                onChange={(e) => handleChange('totalWeight', parseFloat(e.target.value) || 0)}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalWeight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            {errors.totalWeight && <p className="text-xs text-red-500 mt-1">{errors.totalWeight}</p>}
          </div>

          {/* Box Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Box Dimensions (L x W x H)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.boxDimensions}
                onChange={(e) => handleChange('boxDimensions', e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="24 x 18 x 12 in"
              />
            </div>
          </div>
        </div>

        {/* Packing Material */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Packing Material <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.packingMaterial}
            onChange={(e) => handleChange('packingMaterial', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.packingMaterial ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Material</option>
            <option value="Bubble Wrap">Bubble Wrap</option>
            <option value="Foam Padding">Foam Padding</option>
            <option value="Air Pillows">Air Pillows</option>
            <option value="Packing Peanuts">Packing Peanuts</option>
            <option value="Corrugated Dividers">Corrugated Dividers</option>
            <option value="Shrink Wrap">Shrink Wrap</option>
            <option value="None">None</option>
          </select>
          {errors.packingMaterial && <p className="text-xs text-red-500 mt-1">{errors.packingMaterial}</p>}
        </div>

        {/* Packed By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Packed By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.packedBy}
            onChange={(e) => handleChange('packedBy', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.packedBy ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Packer name"
          />
          {errors.packedBy && <p className="text-xs text-red-500 mt-1">{errors.packedBy}</p>}
        </div>

        {/* Fragile Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="fragile"
            checked={formData.fragile}
            onChange={(e) => handleChange('fragile', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="fragile" className="text-sm font-medium text-gray-700">
            Mark as Fragile / Handle with Care
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Packing Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Special packing instructions, contents, etc."
          />
        </div>

        {/* Fragile Warning */}
        {formData.fragile && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Box className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Fragile Item</p>
                <p className="text-xs text-orange-700 mt-1">
                  This shipment will be marked as fragile. Ensure proper labeling and handling.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
