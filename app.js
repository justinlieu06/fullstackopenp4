// one role of this is extract the express app
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { blogsRouter } = require("./controllers/blogs");
const logger = require("./utils/logger");
const config = require("./utils/config");
require('express-async-errors');

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;