import { useState } from "react";


export const usePagination = (len: number) => {
  const [pageIndex, setPageIndex] = useState<number>(0);

    const PreviousPage = () => {
        setPageIndex((idx) => {
          const prev = idx - 100;
          if (prev < -1) {
            return 0;
          }
          return prev;
        });
      }
    
      const NextPage = () => {
        setPageIndex((idx: number) => {
          const next = idx + 100
          if (next >= len) {
            return len;
          }
          return next;
        });
      }

    return {pageIndex, setPageIndex, PreviousPage, NextPage};
}