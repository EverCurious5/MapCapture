// src/App.js
import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import Cuboid from './components/Cuboid';
import TopRegions from './components/TopRegions';

function App() {
    const [textureUrl, setTextureUrl] = useState('');

    const handleCapture = (image) => {
        setTextureUrl(image);
    };

    return (
        <div>
            <h1>Map Capture App</h1>
            <MapContainer onCapture={handleCapture} />
            {textureUrl && <>
            <br/>
            Cuboid representing image captured - click,hold and move to see all faces:
            <Cuboid textureUrl={textureUrl} /></>}
            <TopRegions />
        </div>
    );
}

export default App;

