const express = require("express");
const dbConnect = require("./config/db");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const productRouter = require("../server/routes/productRouter");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { cloudinaryConnect } = require("./config/cloudinary");

const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

const PORT = process.env.PORT || 4001;

cloudinaryConnect();
dbConnect();

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT ${PORT}...`);
});

app.get("/", (req, res) => {
  res.json({ msg: "This is an example" });
});
