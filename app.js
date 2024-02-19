const express = require('express');
const morgan = require('morgan');

/*--------------DECLARE THE ROUTERS HERE--------------*/
const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const vehicleClassificationRouter = require('./routes/vehicleClassificationRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const subscriptionRouter = require('./routes/subscriptionRoutes');
const app = express();
// just to check if we are in development or production you can comment code below
console.log(process.env.NODE_ENV);
// if in development show the logs of the api calls
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.send('Hello from the server');
});
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

/*--------------DECLARE THE ROUTES HERE--------------*/
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vehicle-classifications', vehicleClassificationRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
// Handle error if tried to access invalid path
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(GlobalErrorHandler);
// global error handler

module.exports = app;
