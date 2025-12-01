import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { User, Truck, FileText, Clock, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';

interface CreateGatePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GatePassData) => void;
}

export interface GatePassData {
  passType: 'inbound' | 'outbound' | 'visitor';
  driverName: string;
  driverLicense: string;
  driverPhone: string;
  vehicleType: string;
  vehiclePlate: string;
  trailerNumber: string;
  companyName: string;
  purpose: string;
  referenceNumber: string;
  expectedDuration: number;
  securityNotes: string;
  requiresInspection: boolean;
  requiresEscort: boolean;
  accessAreas: string[];
}

export const CreateGatePassModal: React.FC<CreateGatePassModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<GatePassData>({
    passType: 'inbound',
    driverName: '',
    driverLicense: '',
    driverPhone: '',
    vehicleType: '',
    vehiclePlate: '',
    trailerNumber: '',
    companyName: '',
    purpose: '',
    referenceNumber: '',
    expectedDuration: 60,
    securityNotes: '',
    requiresInspection: false,
    requiresEscort: false,
    accessAreas: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GatePassData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GatePassData, string>> = {};

    if (!formData.driverName.trim()) newErrors.driverName = 'Driver name is required';
    if (!formData.driverLicense.trim()) newErrors.driverLicense = 'Driver license is required';
    if (!formData.driverPhone.trim()) newErrors.driverPhone = 'Driver phone is required';
    if (!formData.vehicleType.trim()) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.vehiclePlate.trim()) newErrors.vehiclePlate = 'Vehicle plate is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';

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
      passType: 'inbound',
      driverName: '',
      driverLicense: '',
      driverPhone: '',
      vehicleType: '',
      vehiclePlate: '',
      trailerNumber: '',
      companyName: '',
      purpose: '',
      referenceNumber: '',
      expectedDuration: 60,
      securityNotes: '',
      requiresInspection: false,
      requiresEscort: false,
      accessAreas: [],
    });
    setErrors({});
  };

  const handleChange = (field: keyof GatePassData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleAccessArea = (area: string) => {
    const newAreas = formData.accessAreas.includes(area)
      ? formData.accessAreas.filter(a => a !== area)
      : [...formData.accessAreas, area];
    handleChange('accessAreas', newAreas);
  };

  const accessAreaOptions = [
    'Receiving Dock',
    'Shipping Dock',
    'Warehouse Floor',
    'Office Area',
    'Parking Lot',
    'Loading Zone',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Gate Pass"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Generate Gate Pass
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pass Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pass Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {(['inbound', 'outbound', 'visitor'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('passType', type)}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                  formData.passType === type
                    ? type === 'inbound'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : type === 'outbound'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Driver Information */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Driver Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.driverName}
                onChange={(e) => handleChange('driverName', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.driverName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.driverName && <p className="text-xs text-red-500 mt-1">{errors.driverName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver License <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.driverLicense}
                onChange={(e) => handleChange('driverLicense', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.driverLicense ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="DL123456789"
              />
              {errors.driverLicense && <p className="text-xs text-red-500 mt-1">{errors.driverLicense}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.driverPhone}
                onChange={(e) => handleChange('driverPhone', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.driverPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.driverPhone && <p className="text-xs text-red-500 mt-1">{errors.driverPhone}</p>}
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Vehicle Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => handleChange('vehicleType', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Type</option>
                <option value="53ft Trailer">53ft Trailer</option>
                <option value="48ft Trailer">48ft Trailer</option>
                <option value="Box Truck">Box Truck</option>
                <option value="Van">Van</option>
                <option value="Pickup Truck">Pickup Truck</option>
                <option value="Car">Car</option>
                <option value="Other">Other</option>
              </select>
              {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Plate <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vehiclePlate}
                onChange={(e) => handleChange('vehiclePlate', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.vehiclePlate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC-1234"
              />
              {errors.vehiclePlate && <p className="text-xs text-red-500 mt-1">{errors.vehiclePlate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trailer Number
              </label>
              <input
                type="text"
                value={formData.trailerNumber}
                onChange={(e) => handleChange('trailerNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="TRL-12345"
              />
            </div>
          </div>
        </div>

        {/* Visit Details */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Visit Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC Logistics"
              />
              {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.purpose ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Purpose</option>
                <option value="Delivery">Delivery</option>
                <option value="Pickup">Pickup</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inspection">Inspection</option>
                <option value="Meeting">Meeting</option>
                <option value="Service">Service Call</option>
                <option value="Other">Other</option>
              </select>
              {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={formData.referenceNumber}
                onChange={(e) => handleChange('referenceNumber', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="PO/ASN/SO Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Duration (minutes)
              </label>
              <select
                value={formData.expectedDuration}
                onChange={(e) => handleChange('expectedDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Areas */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Authorized Access Areas
          </label>
          <div className="grid grid-cols-3 gap-2">
            {accessAreaOptions.map((area) => (
              <label
                key={area}
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.accessAreas.includes(area)}
                  onChange={() => toggleAccessArea(area)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security Options */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Security Requirements</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresInspection}
                onChange={(e) => handleChange('requiresInspection', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Requires Vehicle Inspection</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresEscort}
                onChange={(e) => handleChange('requiresEscort', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Requires Security Escort</span>
            </label>
          </div>
        </div>

        {/* Security Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Security Notes
          </label>
          <textarea
            value={formData.securityNotes}
            onChange={(e) => handleChange('securityNotes', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Any special instructions or notes for security personnel..."
          />
        </div>

        {/* Warning for Special Requirements */}
        {(formData.requiresInspection || formData.requiresEscort) && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Special Security Requirements</p>
                <p className="text-xs text-orange-700 mt-1">
                  {formData.requiresInspection && 'Vehicle inspection required. '}
                  {formData.requiresEscort && 'Security escort required.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
