import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import './styles/compact.css';

// Lazy load pages for better performance
const Landing = React.lazy(() => import('@pages/Landing'));
const Login = React.lazy(() => import('@pages/Login'));
const Register = React.lazy(() => import('@pages/Register'));
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Inbound = React.lazy(() => import('@pages/Inbound'));
const Shipments = React.lazy(() => import('@pages/Shipments'));
const Tracking = React.lazy(() => import('@pages/Tracking'));
const ShipmentDetail = React.lazy(() => import('@pages/ShipmentDetail'));
const Returns = React.lazy(() => import('@pages/Returns'));
const Fleet = React.lazy(() => import('@pages/Fleet'));
const VehicleDetail = React.lazy(() => import('@pages/VehicleDetail'));
const Yard = React.lazy(() => import('@pages/Yard'));
const Carriers = React.lazy(() => import('@pages/Carriers'));
const CarrierDetail = React.lazy(() => import('@pages/CarrierDetail'));
const RoutesPage = React.lazy(() => import('@pages/Routes'));
const Analytics = React.lazy(() => import('@pages/Analytics'));
const Tendering = React.lazy(() => import('@pages/Tendering'));
const LiveTracking = React.lazy(() => import('@pages/LiveTracking'));
const InboundDetail = React.lazy(() => import('@pages/InboundDetail'));
const Outbound = React.lazy(() => import('@pages/Outbound'));
const OutboundDetail = React.lazy(() => import('@pages/OutboundDetail'));
const DockScheduling = React.lazy(() => import('@pages/DockScheduling'));
const GatePass = React.lazy(() => import('@pages/GatePass'));
const Loading = React.lazy(() => import('@pages/Loading'));
const VehicleCapacity = React.lazy(() => import('@pages/VehicleCapacity'));

// Loading component
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inbound" element={<Inbound />} />
            <Route path="/inbound/:id" element={<InboundDetail />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/tracking/:id" element={<ShipmentDetail />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/fleet/:id" element={<VehicleDetail />} />
            <Route path="/yard" element={<Yard />} />
            <Route path="/carriers" element={<Carriers />} />
            <Route path="/carriers/:id" element={<CarrierDetail />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/tendering" element={<Tendering />} />
            <Route path="/live-tracking" element={<LiveTracking />} />
            <Route path="/outbound" element={<Outbound />} />
            <Route path="/outbound/:id" element={<OutboundDetail />} />
            <Route path="/dock-scheduling" element={<DockScheduling />} />
            <Route path="/gate-pass" element={<GatePass />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/vehicle-capacity" element={<VehicleCapacity />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
