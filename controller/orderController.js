const { Order, OrderItem, Product, Shopping_cart_item } = require("../models");
const midtransClient = require("midtrans-client");

const asyncHandle = require("../middleware/asyncHandle");

exports.createOrder = asyncHandle(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, cartItemId } = req.body;

  let orderItems = [];
  let totalPrice = 0;

  if (productId && quantity) {
    // Handle single product order
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const itemTotal = product.price * quantity;
    totalPrice += itemTotal;

    orderItems.push({
      productId: productId,
      quantity: quantity,
      price: product.price,
      total: itemTotal,
    });
  } else if (cartItemId && Array.isArray(cartItemId)) {
    // Handle order from shopping cart items
    const cartItems = await Shopping_cart_item.findAll({
      where: { id: cartItemId },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (cartItems.length === 0) {
      res.status(400);
      throw new Error("Cart items not found or not associated with this user");
    }

    cartItems.forEach((item) => {
      const itemTotal = item.product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        total: itemTotal,
      });
    });
  } else {
    res.status(400);
    throw new Error(
      "Invalid request: provide either productId with quantity or cartItemId"
    );
  }

  const orderId = `ORDER-${Date.now()}-${req.user.name}`;

  const order = await Order.create({
    userId: userId,
    orderId: orderId,
    quantity: quantity,
    totalPrice: totalPrice,
    paymentStatus: "pending",
  });

  // Create order items
  for (const item of orderItems) {
    await OrderItem.create({
      orderIds: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    });
  }

  // Integrasi Midtrans
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.CLIENT_KEY,
  });

  let transactionDetails = {
    order_id: orderId,
    gross_amount: totalPrice,
  };

  let parameter = {
    transaction_details: transactionDetails,
    credit_card: {
      secure: true,
    },
    customer_details: {
      userId: userId,
      email: req.user.email,
    },
  };

  const transaction = await snap.createTransaction(parameter);

  res.status(200).json({
    message: "Order created successfully",
    order,
    transaction: transaction,
  });
});
