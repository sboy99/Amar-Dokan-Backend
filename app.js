require("express-async-errors");
require("dotenv").config();

//Express//
const express = require("express");
const app = express();

//Firebase SDK//
const admin = require("firebase-admin");

const serviceAccount = require("./config/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//aditional packages//
const cloudinary = require("cloudinary").v2;
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//Sequrity Packages//
const cors = require("cors");

//DB Connection//
const connectDB = require("./db/connect");

//Parsers//
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Essential //
app.use(morgan("tiny"));
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//sequrities//
app.use(cors());

//Middlewares//
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

//Routers//
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");

//*Server*//
app.get("/", (req, res) => {
  res.send(`E-commerce-practice`);
});

//>Routing
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
(async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => console.log(`Server is listening on port:${port}`));
})();
