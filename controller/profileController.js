const asyncHandle = require("../middleware/asyncHandle");
const { Profile } = require("../models");

exports.createOrUpdateProfile = asyncHandle(async (req, res) => {
  const { age, bio, address } = req.body;

  const idUser = req.user.id;

  const userData = await Profile.findOne({
    where: {
      userId: idUser,
    },
  });

  let message = "";

  if (userData) {
    //update profile
    await Profile.update(
      {
        age: age || userData.age,
        bio: bio || userData.bio,
        address: address || userData.address,
      },
      {
        where: {
          userId: idUser,
        },
      }
    );
    message = "profile berhasil di update";
  } else {
    //create profile

    await Profile.create({
      age,
      bio,
      address,
      userId: idUser,
    });
    message = "profile berhasil di buat";
  }
  return res.status(200).json({
    message: message,
  });
});

exports.uploadImageData = asyncHandle(async (req, res) => {
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
