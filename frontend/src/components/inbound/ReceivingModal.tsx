import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PackageCheck, Plus, Minus, CheckCircle2, AlertCircle, Package } from 'lucide-react';

interface ReceivingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReceivingData) => void;
  shipment: {
    asnNumber: string;
    totalItems: number;
    receivedItems: number;
    totalPallets: number;
  };
}

export interface ReceivingData {
  itemsReceived: number;
  palletsReceived: number;
  condition: 'Good' | 'Damaged' | 'Partial';
  notes: string;
  discrepancies: string;
  receivedBy: string;
}

export const ReceivingModal: React.FC<ReceivingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  shipment,
}) => {
  const remainingItems = shipment.totalItems - shipment.receivedItems;

  const [formData, setFormData] = useState<ReceivingData>({
    itemsReceived: remainingItems,
    palletsReceived: shipment.totalPallets,
    condition: 'Good',
    notes: '',
    discrepancies: '',
    receivedBy: '',
  });

  const handleSubmit = () => {
    if (!formData.receivedBy.trim()) {
      alert('Please enter receiver name');
      return;
    }
    if (formData.itemsReceived <= 0) {
      alert('Items received must be greater than 0');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const incrementItems = () => {
    if (formData.itemsReceived < remainingItems) {
      setFormData({ ...formData, itemsReceived: formData.itemsReceived + 1 });
    }
  };

  const decrementItems = () => {
    if (formData.itemsReceived > 0) {
      setFormData({ ...formData, itemsReceived: formData.itemsReceived - 1 });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Receive Items - ${shipment.asnNumber}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Confirm Receiving
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Progress Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-semibold text-blue-900">Receiving Progress</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-blue-700">Total Items:</p>
              <p className="font-bold text-blue-900">{shipment.totalItems}</p>
            </div>
            <div>
              <p className="text-blue-700">Already Received:</p>
              <p className="font-bold text-blue-900">{shipment.receivedItems}</p>
            </div>
            <div>
              <p className="text-blue-700">Remaining:</p>
              <p className="font-bold text-blue-900">{remainingItems}</p>
            </div>
          </div>
        </div>

        {/* Items Received */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items to Receive <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementItems}
              disabled={formData.itemsReceived <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              type="number"
              value={formData.itemsReceived}
              onChange={(e) => setFormData({ ...formData, itemsReceived: parseInt(e.target.value) || 0 })}
              className="flex-1 px-4 py-2 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max={remainingItems}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={incrementItems}
              disabled={formData.itemsReceived >= remainingItems}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Maximum: {remainingItems} items</p>
        </div>

        {/* Pallets Received */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Pallets <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.palletsReceived}
            onChange={(e) => setFormData({ ...formData, palletsReceived: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'Good', label: 'Good Condition', color: 'green' },
              { value: 'Damaged', label: 'Damaged', color: 'red' },
              { value: 'Partial', label: 'Partial/Mixed', color: 'yellow' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, condition: option.value as any })}
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

        {/* Discrepancies */}
        {formData.condition !== 'Good' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe Discrepancies <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.discrepancies}
              onChange={(e) => setFormData({ ...formData, discrepancies: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe any damages, shortages, or issues..."
            />
          </div>
        )}

        {/* Received By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Received By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.receivedBy}
            onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Any additional comments or observations..."
          />
        </div>

        {/* Warning for Discrepancies */}
        {formData.condition !== 'Good' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Discrepancy Detected</p>
                <p className="text-xs text-yellow-700 mt-1">
                  This receiving record will be flagged for review. Please ensure all discrepancies are documented.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
