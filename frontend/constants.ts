import type { Feed, Article, Folder } from "./types";

export const ALL_ARTICLES_VIEW_ID = "all-articles-view";

const MOCK_FOLDERS_DATA: Folder[] = [
  { id: "folder-1", name: "Tech News" },
  { id: "folder-2", name: "Web Development" },
];

const MOCK_FEEDS_DATA: Feed[] = [
  {
    id: "feed-1",
    title: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    link: "https://techcrunch.com",
    description: "Startup and Technology News",
    favicon:
      "https://techcrunch.com/wp-content/uploads/2015/02/tc_favicon.ico?w=32",
    lastFetched: new Date().toISOString(),
    folderId: "folder-1",
  },
  {
    id: "feed-2",
    title: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    link: "https://www.theverge.com",
    description: "Technology, science, art, and culture.",
    favicon:
      "https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395351/ operés_favicon.0.ico",
    lastFetched: new Date().toISOString(),
    folderId: "folder-1",
  },
  {
    id: "feed-3",
    title: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    link: "https://www.smashingmagazine.com",
    description: "For web designers and developers.",
    favicon: "https://www.smashingmagazine.com/images/favicon/favicon.svg",
    lastFetched: new Date().toISOString(),
    folderId: "folder-2",
  },
  {
    id: "feed-4",
    title: "Hacker News",
    url: "https://news.ycombinator.com/rss",
    link: "https://news.ycombinator.com/",
    description: "Computer science and entrepreneurship.",
    favicon: "https://news.ycombinator.com/favicon.ico",
    lastFetched: new Date().toISOString(),
    folderId: null, // Ungrouped
  },
];

const MOCK_ARTICLES_DATA: { [feedId: string]: Article[] } = {
  "feed-1": [
    {
      id: "tc-article-1",
      feedId: "feed-1",
      feedTitle: "TechCrunch",
      title: "Revolutionary AI Model Released by OmniCorp",
      link: "https://techcrunch.com/2024/07/29/omnicorp-ai-model/",
      pubDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      contentSnippet:
        'OmniCorp today announced the release of its groundbreaking AI model, "Prometheus," set to redefine natural language processing capabilities...',
      content: `
        <div class="prose dark:prose-invert max-w-none">
          <img src="https://picsum.photos/800/400?random=1" alt="AI Abstract" class="rounded-lg mb-4" />
          <h1>Revolutionary AI Model Released by OmniCorp</h1>
          <p class="text-gray-500 dark:text-gray-400">Published on ${new Date(
            Date.now() - 1 * 60 * 60 * 1000
          ).toLocaleDateString()}</p>
          <p>OmniCorp today announced the release of its groundbreaking AI model, "Prometheus," set to redefine natural language processing capabilities. The model boasts an unprecedented number of parameters and has shown remarkable performance in various benchmarks, outperforming existing state-of-the-art models.</p>
          <p>Key features of Prometheus include:</p>
          <ul>
            <li>Enhanced contextual understanding</li>
            <li>Improved multilingual support</li>
            <li>Reduced bias in outputs</li>
            <li>More efficient processing on standard hardware</li>
          </ul>
          <p>Experts believe this could accelerate AI adoption across industries, from healthcare to finance. "This is a significant leap forward," said Dr. Elena Vance, a leading AI researcher. "The potential applications are immense."</p>
          <a href="https://techcrunch.com/2024/07/29/omnicorp-ai-model/" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-primary-dark hover:underline">Read more on TechCrunch</a>
        </div>
      `,
      author: "Jane Doe",
      isRead: false,
      imageUrl: "https://picsum.photos/200/100?random=1",
    },
    {
      id: "tc-article-2",
      feedId: "feed-1",
      feedTitle: "TechCrunch",
      title: "Quantum Computing Startup Raises $50M Series B",
      link: "https://techcrunch.com/2024/07/28/quantum-startup-funding/",
      pubDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      contentSnippet:
        "QuantumLeap, a startup specializing in quantum algorithm development, has successfully closed a $50 million Series B funding round led by Future Ventures...",
      content: `
        <div class="prose dark:prose-invert max-w-none">
          <img src="https://picsum.photos/800/400?random=2" alt="Quantum Computing Abstract" class="rounded-lg mb-4" />
          <h1>Quantum Computing Startup Raises $50M Series B</h1>
          <p class="text-gray-500 dark:text-gray-400">Published on ${new Date(
            Date.now() - 5 * 60 * 60 * 1000
          ).toLocaleDateString()}</p>
          <p>QuantumLeap, a startup specializing in quantum algorithm development, has successfully closed a $50 million Series B funding round led by Future Ventures. The funds will be used to expand their research team and build a new quantum lab.</p>
          <p>"We are thrilled to have the support of Future Ventures as we push the boundaries of quantum computation," said CEO Dr. Alex Chen. The company aims to solve complex problems currently intractable for classical computers.</p>
          <a href="https://techcrunch.com/2024/07/28/quantum-startup-funding/" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-primary-dark hover:underline">Read more on TechCrunch</a>
        </div>
      `,
      author: "John Smith",
      isRead: true,
      imageUrl: "https://picsum.photos/200/100?random=2",
    },
  ],
  "feed-2": [
    {
      id: "verge-article-1",
      feedId: "feed-2",
      feedTitle: "The Verge",
      title: "The Future of Foldable Phones: What to Expect",
      link: "https://www.theverge.com/2024/07/29/foldable-phones-future/",
      pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      contentSnippet:
        "Foldable phones have moved from novelty to a mature category. We explore the latest innovations and what the next generation might bring, from rollable screens to new form factors...",
      content: `
        <div class="prose dark:prose-invert max-w-none">
          <h1>The Future of Foldable Phones: What to Expect</h1>
          <p>Foldable phones have moved from novelty to a mature category. We explore the latest innovations and what the next generation might bring, from rollable screens to new form factors. Durability and price remain key challenges, but the technology is rapidly evolving.</p>
          <p>Samsung, Google, and OnePlus are all pushing the boundaries. What will Apple do?</p>
          <a href="https://www.theverge.com/2024/07/29/foldable-phones-future/" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-primary-dark hover:underline">Read more on The Verge</a>
        </div>
      `,
      author: "Nilay Patel",
      isRead: false,
      imageUrl: "https://picsum.photos/200/100?random=3",
    },
  ],
  "feed-3": [
    {
      id: "smashing-article-1",
      feedId: "feed-3",
      feedTitle: "Smashing Magazine",
      title: "Mastering Modern CSS Layouts: Grid vs. Flexbox",
      link: "https://www.smashingmagazine.com/2024/07/css-grid-flexbox-layouts/",
      pubDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
      contentSnippet:
        "A deep dive into CSS Grid and Flexbox, exploring their strengths, weaknesses, and when to use each for creating responsive and complex web layouts. Includes practical examples and best practices...",
      content: `
        <div class="prose dark:prose-invert max-w-none">
          <h1>Mastering Modern CSS Layouts: Grid vs. Flexbox</h1>
          <p>A deep dive into CSS Grid and Flexbox, exploring their strengths, weaknesses, and when to use each for creating responsive and complex web layouts. Includes practical examples and best practices. Understand how to combine them effectively for optimal results.</p>
          <a href="https://www.smashingmagazine.com/2024/07/css-grid-flexbox-layouts/" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-primary-dark hover:underline">Read more on Smashing Magazine</a>
        </div>
      `,
      author: "Rachel Andrew",
      isRead: false,
      imageUrl: "https://picsum.photos/200/100?random=4",
    },
    {
      id: "smashing-article-2",
      feedId: "feed-3",
      feedTitle: "Smashing Magazine",
      title: "Ethical Design in UI/UX: A Practical Guide",
      link: "https://www.smashingmagazine.com/2024/07/ethical-design-ui-ux-guide/",
      pubDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      contentSnippet:
        "Exploring the principles of ethical design and how to apply them in your UI/UX projects. This guide covers user privacy, dark patterns, accessibility, and creating inclusive digital experiences...",
      content: `
        <div class="prose dark:prose-invert max-w-none">
          <h1>Ethical Design in UI/UX: A Practical Guide</h1>
          <p>Exploring the principles of ethical design and how to apply them in your UI/UX projects. This guide covers user privacy, dark patterns, accessibility, and creating inclusive digital experiences. Learn how to build products that respect users and contribute positively to society.</p>
          <a href="https://www.smashingmagazine.com/2024/07/ethical-design-ui-ux-guide/" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-primary-dark hover:underline">Read more on Smashing Magazine</a>
        </div>
      `,
      author: "Tristan Harris (Guest Author)",
      isRead: true,
      imageUrl: "https://picsum.photos/200/100?random=5",
    },
  ],
  "feed-4": [
    {
      id: "hn-article-1",
      feedId: "feed-4",
      feedTitle: "Hacker News",
      title: "Show HN: My new open source project",
      link: "https://news.ycombinator.com/item?id=123456",
      pubDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      contentSnippet:
        "I built this cool thing, check it out! It does X, Y, and Z. Looking for feedback.",
      content:
        "<p>I built this cool thing, check it out! It does X, Y, and Z. Looking for feedback.</p>",
      isRead: false,
    },
  ],
};

// Simulate fetching all feeds for a user
export const getMockFeeds = (): Promise<Feed[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(MOCK_FEEDS_DATA))); // Deep copy
    }, 500);
  });
};

// Simulate fetching articles for a specific feed
export const getMockArticlesForFeed = (feedId: string): Promise<Article[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const articles = MOCK_ARTICLES_DATA[feedId];
      if (articles) {
        resolve(
          JSON.parse(
            JSON.stringify(
              articles.map(a => ({
                ...a,
                feedId,
                feedTitle: MOCK_FEEDS_DATA.find(f => f.id === feedId)?.title,
              }))
            )
          )
        ); // Deep copy and ensure feedTitle
      } else {
        // Simulate case where a feed might exist but has no articles (or an error fetching them)
        if (MOCK_FEEDS_DATA.find(f => f.id === feedId)) {
          resolve([]); // Feed exists, but no articles for it in mock data
        } else {
          reject(new Error(`Feed with id ${feedId} not found.`));
        }
      }
    }, 700);
  });
};

// Simulate adding a new feed
export const addMockFeed = (
  url: string,
  folderId?: string | null
): Promise<Feed> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!url.startsWith("http")) {
        reject(new Error("Invalid URL format."));
        return;
      }
      const newFeedId = `feed-${Date.now()}`;
      const newFeed: Feed = {
        id: newFeedId,
        title: `New Feed: ${url.split("/")[2] || "Untitled"}`, // Basic title from URL
        url: url,
        link: url,
        description: "A newly added feed. Description will be fetched later.",
        favicon: `https://www.google.com/s2/favicons?domain=${
          url.split("/")[2]
        }&sz=32`,
        lastFetched: new Date().toISOString(),
        folderId: folderId || null,
      };
      MOCK_FEEDS_DATA.push(newFeed);
      MOCK_ARTICLES_DATA[newFeedId] = [
        // Add some placeholder articles
        {
          id: `article-${Date.now()}`,
          feedId: newFeedId,
          feedTitle: newFeed.title,
          title: "Sample Article 1 for New Feed",
          link: "#",
          pubDate: new Date().toISOString(),
          contentSnippet:
            "This is a sample article automatically generated for the new feed.",
          content:
            "<p>This is a sample article automatically generated for the new feed.</p>",
          isRead: false,
        },
        {
          id: `article-${Date.now() + 1}`,
          feedId: newFeedId,
          feedTitle: newFeed.title,
          title: "Sample Article 2 for New Feed",
          link: "#",
          pubDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          contentSnippet: "Another sample article to demonstrate content.",
          content:
            "<p>Another sample article to demonstrate content. <strong>Important stuff here.</strong></p>",
          isRead: false,
        },
      ];
      resolve(JSON.parse(JSON.stringify(newFeed)));
    }, 1000);
  });
};

// Simulate deleting a feed
export const deleteMockFeed = (feedId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_FEEDS_DATA.findIndex(feed => feed.id === feedId);
      if (index > -1) {
        MOCK_FEEDS_DATA.splice(index, 1);
        delete MOCK_ARTICLES_DATA[feedId];
        resolve();
      } else {
        reject(new Error("Feed not found."));
      }
    }, 300);
  });
};

// Folder Mock Functions
export const getMockFolders = (): Promise<Folder[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(MOCK_FOLDERS_DATA)));
    }, 300);
  });
};

export const addMockFolder = (name: string): Promise<Folder> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name,
      };
      MOCK_FOLDERS_DATA.push(newFolder);
      resolve(JSON.parse(JSON.stringify(newFolder)));
    }, 500);
  });
};

export const updateMockFolder = (
  folderId: string,
  newName: string
): Promise<Folder> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const folderIndex = MOCK_FOLDERS_DATA.findIndex(f => f.id === folderId);
      if (folderIndex > -1) {
        MOCK_FOLDERS_DATA[folderIndex].name = newName;
        resolve(JSON.parse(JSON.stringify(MOCK_FOLDERS_DATA[folderIndex])));
      } else {
        reject(new Error("Folder not found."));
      }
    }, 500);
  });
};

export const deleteMockFolder = (folderId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const folderIndex = MOCK_FOLDERS_DATA.findIndex(f => f.id === folderId);
      if (folderIndex > -1) {
        MOCK_FOLDERS_DATA.splice(folderIndex, 1);
        // Update feeds that were in this folder
        MOCK_FEEDS_DATA.forEach(feed => {
          if (feed.folderId === folderId) {
            feed.folderId = null;
          }
        });
        resolve();
      } else {
        reject(new Error("Folder not found."));
      }
    }, 300);
  });
};

export const moveMockFeedToFolder = (
  feedId: string,
  folderId: string | null
): Promise<Feed> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const feedIndex = MOCK_FEEDS_DATA.findIndex(f => f.id === feedId);
      if (feedIndex > -1) {
        if (
          folderId &&
          !MOCK_FOLDERS_DATA.find(folder => folder.id === folderId)
        ) {
          reject(new Error("Target folder not found."));
          return;
        }
        MOCK_FEEDS_DATA[feedIndex].folderId = folderId;
        resolve(JSON.parse(JSON.stringify(MOCK_FEEDS_DATA[feedIndex])));
      } else {
        reject(new Error("Feed not found."));
      }
    }, 300);
  });
};
