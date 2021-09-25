const mongoose = require('mongoose')
const Product = require('../model/productModel')
const fs = require('fs')


const fruits = require('./fruits')
const vegetables = require('./vegetables')
const spices = require('./spices')
const meats = ['bief', 'lamb', 'chicken', 'turkey']


//mongoode connection to MongoDB
mongoose.connect('mongodb://localhost:27017/yaqeen-halal-food-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', console.error.bind(console, 'connection error: '))
mongoose.connection.once('open', () => {
    console.log('Database connected')
})

const seedDB = async() => {
    await Product.deleteMany({})

    for (let fruit of fruits) {
        const price = Math.floor(Math.random() * 10) + 10;
        const quantity = Math.floor(Math.random() * 20) + 10;
        // const random = Math.floor(Math.random * fruitData.fruits.length)
        const product = new Product({
            name: fruit,
            category: "fruits",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            price: price,
            quantity: quantity,
            quantity_type: "kg",
            images: [{
                url: 'https://res.cloudinary.com/yaqeen-halal-food-img-cloud/image/upload/v1632599559/Yaqeen-halal-food/bc1r92hg8wwmdpe703ew.jpg',
                filename: 'Yaqeen-halal-food/bc1r92hg8wwmdpe703ew'
            }]
        })
        await product.save()
    }

    for (let vegetable of vegetables) {
        const price = Math.floor(Math.random() * 10) + 10;
        const quantity = Math.floor(Math.random() * 20) + 10;
        const product = new Product({
            name: vegetable,
            category: "vegetables",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            price: price,
            quantity: quantity,
            quantity_type: "kg",
            images: [{
                url: 'https://res.cloudinary.com/yaqeen-halal-food-img-cloud/image/upload/v1632599466/Yaqeen-halal-food/uvyackpw5bx7tdv53ttq.jpg',
                filename: 'Yaqeen-halal-food/uvyackpw5bx7tdv53ttq'
            }]
        })
        await product.save()
    }
    for (let spice of spices) {
        const price = Math.floor(Math.random() * 10) + 10;
        const quantity = Math.floor(Math.random() * 20) + 10;
        const product = new Product({
            name: spice,
            category: "spices",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            price: price,
            quantity: quantity,
            quantity_type: "piece",
            images: [{
                url: 'https://res.cloudinary.com/yaqeen-halal-food-img-cloud/image/upload/v1632599649/Yaqeen-halal-food/p6e6duhczrt2rzgpppaj.jpg',
                filename: 'Yaqeen-halal-food/p6e6duhczrt2rzgpppaj'
            }]
        })
        await product.save()
    }
    for (let meat of meats) {
        const price = Math.floor(Math.random() * 10) + 10;
        const quantity = Math.floor(Math.random() * 20) + 10;
        const product = new Product({
            name: meat,
            category: "meat",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            price: price,
            quantity: quantity,
            quantity_type: "kg",
            images: [{
                url: 'https://res.cloudinary.com/yaqeen-halal-food-img-cloud/image/upload/v1632597571/Yaqeen-halal-food/yycvlo7khmhrbexqliqa.jpg',
                fieldname: 'Yaqeen-halal-food/yycvlo7khmhrbexqliqa'
            }]
        })
        await product.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close()
})