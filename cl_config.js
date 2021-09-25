const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CL_CLOUD_NAME,
    api_key: process.env.CL_API_KEY,
    api_secret: process.env.CL_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Yaqeen-halal-food',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
})


module.exports = {
    cloudinary,
    storage
}