const { Op } = require("sequelize");
const asyncHandle = require("../middleware/asyncHandle");
const { Product, Category, Review, User, Profile } = require("../models");
const fs = require("fs");

exports.addProductController = asyncHandle(async (req, res) => {
  let { name, description, categoryId, price, stock } = req.body;

  const file = req.file;
  //   console.log(file);
  //   const filetype = {
  //     "image/png": "image",
  //     "image/jpg": "image",
  //     "image/jpeg": "image",
  //   }[file.mimetype];
  //   console.log(filetype);

  //validasi jika tidak input file

  if (!file) {
    res.status(400);
    throw new Error("Tidak image file yang di input");
  }

  const fileName = file.filename;
  const pathFile = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileName}`;

  const newProduct = await Product.create({
    name,
    description,
    categoryId,
    price,
    stock,
    image: pathFile,
  });

  return res.status(200).json({
    status: "success",
    newProduct,
  });
});

exports.readProducts = asyncHandle(async (req, res) => {
  const { search, limit, page } = req.query;

  let productData = "";

  if (search || limit || page) {
    const pageData = page * 1 || 1;
    const limitData = limit * 1 || 100;
    const offsetData = (pageData - 1) * limitData;
    const searchData = search || "";
    const products = await Product.findAndCountAll({
      limit: limitData,
      offset: offsetData,
      where: {
        name: {
          [Op.like]: "%" + searchData + "%",
        },
      },
      include: [
        {
          model: Category,
          attributes: {
            exclude: ["createdAt", "updatedAt", "description"],
          },
        },
      ],
    });
    productData = products;
  } else {
    const products = await Product.findAndCountAll({
      include: [
        {
          model: Category,
          attributes: {
            exclude: ["createdAt", "updatedAt", "desciption"],
          },
        },
      ],
    });
    productData = products;
  }

  return res.status(200).json({
    data: productData,
  });
});

exports.detailProducts = asyncHandle(async (req, res) => {
  const id = req.params.id;
  const productData = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        attributes: { exclude: ["createdAt", "updatedAt", "description"] },
      },
      {
        model: Review,
        attributes: { exclude: ["userId", "productId"] },
        include: [
          {
            model: User,
            attributes: ["name"],
            include: [
              {
                model: Profile,
                attributes: ["age", "image"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!productData) {
    res.status(404);
    throw new Error("Product id tidak ditemukan");
  }

  return res.status(200).json({
    data: productData,
  });
});

exports.updateProducts = asyncHandle(async (req, res) => {
  //request params dan req body
  const idParams = req.params.id;
  let { name, price, description, stock, categoryId } = req.body;

  //get data by id
  const productData = await Product.findByPk(idParams);

  //kondisi jika product data id tidak ditemukan
  if (!productData) {
    res.status(400);
    throw new Error("product id tidak ditemukan");
  }

  //req file
  const file = req.file;

  //kondisi jika file gambar diganti/update
  if (file) {
    //ambil file gambar lama => pakai replace = hasilnya sisa nama image
    const nameImage = productData.image.replace(
      `${req.protocol}://${req.get("host")}/public/uploads`,
      ""
    );
    //tempat file gambar lama
    const filePath = `./public/uploads/${nameImage}`;

    //fungsi hapus file
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(400);
        throw new Error("file tidak ditemukan");
      }
    });

    const fileName = file.filename;
    const pathFile = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/${fileName}`;

    productData.image = pathFile;
  }

  productData.name = name || productData.name;
  productData.price = price || productData.price;
  productData.description = description || productData.description;
  productData.categoryId = categoryId || productData.categoryId;
  productData.stock = stock || productData.stock;

  productData.save();

  res.status(200).json({
    message: "update product data berhasil",
    productData,
  });
});

exports.destroyProduct = asyncHandle(async (req, res) => {
  //request params dan req body
  const idParams = req.params.id;

  //get data by id
  const productData = await Product.findByPk(idParams);

  if (productData) {
    //ambil file gambar
    const nameImage = productData.image.replace(
      `${req.protocol}://${req.get("host")}/public/uploads`,
      ""
    );
    //tempat file gambar lama
    const filePath = `./public/uploads/${nameImage}`;

    //fungsi hapus file
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(400);
        throw new Error("file tidak ditemukan");
      }
    });

    productData.destroy();

    return res.status(200).json({
      message: "product data berhasil dihapus",
    });
  } else {
    return res.status(404);
    throw new Error("product id tidak ditemukan");
  }
});
