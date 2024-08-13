const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParse = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");

dotenv.config();
// const corsConfig = {
//   origin: "*",
//   credential: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(cookieParse());

app.use(morgan("dev"));

app.use(
  "/public/uploads",
  express.static(path.join(__dirname + "/public/uploads"))
);

app.use(express.urlencoded({ extended: true }));

const router = require("./router/routes");
const { errorHandler, notFoundUrl } = require("./middleware/errorMiddleware");
app.use("/", router);

app.use(notFoundUrl);
app.use(errorHandler);

port = 7000;

app.listen(port, () => {
  console.log(`app sedang berjalan di port:${port}`);
});
