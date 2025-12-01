import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import { LatLngExpression, divIcon } from 'leaflet';
import { MapPin, Truck, Building, Navigation } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
}

interface RoutePoint {
  location: string;
  coordinates: Location;
  timestamp: string;
  status: string;
}

interface ShipmentRouteMapProps {
  origin: {
    address: string;
    city: string;
    state: string;
    coordinates: Location;
  };
  destination: {
    address: string;
    city: string;
    state: string;
    coordinates: Location;
  };
  currentLocation?: Location;
  routePoints: RoutePoint[];
  trackingNumber: string;
}

// Custom marker icon creator
const createCustomIcon = (IconComponent: any, color: string, size: number = 30) => {
  const iconHtml = renderToString(
    <div style={{
      backgroundColor: color,
      borderRadius: '50%',
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <IconComponent size={size * 0.5} color="white" />
    </div>
  );

  return divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to fit map bounds to show all markers
const FitBounds: React.FC<{ bounds: LatLngExpression[] }> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds.length > 0) {
      const latLngs = bounds.map(b => b as [number, number]);
      map.fitBounds(latLngs, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
};

export const ShipmentRouteMap: React.FC<ShipmentRouteMapProps> = ({
  origin,
  destination,
  currentLocation,
  routePoints,
  trackingNumber,
}) => {
  // Create path for the polyline (route)
  const routePath: LatLngExpression[] = routePoints.map(point => [
    point.coordinates.lat,
    point.coordinates.lng,
  ]);

  // All bounds for fitting the map
  const allBounds: LatLngExpression[] = [
    [origin.coordinates.lat, origin.coordinates.lng],
    [destination.coordinates.lat, destination.coordinates.lng],
    ...routePoints.map(p => [p.coordinates.lat, p.coordinates.lng] as LatLngExpression),
  ];

  // Calculate center point
  const center: LatLngExpression = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : [
        (origin.coordinates.lat + destination.coordinates.lat) / 2,
        (origin.coordinates.lng + destination.coordinates.lng) / 2,
      ];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={5}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds bounds={allBounds} />

        {/* Origin Marker */}
        <Marker
          position={[origin.coordinates.lat, origin.coordinates.lng]}
          icon={createCustomIcon(Building, '#10B981', 35)}
        >
          <Popup>
            <div className="p-2">
              <p className="font-bold text-sm mb-1">Origin</p>
              <p className="text-xs text-gray-700">{origin.address}</p>
              <p className="text-xs text-gray-600">{origin.city}, {origin.state}</p>
              <p className="text-xs text-gray-500 mt-1">
                {origin.coordinates.lat}°, {origin.coordinates.lng}°
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker
          position={[destination.coordinates.lat, destination.coordinates.lng]}
          icon={createCustomIcon(MapPin, '#EF4444', 35)}
        >
          <Popup>
            <div className="p-2">
              <p className="font-bold text-sm mb-1">Destination</p>
              <p className="text-xs text-gray-700">{destination.address}</p>
              <p className="text-xs text-gray-600">{destination.city}, {destination.state}</p>
              <p className="text-xs text-gray-500 mt-1">
                {destination.coordinates.lat}°, {destination.coordinates.lng}°
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Current Location Marker (animated) */}
        {currentLocation && (
          <>
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={createCustomIcon(Truck, '#3B82F6', 40)}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-bold text-sm mb-1 text-blue-600">Current Location</p>
                  <p className="text-xs text-gray-700">Tracking: {trackingNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentLocation.lat}°, {currentLocation.lng}°
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Live Tracking</span>
                  </div>
                </div>
              </Popup>
            </Marker>
            {/* Pulsing circle around current location */}
            <Circle
              center={[currentLocation.lat, currentLocation.lng]}
              radius={50000}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Route waypoints */}
        {routePoints.map((point, index) => (
          <Marker
            key={index}
            position={[point.coordinates.lat, point.coordinates.lng]}
            icon={createCustomIcon(Navigation, '#8B5CF6', 25)}
          >
            <Popup>
              <div className="p-2">
                <p className="font-bold text-sm mb-1">{point.status}</p>
                <p className="text-xs text-gray-700">{point.location}</p>
                <p className="text-xs text-gray-500 mt-1">{point.timestamp}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Path */}
        {routePath.length > 1 && (
          <>
            {/* Dashed line for remaining route */}
            <Polyline
              positions={[
                ...(currentLocation ? [[currentLocation.lat, currentLocation.lng] as LatLngExpression] : []),
                [destination.coordinates.lat, destination.coordinates.lng],
              ]}
              pathOptions={{
                color: '#9CA3AF',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10',
              }}
            />
            {/* Solid line for completed route */}
            <Polyline
              positions={routePath}
              pathOptions={{
                color: '#3B82F6',
                weight: 4,
                opacity: 0.8,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};
