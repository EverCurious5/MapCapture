require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const atlasURI = `mongodb+srv://sagarchovatiya0104:${process.env.DB_PASSWORD}@cluster0.onof6ue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(atlasURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('MongoDB Atlas connected successfully');
}).catch(err => {
    console.error('MongoDB Atlas connection error:', err);
});

const mapSchema = new mongoose.Schema({
    image: String,
    region: {
        north: Number,
        south: Number,
        east: Number,
        west: Number,
    },
});

const Map = mongoose.model('Map', mapSchema);

const redisClient = redis.createClient({
    password: process.env.CACHE_PASSWORD,
    socket: {
        host: 'redis-14025.c244.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 14025
    }
});

redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch(err => {
    console.error('Redis connection error:', err);
});

const cacheMiddleware = async (req, res, next) => {
    const { url } = req;
    try {
        const cachedData = await redisClient.get(url);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        next();
    } catch (err) {
        console.error('Cache error:', err);
        next();
    }
};

app.post('/api/save-map', async (req, res) => {
    const { image, region } = req.body;

    try {
        const newMap = new Map({ image, region });
        await newMap.save();
        res.status(201).json(newMap);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/maps', cacheMiddleware, async (req, res) => {
    try {
        const maps = await Map.find();
        await redisClient.set(req.url, JSON.stringify(maps));
        res.json(maps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/top-regions', async (req, res) => {
    try {
        const topRegions = await Map.aggregate([
            {
                $group: {
                    _id: {
                        north: "$region.north",
                        south: "$region.south",
                        east: "$region.east",
                        west: "$region.west"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);
        console.log("hello", topRegions);
        res.json(topRegions);
    } catch (error) {
        console.error('Error fetching top regions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
