import { ChangeEvent, useState } from "react";

type useInputReturnType<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void];

export const useInput = <T>(initialValue: T): useInputReturnType<T> => {
  const [state, setState] = useState<T>(initialValue);

  const setStateFunction = (e: ChangeEvent<HTMLInputElement>) =>
    setState(e.target.value as any);

  return [state, setStateFunction];
};
