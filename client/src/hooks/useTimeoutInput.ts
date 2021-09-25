import { ChangeEvent, useRef } from "react";
import { useInput } from "./useInput";

export const useTimeoutInput = <T>(
  timeout: number,
  initialValue: T,
  cb: (val: T) => any
): [T, (e: ChangeEvent<HTMLInputElement>) => void, () => void] => {
  const [val, setVal] = useInput<T>(initialValue);
  const to = useRef<any>(0);

  const update = (e: ChangeEvent<HTMLInputElement>): void => {
    if (to.current) clearTimeout(to.current);

    to.current = setTimeout(() => {
      cb(e.target.value as any);
    }, timeout);

    setVal(e);
  };

  const clear = () => {
    if (to.current) clearTimeout(to.current);
  };

  return [val, update, clear];
};
