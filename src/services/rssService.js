import { supabase } from "../supabaseClient";

// Helper function to clean HTML content
const stripHtml = (html) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Helper function to process content through AI
const processWithAI = async (content, userPrefs) => {
  try {
    const prompt = `
      You are a friendly and casual newsletter curator. Your job is to take these articles and create a warm, engaging digest that reads like a conversation between friends.
      User's name: ${userPrefs?.name || "Reader"}
      User's interests: ${
        userPrefs?.interests?.join(", ") || "a variety of topics"
      }
      Tone: Friendly, relatable, and engaging
      Content length: ${userPrefs?.content_length || "medium"}

      Articles to process:
      ${JSON.stringify(content, null, 2)}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly newsletter curator who turns formal articles into fun, conversational content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from OpenAI API:", errorData);
      throw new Error("Failed to generate digest from AI."); // Custom error for digest failure
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error processing content with AI:", error);
    return null; // Return null if there’s an error
  }
};

// Helper function to delete inactive Substack
const deleteInactiveSubstack = async (id) => {
  try {
    const { error } = await supabase.from("substacks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting substack:", error);
      throw error; // Throw error if deletion fails
    }
    console.log(`Deleted substack ${id} due to insufficient articles`);
  } catch (err) {
    console.error("Failed to delete inactive substack:", err);
  }
};

// Function to get user preferences
export const getUserPreferences = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userPrefs, error } = await supabase
      .from("users")
      .select("name, interests, frequency, content_length")
      .eq("email", user.email)
      .single();

    if (error) throw error;
    return userPrefs;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
};

// Main RSS fetching function with support for interests
const fetchRSSFeed = async (url, id) => {
  try {
    const rssUrl = url.endsWith("/feed") ? url : `${url}/feed`;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      rssUrl
    )}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (data.status !== "ok") {
      console.log(`Invalid RSS feed for ${url}`);
      await deleteInactiveSubstack(id);
      return null;
    }

    if (!data.items || data.items.length < 5) {
      console.log(
        `Insufficient articles (${data.items?.length || 0}) for ${url}`
      );
      await deleteInactiveSubstack(id);
      return null;
    }

    const cleanItems = data.items
      .map((item) => ({
        title: stripHtml(item.title),
        link: item.link,
        description: stripHtml(item.description),
        fullDescription: item.description,
        pubDate: new Date(item.pubDate).toISOString(),
        author: item.author || data.feed.title,
        categories: item.categories || [],
        thumbnail: item.thumbnail || null,
      }))
      .filter((item) => item.title && item.description);

    if (cleanItems.length < 5) {
      console.log(`Insufficient valid articles after cleaning for ${url}`);
      await deleteInactiveSubstack(id);
      return null;
    }

    return {
      feedTitle: data.feed.title,
      feedDescription: data.feed.description,
      feedUrl: data.feed.link,
      feedImage: data.feed.image,
      items: cleanItems,
      lastBuildDate: data.feed.lastBuildDate,
    };
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    await deleteInactiveSubstack(id);
    return null;
  }
};

// Fallback digest generation if AI processing fails
const generateTraditionalDigest = (newsletters, userPrefs) => {
  const userName = userPrefs?.name?.split(" ")[0] || "there";
  const contentLength = userPrefs?.content_length || "medium";
  const descriptionLength =
    contentLength === "short" ? 100 : contentLength === "long" ? 300 : 200;

  let digest = `👋 Hey ${userName}!\n\n`;
  digest += `Here’s your personalized newsletter digest, specially curated just for you! We've picked out some great reads on topics that spark your interest in ${
    userPrefs?.interests?.join(", ") || "a variety of things"
  }.\n\n`;

  newsletters.forEach((newsletter, index) => {
    digest += `📚 **${newsletter.title}** (${newsletter.category})\n`;

    newsletter.articles.slice(0, 5).forEach((article, artIndex) => {
      const formattedDate = new Date(article.pubDate).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

      digest += `\n${artIndex + 1}. **${article.title}**\n`;
      digest += `${article.description.slice(0, descriptionLength)}...\n`;
      digest += `✍️ By ${article.author} on ${formattedDate}\n`;
      digest += `🔗 [Read more](${article.link})\n`;
    });

    if (index < newsletters.length - 1) {
      digest += `\n---\n\n`;
    }
  });

  digest += `\nHope you enjoy these reads! 📖✨\n\n`;
  digest += `Just a friendly reminder: This digest is tailored to your ${contentLength}-form preference, so you can look forward to updates ${
    userPrefs?.frequency || "whenever we have great stuff!"
  }.`;

  return digest;
};

// Modified main function to fetch newsletters
export const fetchNewsletters = async () => {
  try {
    const userPrefs = await getUserPreferences();
    const interests = userPrefs?.interests || [];

    let query = supabase
      .from("substacks")
      .select("*")
      .order("id", { ascending: false });

    if (interests.length > 0) {
      const interestFilters = interests.map(
        (interest) => `category.ilike.%${interest}%`
      );
      query = query.or(interestFilters.join(","));
    }

    const { data: substacks, error } = await query.limit(15);

    if (error) throw error;

    const processedSubstacks = [];
    const deletedSubstacks = [];

    // Process substacks based on interests
    for (const interest of interests) {
      const interestSubstacks = substacks.filter((s) =>
        s.category.toLowerCase().includes(interest.toLowerCase())
      );

      for (const substack of interestSubstacks) {
        if (
          processedSubstacks.some((ps) => ps.category === substack.category)
        ) {
          continue; // Skip if already processed
        }

        const feedData = await fetchRSSFeed(substack.url, substack.id);
        if (feedData) {
          processedSubstacks.push({
            id: substack.id,
            title: feedData.feedTitle || substack.title,
            url: substack.url,
            category: substack.category,
            articles: feedData.items.slice(0, 5),
            lastBuildDate: feedData.lastBuildDate,
            feedImage: feedData.feedImage,
          });

          if (processedSubstacks.length === 5) break; // Limit to 5 processed substacks
        } else {
          deletedSubstacks.push(substack.id);
        }
      }

      if (processedSubstacks.length === 5) break;
    }

    // Fill remaining slots if needed
    if (processedSubstacks.length < 5) {
      for (const substack of substacks) {
        if (processedSubstacks.some((ps) => ps.id === substack.id)) continue;

        const feedData = await fetchRSSFeed(substack.url, substack.id);
        if (feedData) {
          processedSubstacks.push({
            id: substack.id,
            title: feedData.feedTitle || substack.title,
            url: substack.url,
            category: substack.category,
            articles: feedData.items.slice(0, 5),
            lastBuildDate: feedData.lastBuildDate,
            feedImage: feedData.feedImage,
          });

          if (processedSubstacks.length === 5) break; // Limit to 5 processed substacks
        } else {
          deletedSubstacks.push(substack.id);
        }
      }
    }

    // Process the digest with AI or fallback
    let digest = await processWithAI(processedSubstacks, userPrefs);
    if (!digest) {
      digest = generateTraditionalDigest(processedSubstacks, userPrefs);
    }

    return {
      newsletters: processedSubstacks,
      digest,
    };
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return {
      newsletters: [],
      digest:
        "Sorry, we couldn't generate a digest at this time. But don't worry, we're always here to help you find great content!", // Fallback message
    };
  }
};
