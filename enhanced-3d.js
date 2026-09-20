/* Enhanced effects are intentionally disabled in the static build. The main runtime is
   self-contained so the site does not fail when GSAP or ScrollTrigger is unavailable. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced-motion');
})();
