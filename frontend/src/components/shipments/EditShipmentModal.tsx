import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Edit, Package, MapPin, User, AlertCircle } from 'lucide-react';

interface EditShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditShipmentData) => void;
  shipment: {
    id: string;
    trackingNumber: string;
    customer: string;
    origin: string;
    destination: string;
    status: string;
    carrier: string;
    weight: number;
    estimatedDelivery: string;
  };
}

export interface EditShipmentData {
  status: 'pending' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'delayed' | 'exception';
  carrier: string;
  weight: number;
  estimatedDelivery: string;
  currentLocation?: string;
  notes: string;
}

export const EditShipmentModal: React.FC<EditShipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  shipment,
}) => {
  const [formData, setFormData] = useState<EditShipmentData>({
    status: shipment.status as any,
    carrier: shipment.carrier,
    weight: shipment.weight,
    estimatedDelivery: shipment.estimatedDelivery,
    currentLocation: '',
    notes: '',
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in-transit', label: 'In Transit', color: 'blue' },
    { value: 'out-for-delivery', label: 'Out for Delivery', color: 'purple' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'delayed', label: 'Delayed', color: 'orange' },
    { value: 'exception', label: 'Exception', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Shipment - ${shipment.trackingNumber}`}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <Edit className="w-4 h-4" />
            Update Shipment
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipment Status <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, status: option.value as any })}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  formData.status === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carrier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrier <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.carrier}
            onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="FedEx">FedEx</option>
            <option value="UPS">UPS</option>
            <option value="DHL">DHL</option>
            <option value="USPS">USPS</option>
            <option value="Old Dominion">Old Dominion</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>

        {/* Estimated Delivery */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Delivery <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.estimatedDelivery}
            onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Current Location (for in-transit) */}
        {(formData.status === 'in-transit' || formData.status === 'out-for-delivery') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Location
            </label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kansas City, MO"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Comments
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add any notes about this update..."
          />
        </div>

        {/* Current Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-medium text-blue-900 mb-2">Current Shipment Info</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-blue-700">Customer:</span> {shipment.customer}
            </div>
            <div>
              <span className="text-blue-700">Status:</span> {shipment.status}
            </div>
            <div className="col-span-2">
              <span className="text-blue-700">Route:</span> {shipment.origin} → {shipment.destination}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
