const Product = require('../model/productModel')
const ShoppingCart = require('../model/shoppingCartModel')
const Order = require('../model/ordersModel')
const User = require('../model/userModel')

//rendering shopping cart template if it exists
module.exports.render_shopping_cart = async(req, res) => {
    const { id } = req.user
    const user = await User.findById(id).populate('shopping_cart')
    if (user.shopping_cart) {
        const shopping_cart = await (await ShoppingCart.findById(user.shopping_cart._id)).populate('cart_owner')
        for (let index in shopping_cart.products) {
            await shopping_cart.populate(`products.${index}.cart_item`)
        }
        res.render('customer/shoppingcart-template', { what: "MyCart", shopping_cart })
    } else {
        req.flash('info', 'You do not have any items in your cart. Add products to your cart to view them.')
        res.redirect('/products')
    }
};

//adding item to existing shopping cart or creating one if needed
module.exports.add_item = async(req, res) => {
    const { productID, userID, quantity } = req.body
    const user = await User.findById(userID)
    const product = await Product.findById(productID)
    if (user.shopping_cart) {
        await user.populate('shopping_cart')
        const existing_cart = await ShoppingCart.findById(user.shopping_cart._id)
        existing_cart.products.push({ cart_item: product, item_quantity: quantity })
        await existing_cart.save()
    } else {
        const new_shopping_cart = await new ShoppingCart({ products: [{ cart_item: productID, item_quantity: quantity }] })
        new_shopping_cart.cart_owner = userID
        await new_shopping_cart.save()
        user.shopping_cart = new_shopping_cart._id
        await user.save()
    }
    req.flash('success', `${product.name} has been added to your shopping cart!`)
    res.redirect('/shopping-cart')
}

//removing an item from the shopping cart
module.exports.remove_item = async(req, res) => {
    const { cartItemId } = req.params
    const userID = req.user._id
    const user = await (await User.findById(userID)).populate('shopping_cart')
    const shopping_cart = await ShoppingCart.findById(user.shopping_cart._id)
    for (let index in shopping_cart.products) {
        await shopping_cart.populate(`products.${index}.cart_item`)
    }
    await shopping_cart.products.id(cartItemId).remove()
    await shopping_cart.save()

    req.flash('success', 'Item has been removed')
    res.redirect('/shopping-cart')
}

//updating quantity value of the given item in the shopping cart 
module.exports.update_quantity = async(req, res) => {
    const { cartItemId } = req.params
    const { quantityupdate } = req.body
    const userID = req.user._id
    let itemName;
    const user = await (await User.findById(userID)).populate('shopping_cart')
    const shopping_cart = await ShoppingCart.findById(user.shopping_cart._id)
    for (let index in shopping_cart.products) {
        await shopping_cart.populate(`products.${index}.cart_item`)
        if (shopping_cart.products[index]._id == cartItemId) {
            shopping_cart.products[index].item_quantity = quantityupdate
            itemName = shopping_cart.products[index].cart_item.name
        }
    }
    await shopping_cart.save()
    req.flash('success', `Refreshed the quantity of the ${itemName}!`)
    res.redirect('/shopping-cart')
};

//placing order
module.exports.process_order = async(req, res) => {
    const { cartID } = req.params
    const { payment_method, total_price } = req.body
    const shopping_cart = await (await ShoppingCart.findById(cartID)).populate('cart_owner')
    const user = await User.findById(shopping_cart.cart_owner._id)
    if (user.first_name == "" || user.last_name == "" || user.last_name == "" ||
        user.address == "" || user.phone_number == null) {
        req.flash('error', 'Please complete your profile information before placing an order')
        return res.redirect('/user/myaccount')
    }
    const ordered_products = []
    for (let index in shopping_cart.products) {
        await shopping_cart.populate(`products.${index}.cart_item`)
        let product = {
            product_name: shopping_cart.products[index].cart_item.name,
            product_id: shopping_cart.products[index].cart_item._id,
            product_price: shopping_cart.products[index].cart_item.price,
            quantity: shopping_cart.products[index].item_quantity,
            product_quantity_type: shopping_cart.products[index].cart_item.quantity_type,
            product_category: shopping_cart.products[index].cart_item.category
        }
        ordered_products.push(product)
    }
    const newOrder = await new Order({ products: ordered_products, order_owner: user._id, payment_method, total_price })
    await newOrder.save()
    user.orders.push(newOrder._id)
    shopping_cart.products = []
    await shopping_cart.save()
    await user.save()
    req.flash('success', 'Order has been confirmed')
    res.redirect('/user/myaccount/purchases')
}