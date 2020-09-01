'use strict';

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routers')(app);


require('./core/database/mongo');


app.use((err, req, res, next) => {
    const code = err.code || 500;
    if (err.code) {
        res.status(code).json({
            status: false,
            ...err,
        });
    } else {
        res.status(code).json({
            code,
            status: false,
            message: 'Something went wrong!',
            trace: err,
        });
    }
});

app.listen(process.env.PORT, () => console.log(`Application runs on port ${process.env.PORT}`));
