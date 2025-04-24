import { useEffect, useState } from "react";

export const useResponsive = () => {
  const getSizes = () => ({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth > 767 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
  });

  const [sizes, setSizes] = useState(getSizes());

  useEffect(() => {
    const onResize = () => setSizes(getSizes());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return sizes; // { isMobile, isTablet, isDesktop }
};
