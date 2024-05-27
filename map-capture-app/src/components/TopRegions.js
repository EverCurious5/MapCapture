import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopRegions() {
    const [topRegions, setTopRegions] = useState([]);

    useEffect(() => {
        // Fetch data from API
        axios.get('https://mapcapture-1.onrender.com/api/top-regions')
            .then(response => {
                setTopRegions(response.data);
            })
            .catch(error => {
                console.error('Error fetching top regions:', error);
            });
    }, []);

    return (
        <div>
            <h2>Top Three Regions</h2>
            <ul>
                {topRegions.map((region, index) => (
                    <li key={index}>
                        {region._id !== undefined && region._id !== null &&
                            `Region: [${region._id?.north}, ${region._id?.south}, ${region._id?.east}, ${region._id?.west}] - Count: ${region.count}`
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopRegions;
