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

exports.uploadImageData = asyncHandler(async (req, res) => {
  const idUser = req.user.id;

  const profileData = await Profile.findOne({
    where: {
      userId: idUser,
    },
  });

  if (!profileData) {
    res.status(400);
    throw new Error("profile belum dibuat");
  }

  //req file

  const file = req.file;

  if (profileData.image) {
    //ambil file gambar yang lama

    const nameImage = profileData.image.replace(
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
  }

  if (!file) {
    res.status(400);
    throw new Error("file image belum di input");
  }

  const fileNewImage = file.filename;

  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/${fileNewImage}`;

  //update data

  await Profile.update(
    {
      image: basePath,
    },
    {
      where: {
        id: profileData.id,
      },
    }
  );

  //response

  return res.status(201).json({
    message: "profile berhasil di update",
  });
});
