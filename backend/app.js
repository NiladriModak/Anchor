// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const generate = async () => {
//   const genAI = new GoogleGenerativeAI(
//     "AIzaSyBy3vQ-1rur5TgjK8KA8DfuOKVh-PaCEvA"
//   );
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt =
//     "Classify the sentiment of the following comment as agree, disagree, or neutral please give only one word:\n\nComment: 'neutral'\nSentiment:";

//   const result = await model.generateContent(prompt);
//   console.log(result.response.text());
// };
// generate();

// const axios = require("axios");
// async function fetchYouTubeComments(videoId) {
//   const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=AIzaSyCfNFQw_e8Mwtrt5Gm3as8l8WBHM3X-3pY`;
//   try {
//     const response = await axios.get(url);
//     console.log(
//       response.data.items.map((item) => ({
//         commentText: item.snippet.topLevelComment.snippet.textDisplay,
//         author: item.snippet.topLevelComment.snippet.authorDisplayName,
//         publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
//       }))
//     );
//   } catch (error) {
//     console.error("Error fetching comments from YouTube API:", error.message);
//     // throw new Error("Failed to fetch comments from YouTube API");
//   }
// }
// fetchYouTubeComments("yXlC6G54iGk");

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
  origin: "http://localhost:5173",
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
