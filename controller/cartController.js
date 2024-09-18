const asyncHandle = require("../middleware/asyncHandle");
const { Shopping_cart, Product, Shopping_cart_item } = require("../models");

exports.addCart = asyncHandle(async (req, res) => {
  // const { productId, quantity } = req.body;

  // const product = await Product.findByPk(productId);

  // if (!product) {
  //   res.status(400);
  //   throw new Error("product id tidak ditemukan");
  // }
  // const priceProduct = product.price;
  // const userName = req.user.name;
  // const nameProduct = product.name;
  // const imageProduct = product.image;

  // let total = 0;
  // total += parseInt(priceProduct) * parseInt(quantity);
  // console.log(total);
  // const cart = await Cart.create({
  //   userId: req.user.id,
  //   productId,
  //   userName: userName,
  //   nameProduct: nameProduct,
  //   imageProduct: imageProduct,
  //   price: priceProduct,
  //   quantity,
  //   total: parseInt(product.price) * parseInt(quantity),
  // });

  const user_Id = req.user.id; // Mengambil user_id dari req.user
  if (!user_Id) {
    res.status(400);
    throw new Error("userId tidak ditemukan");
  }

  const existingShoppingCart = await Shopping_cart.findOne({
    where: { userId: req.user.id },
  });
  if (existingShoppingCart) {
    res.status(400);
    throw new Error("user sudah memiliki cart");
  }

  const shoppingCart = await Shopping_cart.create({ userId: user_Id });

  return res.status(200).json({
    message: "success add cart",
    shoppingCart,
  });
});

exports.addCartItem = asyncHandle(async (req, res) => {
  //cart_items berupa array
  const { shoppingCartId, cart_items } = req.body;

  // Validasi 1: Cek apakah shoppingCartId valid
  const shoppingCart = await Shopping_cart.findByPk(shoppingCartId);
  if (!shoppingCart) {
    res.status(404);
    throw new Error("Shopping cart not found");
  }

  // Array untuk menampung item yang berhasil ditambahkan
  let addedItems = [];

  // Looping untuk setiap item di cart_items
  //cart_items masukkan ke dalam item
  for (let item of cart_items) {
    //item berupa productId dan quantity
    const { productId, quantity } = item;

    // Validasi 2: Cek apakah productId valid
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Validasi 3: Cek apakah quantity adalah angka positif
    if (quantity <= 0) {
      res.status(400);
      throw new Error(
        `Quantity for product ID ${productId} must be a positive number`
      );
    }

    // Validasi 4: Cek apakah productId sudah ada di shoppingCartId ini
    const existingItem = await Shopping_cart_item.findOne({
      where: { shoppingCartId, productId },
    });

    if (existingItem) {
      res.status(400);
      throw new Error(`Product with ID ${productId} already in cart`);
    }

    // Gunakan spread operator untuk menggabungkan properti
    const newCartItem = {
      shoppingCartId,
      ...item, // Menggabungkan product_id dan quantity dari item yang di-loop
    };

    // Tambahkan item ke dalam keranjang
    const shoppingCartItem = await Shopping_cart_item.create(newCartItem);

    // Tambahkan item yang berhasil dibuat ke array
    addedItems.push(shoppingCartItem);
  }

  // Kirim respons dengan semua item yang berhasil ditambahkan
  res.status(201).json({
    message: "Items added to cart successfully",
    addedItems,
  });

  // const getCartItems = async () => {
  //   const items = await Shopping_cart_item.findAll({
  //     attributes: {
  //       exclude: ["createdAt", "updatedAt"],
  //     },
  //   });
  //   console.log(items);
  // };

  // getCartItems();
});

//get one shopping cart
exports.getShoppingCart = asyncHandle(async (req, res) => {
  const { id } = req.params; // Mengambil shopping_cart_id dari URL parameter
  const userId = req.user.id; // Mengambil user_id dari req.user

  const shoppingCart = await Shopping_cart.findOne({
    where: {
      id,
      userId: userId, // Pastikan keranjang milik pengguna yang sedang login
    },
    include: [
      {
        model: Shopping_cart_item, // Include ShoppingCartItem
        as: "items", // Alias untuk item di dalam keranjang
        attributes: ["id", "productId", "quantity"], // Atribut yang ingin ditampilkan
      },
    ],
    attributes: ["id", "userId"],
  });

  if (!shoppingCart) {
    res.status(400);
    throw new Error("Shopping cart not found");
  }

  res.status(200).json({
    message: "get One cart successfully",
    shoppingCart,
  });
});

//get all shopping cart
exports.getAllShoppingCart = asyncHandle(async (req, res) => {
  const shoppingCart = await Shopping_cart.findAll({
    include: [
      {
        model: Shopping_cart_item, // Include ShoppingCartItem
        as: "items", // Alias untuk item di dalam keranjang
        attributes: ["id", "productId", "quantity"], // Atribut yang ingin ditampilkan
      },
    ],
    attributes: ["id", "userId"],
  });

  if (!shoppingCart) {
    res.status(400);
    throw new Error("Shopping cart not found");
  }

  res.status(200).json({
    message: "get all cart successfully",
    shoppingCart,
  });
});

exports.updateShoppingCartItemQuantity = asyncHandle(async (req, res) => {
  const { id } = req.params; // ID ShoppingCartItem dari URL parameter
  const { quantity } = req.body; // Quantity baru yang akan diupdate

  // Cek apakah ShoppingCartItem yang diupdate
  const cartItem = await Shopping_cart_item.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Shopping_cart,
        as: "cart",
        where: {
          userId: req.user.id,
        },
      },
    ],
  });

  if (!cartItem) {
    res.status(400);
    throw new Error("Shopping cart item not found");
  }

  // Update quantity di ShoppingCartItem
  cartItem.quantity = quantity;
  await cartItem.save();

  res.status(200).json({
    message: "Quantity updated successfully",
    cartItem,
  });
});

exports.deleteShoppingCartItem = asyncHandle(async (req, res) => {
  const { id } = req.params; // ID ShoppingCartItem dari URL parameter

  // Cek apakah ShoppingCartItem yang diupdate
  const cartItem = await Shopping_cart_item.findOne({
    where: {
      id: id,
    },
  });

  if (!cartItem) {
    res.status(400);
    throw new Error("Shopping cart item not found");
  }

  await cartItem.destroy();

  res.status(200).json({
    message: "deleted cart item successfully",
  });
});
