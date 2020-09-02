const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            autoIndex: true, //this is the code I added that solved it all
            keepAlive: true,
        });
        console.log('MongoDb has been connected.');
    } catch (e) {
        console.log(e);
    }
};

module.exports = connectDb;
