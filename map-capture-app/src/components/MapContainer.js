// src/components/MapContainer.js
import React, { useRef, useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import { Buffer } from 'buffer';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: -3.745,
    lng: -38.523,
};

function MapContainer({ onCapture }) {
    const mapRef = useRef(null);
    const [image, setImage] = useState(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyA5o9b1GTWw24agFnJmRW7NfeMlU5jeZcc',
    });

    const captureRegion = async () => {
        if (mapRef.current) {
            const map = mapRef.current.state.map;
            const center = map.getCenter();
            const zoom = map.getZoom();
            const size = { width: 600, height: 400 };

            const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat()},${center.lng()}&zoom=${zoom}&size=${size.width}x${size.height}&key=AIzaSyA5o9b1GTWw24agFnJmRW7NfeMlU5jeZcc`;

            try {
                const response = await axios.get(staticMapUrl, { responseType: 'arraybuffer' });
                const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
                const imageUrl = `data:image/png;base64,${imageBase64}`;
                setImage(imageUrl);

                await axios.post('https://mapcapture-1.onrender.com/api/save-map', {
                    image: imageUrl,
                    region: map.getBounds().toJSON(),
                });

                onCapture(imageUrl);
            } catch (error) {
                console.error("Error capturing map image:", error);
            }
        }
    };    

    return isLoaded ? (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={(map) => (mapRef.current = { state: { map } })}
            />
            <button onClick={captureRegion}>Capture Region</button>
            {image && <>
                <div>Captured region:</div>
                <img src={image} alt="Captured region" />
                </>}
        </>
    ) : (
        <div>Loading...</div>
    );
}

export default MapContainer;

