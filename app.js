'use strict';

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routers')(app);

app.use((err, req, res, next) => {
    if (err.code && err.result && err.result.messages) {
        res.status(err.code).json({
            status: false,
            ...err,
        });
    } else {
        const code = 500;
        res.status(code).json({
            code,
            status: false,
            message: 'Something went wrong!',
        });
    }
});

const run = async () => {
    try {
        const connectDb = require('./core/database/mongo');
        await connectDb();
        app.listen(process.env.PORT, async () =>
            console.log(`Application runs on port ${process.env.PORT}`)
        );
    } catch (e) {
        console.log('App has been crashed!');
        console.log('INFO: Please check env variables to run app.');
    }
};

run();
