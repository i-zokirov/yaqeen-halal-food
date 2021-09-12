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
        })
        await product.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close()
})