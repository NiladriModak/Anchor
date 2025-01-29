const { GoogleGenerativeAI } = require("@google/generative-ai");
exports.generate = async (commentText) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Classify the sentiment of the following comment as agree, disagree, or neutral please give only one word either of the three:\n\nComment: "${commentText}"\nSentiment:`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log("error from generate sentiment", error);
  }
};
