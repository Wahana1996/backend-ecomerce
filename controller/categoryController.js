const asyncHandle = require("../middleware/asyncHandle");
const { Category, Product } = require("../models");

exports.createCategory = asyncHandle(async (req, res) => {
  const results = await Category.create({
    name: req.body.name,
    description: req.body.description,
  });

  res.status(200).json({
    message: "category created successfully",
    results,
  });
});

exports.updateCategory = asyncHandle(async (req, res) => {
  const id = req.params.id;
  await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  });

  const newCategory = await Category.findByPk(id);

  if (!newCategory) {
    res.status(404);
    throw new Error("Category tidak ditemukan");
  }

  return res.status(200).json({
    message: "category updated successfully",
    newCategory,
  });
});

exports.showAllCategory = async (req, res) => {
  try {
    const results = await Category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const count = await Category.count();
    res.json({
      message: `${count} Data category retrieved successfully`,
      count: count,
      results,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.errors.map((err) => err.message),
    });
  }
};

exports.showOneCategory = asyncHandle(async (req, res) => {
  const id = req.params.id;
  const results = await Category.findByPk(id, {
    include: [
      {
        model: Product,
        attributes: { exclude: ["categoryId"] },
      },
    ],
  });

  // const oneCategory = await Category.findByPk(req.params.id);

  if (!results) {
    res.status(404);
    throw new Error("Category tidak ditemukan");
  }

  res.status(200).json({
    message: "category retrived successfully",
    results: results,
  });
});

exports.deleteCategory = asyncHandle(async (req, res) => {
  // await Category.destroy({
  //   where: {
  //     id: req.params.id,
  //   },
  // });

  const deleteCategory = await Category.findByPk(req.params.id);

  if (!deleteCategory) {
    res.status(404);
    throw new Error("Category tidak ditemukan");
  }

  res.status(200).json({
    message: "delete category successfully",
  });
});
