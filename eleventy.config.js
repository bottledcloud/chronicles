import rssPlugin from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // All posts, newest first
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => b.date - a.date)
  );

  // Posts grouped by year for the chronicle page
  eleventyConfig.addCollection("postsByYear", (api) => {
    const posts = api
      .getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => b.date - a.date);
    const years = new Map();
    for (const post of posts) {
      const y = post.date.getFullYear();
      if (!years.has(y)) years.set(y, []);
      years.get(y).push(post);
    }
    return [...years.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, items]) => ({ year, items }));
  });

  // dd.mm stamp for the archive list
  eleventyConfig.addFilter("stamp", (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}`;
  });

  eleventyConfig.addFilter("dm", (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}`;
  });

  // 25 · 07 · 2020 style for post headers
  eleventyConfig.addFilter("dmy", (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd} · ${mm} · ${d.getFullYear()}`;
  });

  // RFC3339 dates for feed + sitemap
  eleventyConfig.addFilter("rfc3339", (d) => new Date(d).toISOString());

  // Plain-text excerpt for cards and meta descriptions
  eleventyConfig.addFilter("excerpt", (content, len = 200) => {
    const text = String(content)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > len ? text.slice(0, len).trimEnd() + "…" : text;
  });

  // Reading time (returns a number; templates append "min read")
  eleventyConfig.addFilter("readTime", (content) => {
    const words = String(content).replace(/<[^>]+>/g, " ").split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  });

  // Deterministic pick: hash a string to 0..(n-1), for per-post generative art
  eleventyConfig.addFilter("pick", (str, n) => {
    let h = 0;
    for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h % n;
  });

  eleventyConfig.addFilter("head", (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : arr));

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/chronicles/",
  };
}
