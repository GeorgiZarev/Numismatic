import { useEffect } from "react";

const useProductTitle = (productName) => {
  useEffect(() => {
    const previousTitle = document.title;
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (productName) document.title = `${productName} | Zarev Gold & Coins`;
  }, [productName]);
};

export default useProductTitle;
