import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Package, CheckCircle2, AlertCircle, User, Warehouse } from 'lucide-react';

interface PickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PickOrderData) => void;
  order: {
    orderNumber: string;
    totalItems: number;
    pickedItems: number;
  };
}

export interface PickOrderData {
  itemsPicked: number;
  pickedBy: string;
  pickLocation: string;
  binLocations: string;
  notes: string;
  condition: 'Good' | 'Damaged' | 'Short Pick';
}

export const PickOrderModal: React.FC<PickOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  order,
}) => {
  const remainingItems = order.totalItems - order.pickedItems;

  const [formData, setFormData] = useState<PickOrderData>({
    itemsPicked: remainingItems,
    pickedBy: '',
    pickLocation: '',
    binLocations: '',
    notes: '',
    condition: 'Good',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PickOrderData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PickOrderData, string>> = {};

    if (!formData.pickedBy.trim()) newErrors.pickedBy = 'Picker name is required';
    if (formData.itemsPicked <= 0) newErrors.itemsPicked = 'Items picked must be greater than 0';
    if (formData.itemsPicked > remainingItems) newErrors.itemsPicked = `Cannot exceed ${remainingItems} items`;
    if (!formData.pickLocation.trim()) newErrors.pickLocation = 'Pick location is required';

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
      itemsPicked: remainingItems,
      pickedBy: '',
      pickLocation: '',
      binLocations: '',
      notes: '',
      condition: 'Good',
    });
    setErrors({});
  };

  const handleChange = (field: keyof PickOrderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pick Order - ${order.orderNumber}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Confirm Pick
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Progress Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-semibold text-blue-900">Pick Progress</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-blue-700">Total Items:</p>
              <p className="font-bold text-blue-900">{order.totalItems}</p>
            </div>
            <div>
              <p className="text-blue-700">Already Picked:</p>
              <p className="font-bold text-blue-900">{order.pickedItems}</p>
            </div>
            <div>
              <p className="text-blue-700">Remaining:</p>
              <p className="font-bold text-blue-900">{remainingItems}</p>
            </div>
          </div>
        </div>

        {/* Items Picked */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Items to Pick <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.itemsPicked}
            onChange={(e) => handleChange('itemsPicked', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.itemsPicked ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
            max={remainingItems}
          />
          {errors.itemsPicked && <p className="text-xs text-red-500 mt-1">{errors.itemsPicked}</p>}
          <p className="text-xs text-gray-500 mt-1">Maximum: {remainingItems} items</p>
        </div>

        {/* Picked By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Picked By <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={formData.pickedBy}
              onChange={(e) => handleChange('pickedBy', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.pickedBy ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Picker name"
            />
          </div>
          {errors.pickedBy && <p className="text-xs text-red-500 mt-1">{errors.pickedBy}</p>}
        </div>

        {/* Pick Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={formData.pickLocation}
              onChange={(e) => handleChange('pickLocation', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.pickLocation ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Location</option>
              <option value="Zone A">Zone A - Main Warehouse</option>
              <option value="Zone B">Zone B - Fast Moving</option>
              <option value="Zone C">Zone C - Bulk Storage</option>
              <option value="Zone D">Zone D - Returns/QC</option>
            </select>
          </div>
          {errors.pickLocation && <p className="text-xs text-red-500 mt-1">{errors.pickLocation}</p>}
        </div>

        {/* Bin Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bin Locations
          </label>
          <input
            type="text"
            value={formData.binLocations}
            onChange={(e) => handleChange('binLocations', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., A-01-05, B-02-10"
          />
          <p className="text-xs text-gray-500 mt-1">Comma-separated bin locations</p>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'Good', label: 'Good', color: 'green' },
              { value: 'Damaged', label: 'Damaged', color: 'red' },
              { value: 'Short Pick', label: 'Short Pick', color: 'yellow' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('condition', option.value as any)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  formData.condition === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Any notes about the pick (damages, substitutions, etc.)"
          />
        </div>

        {/* Warning for Issues */}
        {formData.condition !== 'Good' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Issue Detected</p>
                <p className="text-xs text-yellow-700 mt-1">
                  This pick will be flagged for review. Please provide detailed notes.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
