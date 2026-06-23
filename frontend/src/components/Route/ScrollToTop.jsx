import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls the window to the top whenever the route changes, so navigating
// (e.g. opening a product) always starts at the top of the new page.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // App.css sets `scroll-behavior: smooth` globally, which would animate the
    // jump; temporarily disable it so each route change lands at the top instantly.
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
