const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { urlencoded } = require("express");
const { connectDB } = require("./middlewares/connectDb");
const errorMiddlewire = require("./middlewares/error");
const commentRoute = require("./routes/commentRoute");
const app = express();

dotenv.config();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://anchor-niladrimodaks-projects.vercel.app",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/api/v1", commentRoute);
app.use(errorMiddlewire);
//listen
app.listen(process.env.PORT, () => {
  connectDB();

  console.log("Server running at port", process.env.PORT);
});
