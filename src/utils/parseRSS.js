import axios from "axios";
import xml2js from "xml2js";

const parseRSS = async (url) => {
  try {
    const response = await axios.get(url);
    const rssData = await xml2js.parseStringPromise(response.data);

    // Sample extraction: adjust according to actual RSS structure
    const channel = rssData.rss.channel[0];
    const title = channel.title[0];
    const subscribers = channel["subscribers"]
      ? channel["subscribers"][0]
      : "N/A";
    const articles = channel.item.map((article) => ({
      title: article.title[0],
      link: article.link[0],
      pubDate: article.pubDate[0],
    }));

    return { title, subscribers, articles };
  } catch (error) {
    console.error("Error parsing RSS:", error.message);
    return null;
  }
};

export default parseRSS;
