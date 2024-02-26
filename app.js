const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
/*--------------DECLARE THE ROUTERS HERE--------------*/
const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const vehicleClassificationRouter = require('./routes/vehicleClassificationRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const subscriptionRouter = require('./routes/subscriptionRoutes');

const app = express();

// global middle ware
// set security HTTP headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// LIMIT REQUEST FROM API
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// data sanitization here against nosql query injection
app.use(mongoSanitize());
// data sanitization against XSS

// prevent parameter pollution
app.use(hpp());

// serving static files
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
