const express = require("express");
const {
  getAllComments,
  getTheSentiments,
} = require("../controllers/commentControllers");
const router = express.Router();
router.route("/sentimentAnalysis/:videoId").post(getAllComments);
router.route("/getAnalytics/:videoId").get(getTheSentiments);
module.exports = router;
