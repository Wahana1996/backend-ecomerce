const { User, Profile, Product, Category } = require("../models");
const jwt = require("jsonwebtoken");
const asyncHandle = require("../middleware/asyncHandle");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOption = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  user.password = undefined;
  res.cookie("jwt", token, cookieOption);

  res.status(statusCode).json({
    status: "success",
    data: { user },
  });
};

exports.register = asyncHandle(async (req, res) => {
  if (req.body.confirmNewPassword !== req.body.newPassword) {
    return res.status(400).json({
      message: "validasi error",
      error: ["confirmNewPassword dan newPassword tidak sama"],
    });
  }

  const results = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.newPassword,
    //   roleId: req.body.roleId,
  });

  // const token = signToken(results.id);

  // res.status(200).json({
  //   message: "register successfully",
  //   token,
  //   data: results,
  // });

  createSendToken(results, 200, res);

  return res.status(400).json({
    message: "something wrong",
  });
});

exports.login = async (req, res) => {
  try {
    //fungsi validasi
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: "fail",
        message: "error validasi",
        error: "please input password/email",
      });
    }

    //check exist email dan compare password
    const userData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (
      !userData ||
      !(await userData.CorrectPassword(req.body.password, userData.password))
    ) {
      return res.status(400).json({
        status: "fail",
        message: "error login",
        error: "invalid email or password",
      });
    }

    // const token = signToken(userData.id);

    // return res.status(200).json({
    //   message: "login successfully",
    //   token,
    //   name: userData.name,
    // });

    createSendToken(userData, 200, res);
  } catch (err) {
    return res.status(400).json({
      message: err.errors.map((err) => err.message),
    });
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "", { expires: new Date(0) });

  res.status(200).json({
    message: "logout berhasil",
  });
};

exports.getMyUser = async (req, res) => {
  const currentUser = await User.findOne({
    where: {
      id: req.user.id,
    },
    include: [
      {
        model: Profile,
        attributes: {
          exclude: ["createdAt", "updatedAt", "userId"],
        },
      },
      {
        model: Product,
        attributes: {
          exclude: ["createdAt", "updatedAt", "categoryId"],
        },
        as: "historyReview",
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt", "password"],
    },
  });

  if (currentUser) {
    return res.status(200).json({
      message: "success",
      data: currentUser,
    });
  }

  return res.status(404).json({
    message: "user tidak ditemukan",
  });
};
