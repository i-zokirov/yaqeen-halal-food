const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CL_CLOUD_NAME,
    api_key: process.env.CL_API_KEY,
    api_secret: process.env.CL_API_SECRET
});


const productsStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Yaqeen-halal-food-products',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});

const usersStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Yaqeen-halal-food-users',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});


module.exports = {
    cloudinary,
    usersStorage,
    productsStorage
}