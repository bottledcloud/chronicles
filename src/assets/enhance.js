// Garden enhancements: nav state on scroll + gentle reveal.
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nav = document.querySelector("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (!reduced && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(".entry, .year-mark, .section-label, .featured h2");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    targets.forEach((t) => { t.classList.add("reveal"); io.observe(t); });
  }
})();
