const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

router.route('/')
    .post()