require("dotenv").config({ path: "./config.env" });
var cors = require('cors');
const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./data/swagger.json');
const carInfo = require('./car_data/carInfo');
const indCarInfo = require('./car_data/indCarInfo');
const similarCarInfo = require('./car_data/similarCarInfo');
const carStr = require('./car_data/carStr');
const carsFilter = require('./car_data/cars');
const blogData = require('./blog_data/blogData');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');


app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
    res.send("Api running");
});

//GET car info filtered
app.get('/api/cars/filter', async (req, res) => {
    try {
        const city = req.query.city || 'bangalore';
        const min = parseInt(req.query.min) || 10000;
        const max = parseInt(req.query.max) || 45000;
        const availability = parseInt(req.query.availability) || 30;
        const fuel = req.query.fuel || 'All';
        const transmission = req.query.transmission || 'All';
        const brand = req.query.brand || 'All';
        const sort = req.query.sort || 'asc';
        const segment = req.query.segment || 'All';
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) - 1 || 0;

        const data = await carsFilter.getData(city.toLowerCase(), min, max, availability, fuel.toLowerCase(), transmission.toLowerCase(), brand.toLowerCase(), sort.toLowerCase(), segment.toLowerCase(), limit, page);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

//Cars by for months or years

//GET car info by city
app.get('/api/cars/:city', async (req, res) => {
    const { city } = req.params;
    try {
        const data = await carInfo.getData(city);
        res.json(data);

    } catch (error) {
        res.json(error);
    }
});

//GET individual car info by city and car id
app.get('/api/cars/:city/:producer/:model/:transmission/:id', async (req, res) => {
    const { city, producer, model, transmission, id } = req.params;
    try {
        const data = await indCarInfo.getData(city, producer, model, transmission, id);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

//GET similar cars
app.get('/api/cars/:id/:cityId', async (req, res) => {
    const { id, cityId } = req.params;
    try {
        const data = await similarCarInfo.getData(id, cityId);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

//Cars for hours or days
//str => short term rental
//allowed timings -->
//0:00 4:00 4:30 5:00 5:30 6:00 6:30 7:00 7:30 8:00 8:30 9:00 9:30 10:00 10:30 11:00 11:30 12:00 12:30 13:00 13:30 14:00 14:30 15:00 15:30 16:00 16:30 17:00 17:30 18:00 18:30 19:00 19:30 20:00 20:30 21:00 21:30 22:00 22:30 23:00 23:30
app.get('/api/str/:startDate/:endDate/:long/:lat/:location', async function (req, res) {
    const { startDate, endDate, long, lat, location
    } = req.params;
    try {
        const data = await carStr.getData(startDate, endDate, long, lat, location);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

//Blog data
app.get('/api/blog/:url', async (req, res) => {
    const { url } = req.params;
    try {
        const data = await blogData.getData(url);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

//User routes
app.use('/api/user', userRoutes);

//middleware for swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })