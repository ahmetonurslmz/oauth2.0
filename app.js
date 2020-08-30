'use strict';

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routers')(app);


app.listen(process.env.PORT, () => console.log(`Application runs on port ${process.env.PORT}`));
