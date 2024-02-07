const express = require('express');
const morgan = require('morgan');

/*--------------DECLARE THE ROUTERS HERE--------------*/



const app = express();
// just to check if we are in development or production you can comment code below
console.log(process.env.NODE_ENV)
// if in development show the logs of the api calls
if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'))

}

app.get('/', (req,res)=>{
    res.send("Hello from the app");
})
app.use(express.json());
app.use(express.static(`${__dirname}/public`))



/*--------------DECLARE THE ROUTES HERE--------------*/


module.exports = app;