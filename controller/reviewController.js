const asyncHandler = require("../middleware/asyncHandle");
const { Review, Product } = require("../models");
const { Sequelize, where } = require("sequelize");

const averageDataProduct = async (idDataProduct) => {
  const resReview = await Review.findOne({
    attributes: [[Sequelize.fn("avg", Sequelize.col("point")), "average"]],
    where: {
      productId: idDataProduct,
    },
  });

  const rataRata = Number(resReview.dataValues.average);

  await Product.update(
    {
      avgReview: rataRata,
    },
    {
      where: {
        id: idDataProduct,
      },
    }
  );
};

exports.createOrUpdateReview = asyncHandler(async (req, res) => {
  const idUser = req.user.id;
  const idProduct = req.params.productId;

  const { point, content } = req.body;

  let message = "";

  const myReview = await Review.findOne({
    where: {
      productId: idProduct,
      userId: idUser,
    },
  });

  if (myReview) {
    //update review data
    await Review.update(
      {
        point,
        content,
      },
      {
        where: {
          id: myReview.id,
        },
      }
    );

    await averageDataProduct(idProduct);
    message = "berhasil update data review";
  } else {
    await Review.create({
      userId: idUser,
      productId: idProduct,
      point,
      content,
    });

    //tambah nilai 1 pada countReview pada Product
    await Product.increment({ countReview: 1 }, { where: { id: idProduct } });

    await averageDataProduct(idProduct);
    message = "berhasil tambah data review";
  }

  return res.status(200).json({
    message: message,
  });
});


