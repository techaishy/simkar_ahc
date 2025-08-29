'use client';

import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { useState, useRef } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = { lat: -6.2, lng: 106.816666 };

export default function GoogleMapComponent() {
  const [markerPosition, setMarkerPosition] = useState(center);
  const searchBoxRef = useRef<any>(null);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const location = places[0].geometry?.location;
      if (location) {
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
      <div className="mb-2">
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Cari lokasi..."
            className="border p-2 w-full rounded"
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={14}
        onClick={onMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </LoadScript>
  );
}