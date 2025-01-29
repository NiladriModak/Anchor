const axios = require("axios");
const CommentModel = require("../model/CommentModel");
const {
  generate,
} = require("../Components/SentimentAnalysis/GenerateAnalysis");
const ErrorHandler = require("../utils/ErrorHandler");

exports.getAllComments = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Missing videoId parameter",
      });
    }

    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${process.env.YOUTUBE_API}`;

    const response = await axios.get(url);

    const comments = await Promise.all(
      response.data.items?.map(async (item) => {
        const commentText = item.snippet.topLevelComment.snippet.textDisplay;
        const author = item.snippet.topLevelComment.snippet.authorDisplayName;
        const publishedAt = item.snippet.topLevelComment.snippet.publishedAt;

        const sentiment = await generate(commentText);

        const savedComment = await CommentModel.create({
          commentText,
          author,
          publishedAt,
          input: videoId,
          sentiment,
        });

        return savedComment;
      })
    );

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments from YouTube API:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments from YouTube API",
    });
  }
};

exports.getTheSentiments = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    // console.log(videoId);
    let agree = 0,
      disagree = 0,
      neutral = 0;
    let monthlyDistribution = {};

    const comments = await CommentModel.find({ input: videoId });

    // if (!comments || comments.length === 0) {
    //   res.status()
    // }

    comments.forEach((item) => {
      const sentiment = item.sentiment.trim();
      const publishedDate = new Date(item.publishedAt);
      const monthYear = `${
        publishedDate.getMonth() + 1
      }-${publishedDate.getFullYear()}`;

      if (sentiment === "Agree") {
        agree++;
      } else if (sentiment === "Disagree") {
        disagree++;
      } else {
        neutral++;
      }

      if (monthlyDistribution[monthYear]) {
        monthlyDistribution[monthYear].total++;
        monthlyDistribution[monthYear][sentiment.toLowerCase()]++;
      } else {
        monthlyDistribution[monthYear] = {
          total: 1,
          agree: sentiment === "Agree" ? 1 : 0,
          disagree: sentiment === "Disagree" ? 1 : 0,
          neutral: sentiment === "Neutral" ? 1 : 0,
        };
      }
    });

    const earliestCommentDate = new Date(
      Math.min(...comments.map((item) => new Date(item.publishedAt)))
    );
    const currentDate = new Date();

    let monthsInRange = [];
    let tempDate = new Date(earliestCommentDate);

    while (tempDate <= currentDate) {
      const monthYear = `${tempDate.getMonth() + 1}-${tempDate.getFullYear()}`;
      if (!monthlyDistribution[monthYear]) {
        monthlyDistribution[monthYear] = {
          total: 0,
          agree: 0,
          disagree: 0,
          neutral: 0,
        };
      }
      monthsInRange.push(monthYear);
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    res.status(200).json({
      success: true,
      sentimentCounts: {
        agree,
        disagree,
        neutral,
        totalComments: agree + disagree + neutral,
      },
      monthlyDistribution,
      monthsInRange,
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sentiments",
    });
  }
};
