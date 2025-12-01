import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Truck, CheckCircle2, Printer, Calendar, DollarSign } from 'lucide-react';

interface ShipOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShipOrderData) => void;
  order: {
    orderNumber: string;
    customer: string;
    destination: string;
  };
}

export interface ShipOrderData {
  carrier: string;
  serviceLevel: string;
  trackingNumber: string;
  shippingCost: number;
  estimatedDelivery: string;
  shipmentWeight: number;
  numberOfPackages: number;
  insuranceAmount: number;
  requiresSignature: boolean;
  shippedBy: string;
  notes: string;
}

export const ShipOrderModal: React.FC<ShipOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  order,
}) => {
  const [formData, setFormData] = useState<ShipOrderData>({
    carrier: '',
    serviceLevel: '',
    trackingNumber: '',
    shippingCost: 0,
    estimatedDelivery: '',
    shipmentWeight: 0,
    numberOfPackages: 1,
    insuranceAmount: 0,
    requiresSignature: false,
    shippedBy: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShipOrderData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShipOrderData, string>> = {};

    if (!formData.carrier.trim()) newErrors.carrier = 'Carrier is required';
    if (!formData.serviceLevel.trim()) newErrors.serviceLevel = 'Service level is required';
    if (!formData.trackingNumber.trim()) newErrors.trackingNumber = 'Tracking number is required';
    if (!formData.shippedBy.trim()) newErrors.shippedBy = 'Shipper name is required';
    if (formData.shipmentWeight <= 0) newErrors.shipmentWeight = 'Weight is required';
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
      carrier: '',
      serviceLevel: '',
      trackingNumber: '',
      shippingCost: 0,
      estimatedDelivery: '',
      shipmentWeight: 0,
      numberOfPackages: 1,
      insuranceAmount: 0,
      requiresSignature: false,
      shippedBy: '',
      notes: '',
    });
    setErrors({});
  };

  const handleChange = (field: keyof ShipOrderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGenerateLabel = () => {
    alert('Shipping label generated! Click Print Label to print.');
  };

  const serviceLevels: Record<string, string[]> = {
    'FedEx': ['Ground', 'Express Saver', '2Day', 'Standard Overnight', 'Priority Overnight'],
    'UPS': ['Ground', '3 Day Select', '2nd Day Air', 'Next Day Air Saver', 'Next Day Air'],
    'USPS': ['First Class', 'Priority Mail', 'Priority Mail Express', 'Parcel Select'],
    'DHL': ['Ground', 'Express', 'Express Worldwide'],
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ship Order - ${order.orderNumber}`}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleGenerateLabel} className="gap-2">
            <Printer className="w-4 h-4" />
            Print Label
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Confirm Shipment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Info */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-green-600" />
            <p className="text-sm font-semibold text-green-900">Shipment Details</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-green-700">Customer:</p>
              <p className="font-bold text-green-900">{order.customer}</p>
            </div>
            <div>
              <p className="text-green-700">Destination:</p>
              <p className="font-bold text-green-900">{order.destination}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Carrier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.carrier}
              onChange={(e) => {
                handleChange('carrier', e.target.value);
                handleChange('serviceLevel', ''); // Reset service level when carrier changes
              }}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.carrier ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Carrier</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="USPS">USPS</option>
              <option value="DHL">DHL</option>
            </select>
            {errors.carrier && <p className="text-xs text-red-500 mt-1">{errors.carrier}</p>}
          </div>

          {/* Service Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceLevel}
              onChange={(e) => handleChange('serviceLevel', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.serviceLevel ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!formData.carrier}
            >
              <option value="">Select Service</option>
              {formData.carrier && serviceLevels[formData.carrier]?.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            {errors.serviceLevel && <p className="text-xs text-red-500 mt-1">{errors.serviceLevel}</p>}
          </div>
        </div>

        {/* Tracking Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.trackingNumber}
            onChange={(e) => handleChange('trackingNumber', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.trackingNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter or generate tracking number"
          />
          {errors.trackingNumber && <p className="text-xs text-red-500 mt-1">{errors.trackingNumber}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Shipment Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.shipmentWeight}
              onChange={(e) => handleChange('shipmentWeight', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.shipmentWeight ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.shipmentWeight && <p className="text-xs text-red-500 mt-1">{errors.shipmentWeight}</p>}
          </div>

          {/* Number of Packages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Packages
            </label>
            <input
              type="number"
              value={formData.numberOfPackages}
              onChange={(e) => handleChange('numberOfPackages', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          {/* Shipping Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.shippingCost}
                onChange={(e) => handleChange('shippingCost', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Estimated Delivery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Delivery <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={formData.estimatedDelivery}
                onChange={(e) => handleChange('estimatedDelivery', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.estimatedDelivery ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.estimatedDelivery && <p className="text-xs text-red-500 mt-1">{errors.estimatedDelivery}</p>}
          </div>

          {/* Insurance Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Value
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.insuranceAmount}
                onChange={(e) => handleChange('insuranceAmount', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Shipped By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipped By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.shippedBy}
            onChange={(e) => handleChange('shippedBy', e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.shippedBy ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Shipper name"
          />
          {errors.shippedBy && <p className="text-xs text-red-500 mt-1">{errors.shippedBy}</p>}
        </div>

        {/* Signature Required */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="signature"
            checked={formData.requiresSignature}
            onChange={(e) => handleChange('requiresSignature', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="signature" className="text-sm font-medium text-gray-700">
            Signature Required on Delivery
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Special instructions for carrier..."
          />
        </div>
      </form>
    </Modal>
  );
};
