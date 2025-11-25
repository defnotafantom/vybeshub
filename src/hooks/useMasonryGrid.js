import { useEffect, useRef } from "react";

/**
 * Hook per gestire automaticamente il masonry con grid-auto-rows.
 * @param {Array} deps - dipendenze per ri-triggerare il calcolo (di solito [posts])
 */
export default function useMasonryGrid(deps = []) {
  const gridRef = useRef(null);
  const itemRefs = useRef({});

  const resizeAll = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('gap')) || 16;

    Object.keys(itemRefs.current).forEach(key => {
      const el = itemRefs.current[key];
      if (!el) return;
      const content = el.querySelector('.masonry-content');
      const contentHeight = content ? content.getBoundingClientRect().height : el.getBoundingClientRect().height;
      const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
      el.style.gridRowEnd = `span ${rowSpan}`;
    });
  };

  useEffect(() => {
    const imgs = gridRef.current?.querySelectorAll('img') ?? [];
    let loaded = 0;

    const handleResize = () => resizeAll();

    if (imgs.length === 0) {
      resizeAll();
    } else {
      imgs.forEach(img => {
        if (img.complete) {
          loaded++;
          if (loaded === imgs.length) resizeAll();
        } else {
          img.addEventListener('load', () => {
            loaded++;
            if (loaded === imgs.length) resizeAll();
          });
          img.addEventListener('error', () => {
            loaded++;
            if (loaded === imgs.length) resizeAll();
          });
        }
      });
    }

    window.addEventListener('resize', handleResize);
    const t = setTimeout(resizeAll, 120); // fallback per font/caricamenti lenti

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t);
    };
  }, deps);

  return { gridRef, itemRefs, resizeAll };
}
