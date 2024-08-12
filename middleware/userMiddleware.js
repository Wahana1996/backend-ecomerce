const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

exports.authMiddleware = async (req, res, next) => {
  //fungsi di header masukkan token atau tidak
  let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  token = req.cookies.jwt;
  if (!token) {
    return next(
      res.status(401).json({
        status: 401,
        message: "anda belum login/register,token tidak ditemukan",
      })
    );
  }

  //verifikasi token
  let decode;
  try {
    decode = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(
      res.status(401).json({
        status: 401,
        message: "token yang dimasukkan tidak ditemukan/tidak ada",
      })
    );
  }

  //ambil data berdasarkan id user
  const currentUser = await User.findOne({
    where: {
      id: decode.id,
    },
  });
  if (!currentUser) {
    return next(
      res.status(401).json({
        status: 401,
        message: "user sudah terhapus,token sudah tidak bisa digunakan",
      })
    );
  }
  req.user = currentUser;

  next();
};

exports.permissionUser = (...roles) => {
  return async (req, res, next) => {
    const roleData = await Role.findByPk(req.user.roleId);

    const roleName = roleData.name;

    if (!roles.includes(roleName)) {
      return next(
        res.status(403).json({
          status: 403,
          error: "anda tidak dapat mengakses halaman ini",
        })
      );
    }

    next();
  };
};
