const AI_API_URL = "https://api.openai.com/v1/chat/completions"; // OpenAI Chat API endpoint
const API_KEY = "sbp_7ecb467098a55e10b03979891df031f43172eeeb"; // Replace with your actual OpenAI API key

// Function to generate AI digest
export const generateAIDigest = async (userName, newsletters) => {
  const prompt = createPrompt(userName, newsletters);

  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`, // Include API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Specify the model you want to use
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500, // Adjust token limit as necessary
      }),
    });

    if (!response.ok) {
      throw new Error("Error generating AI digest");
    }

    const { choices } = await response.json();
    return choices[0].message.content; // Extract and return the generated digest
  } catch (error) {
    console.error("Error calling AI service:", error);
    throw error;
  }
};

// Helper function to create the prompt for AI
const createPrompt = (userName, newsletters) => {
  let prompt = `Generate a personalized newsletter digest for ${userName}. Here are the newsletters:\n\n`;

  newsletters.forEach((newsletter) => {
    prompt += `- ${newsletter.title} (${newsletter.category}):\n`;
    newsletter.articles.forEach((article) => {
      prompt += `  * ${article.title} by ${article.author} on ${new Date(
        article.pubDate
      ).toLocaleDateString()}\n`;
    });
    prompt += "\n";
  });

  prompt += `Please provide a friendly and engaging digest summarizing the articles.\n`;

  return prompt;
};
