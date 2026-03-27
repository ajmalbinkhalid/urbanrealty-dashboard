"use client";

import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";

type LocationPointsProps = {
  latitude?: number;
  longitude?: number;
  address?: string;
  onLocationChange?: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const mapContainerStyle = {
  height: "384px",
  width: "100%",
};

const libraries: "places"[] = ["places"];

const LocationPoints = ({
  latitude = 33.8924955,
  longitude = 35.4840943,
  address,
  onLocationChange,
  onAddressChange,
  error,
  disabled = false,
}: LocationPointsProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    language: "en",
    region: "US", // Set to US for global/unbiased search results
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);

  const getAddressFromCoordinates = useCallback(
    async (newLatitude: number, newLongitude: number) => {
      if (!geocoderRef.current) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }

      try {
        const result = await geocoderRef.current.geocode({
          location: { lat: newLatitude, lng: newLongitude },
        });

        if (result.results && result.results.length > 0) {
          const address = result.results[0]?.formatted_address ?? "";
          onAddressChange?.(address);
        }
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError);
      }
    },
    [onAddressChange]
  );

  const updateLocation = useCallback(
    (newLat: number, newLng: number) => {
      setLat(newLat);
      setLng(newLng);

      if (onLocationChange) {
        onLocationChange(newLat, newLng);
      }

      getAddressFromCoordinates(newLat, newLng);

      if (mapRef.current) {
        mapRef.current.panTo({ lat: newLat, lng: newLng });
      }
    },
    [getAddressFromCoordinates, onLocationChange]
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (disabled) return;
      if (event.latLng) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        updateLocation(newLat, newLng);
      }
    },
    [disabled, updateLocation]
  );

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (disabled) return;
      if (event.latLng) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        updateLocation(newLat, newLng);
      }
    },
    [disabled, updateLocation]
  );

  const handlePlacesChanged = useCallback(() => {
    if (!searchBoxRef.current) return;

    const places = searchBoxRef.current.getPlaces();
    
    console.log("Places found:", places); // Debug log
    
    if (!places || places.length === 0) return;

    const place = places[0];
    
    if (!place || !place.geometry?.location) return;

    const newLat = place.geometry.location.lat();
    const newLng = place.geometry.location.lng();
    
    console.log("Selected place:", place.name, place.formatted_address, newLat, newLng); // Debug log

    updateLocation(newLat, newLng);

    if (place.formatted_address) {
      onAddressChange?.(place.formatted_address);
    }
  }, [onAddressChange, updateLocation]);

  if (!isLoaded) {
    return (
      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-[.375rem] bg-muted"
        style={{ height: "384px" }}
      >
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-[.375rem]">
      <div className="relative mb-4">
        <StandaloneSearchBox
          onLoad={(ref) => {
            searchBoxRef.current = ref;
            // Don't set any bounds - allows global search
          }}
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            type="text"
            placeholder="Search any location worldwide..."
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={disabled}
            defaultValue={address}
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat, lng }}
        onClick={handleMapClick}
        onLoad={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        options={{
          draggable: !disabled,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          zoom: 15,
        }}
      >
        <Marker
          position={{ lat, lng }}
          draggable={!disabled}
          onDragEnd={handleMarkerDragEnd}
          onLoad={(markerInstance) => {
            markerRef.current = markerInstance;
          }}
        />
      </GoogleMap>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default LocationPoints;