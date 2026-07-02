"use client";

import { useEffect } from "react";

/**
 * Forces the page to open at the top. Without this, the browser restores the
 * previous scroll position on reload (or jumps to a leftover #hash from the
 * hero buttons), which drops returning visitors into the middle of the
 * results instead of the intro.
 */
export function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
