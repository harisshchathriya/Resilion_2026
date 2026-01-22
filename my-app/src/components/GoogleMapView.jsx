import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 12.9716,
  lng: 77.5946, // Bangalore (safe default)
};

export default function GoogleMapView() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBthAa_IcLPDqnl8mZtk7XfcQRtFbDXl_E">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
