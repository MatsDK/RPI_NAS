import { useEffect, useRef } from "react";

export const useDropdown = (ref: any, cb: (e: any) => void) => {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = (e: any) => {
      if (ref.current == null || ref.current.contains(e.target)) return;
      cb(e);
    };
  }, [cb]);

  useEffect(() => {
    const handler = (e) => (cbRef.current as any)(e);
    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, [ref]);
};
