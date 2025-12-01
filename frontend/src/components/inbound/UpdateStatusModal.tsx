import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle2, Truck, Warehouse, AlertCircle } from 'lucide-react';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  asnNumber: string;
  onSubmit: (data: StatusUpdateData) => void;
}

export interface StatusUpdateData {
  status: 'Scheduled' | 'In Transit' | 'At Dock' | 'Receiving' | 'Completed' | 'Delayed' | 'Exception';
  dockNumber?: string;
  receivingBay?: string;
  actualArrivalTime?: string;
  notes: string;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  asnNumber,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<StatusUpdateData>({
    status: currentStatus as any,
    dockNumber: '',
    receivingBay: '',
    actualArrivalTime: '',
    notes: '',
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const statusOptions = [
    { value: 'Scheduled', label: 'Scheduled', color: 'blue' },
    { value: 'In Transit', label: 'In Transit', color: 'purple' },
    { value: 'At Dock', label: 'At Dock', color: 'yellow' },
    { value: 'Receiving', label: 'Receiving', color: 'orange' },
    { value: 'Completed', label: 'Completed', color: 'green' },
    { value: 'Delayed', label: 'Delayed', color: 'red' },
    { value: 'Exception', label: 'Exception', color: 'red' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status - ${asnNumber}`}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Update Status
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Status <span className="text-red-500">*</span>
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

        {/* Conditional Fields */}
        {(formData.status === 'At Dock' || formData.status === 'Receiving') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dock Number
              </label>
              <input
                type="text"
                value={formData.dockNumber}
                onChange={(e) => setFormData({ ...formData, dockNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="DOCK-A1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receiving Bay
              </label>
              <input
                type="text"
                value={formData.receivingBay}
                onChange={(e) => setFormData({ ...formData, receivingBay: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="BAY-03"
              />
            </div>
          </div>
        )}

        {formData.status !== 'Scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Arrival Time
            </label>
            <input
              type="datetime-local"
              value={formData.actualArrivalTime}
              onChange={(e) => setFormData({ ...formData, actualArrivalTime: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            placeholder="Add any notes about this status update..."
          />
        </div>

        {/* Current Status Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-medium text-blue-900 mb-1">Current Status</p>
          <p className="text-sm text-blue-700">{currentStatus}</p>
        </div>
      </div>
    </Modal>
  );
};
