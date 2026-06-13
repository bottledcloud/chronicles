// Applies to every post: layout + WordPress-style permalinks (/yyyy/mm/dd/slug/)
// so existing links to your old posts keep working on a custom domain.
export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink: (data) => {
      const d = data.page.date;
      const p = (n) => String(n).padStart(2, "0");
      return `/${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}/${data.page.fileSlug}/`;
    },
  },
};
