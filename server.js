const mongoose = require('mongoose');
const dotenv = require('dotenv');
// configure the dotenv path
dotenv.config({ path: './config.env' });

//connect to database
const database = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(database, {
        //useNewUrlParser: true,
    })
    .then((con) => {
        //console.log(con.connection)
        console.log('DB CONNECTION SUCCESS');
    });

const app = require('./app');
const uri = process.env.DATABASE;
const client = new MongoClient(uri);
// start the server on port 3000
const port = process.env.port;

client.connect((err) => {
    if (err) {
        console.error(err);
        return false;
    }
    app.listen(port, (req, res) => {
        console.log(`Server running on port ${port}`);
    });
});
