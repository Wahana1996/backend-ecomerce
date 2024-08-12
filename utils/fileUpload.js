const multer = require("multer");

const FILE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidformat = FILE_TYPE[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValidformat) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    // const fileName = file.originalname.split(" ").join("-");
    const extention = FILE_TYPE[file.mimetype];
    const uniqueFileImage = `${file.fieldname}-${Date.now()}.${extention}`;

    cb(null, uniqueFileImage);
  },
});

exports.uploadOption = multer({ storage: storageFile });
