import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Lenis intercepts window.scrollTo, so this correctly scrolls to top
    // without triggering Lenis dependency loops.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
