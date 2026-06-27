const Parser = require("rss-parser");
const { client } = require("../utils/sanityClient");

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
  },
});

const FEEDS = [
  { source: "GST", url: "https://pib.gov.in/RssMain.aspx?ModId=4" },
  { source: "RBI", url: "https://rbi.org.in/rbi.xml" },
  {
    source: "Income Tax",
    url: "https://incometaxindia.gov.in/_layouts/15/corporate/rss.aspx",
  },
];

async function fetchUpdates() {
  console.log("Checking for new government updates...");

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching ${feed.source} updates from: ${feed.url}`);
      const parsedFeed = await parser.parseURL(feed.url);

      let count = 0;
      for (const item of parsedFeed.items.slice(0, 3)) {
        const title = item.title;
        const link = item.link || "";
        const description = item.contentSnippet || item.content || "";
        const publishDate = item.isoDate
          ? item.isoDate.split("T")[0]
          : new Date().toISOString().split("T")[0];

        const exists = await client.fetch(
          '*[_type == "governmentUpdate" && title == $title][0]',
          { title },
        );

        if (!exists) {
          await client.create({
            _type: "governmentUpdate",
            title,
            description,
            source: feed.source,
            link,
            publishDate,
            published: true,
            adminCreated: false,
          });
          count++;
        }
      }

      console.log(`Added ${count} new updates for ${feed.source}`);
    } catch (err) {
      console.warn(
        `Could not fetch real-time updates for ${feed.source}: ${err.message}`,
      );
    }
  }
}

function startScheduler(intervalMs = 60 * 60 * 1000) {
  fetchUpdates().catch((err) =>
    console.error("Error fetching updates on start:", err.message),
  );

  setInterval(() => {
    fetchUpdates().catch((err) =>
      console.error("Error fetching updates in interval:", err.message),
    );
  }, intervalMs);
}

module.exports = {
  fetchUpdates,
  startScheduler,
};
