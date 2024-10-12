import { useEffect, useState } from "react";

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return dimensions;
};
