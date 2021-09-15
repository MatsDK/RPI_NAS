import { Dispatch, useContext, useEffect } from "react";
import { MeContext } from "src/providers/meState";

export const useMeState = (
  newMe: any = false
): { me: any; setMe: Dispatch<any> | undefined } => {
  const { me, setMe } = useContext(MeContext);

  useEffect(() => {
    setMe && newMe !== false && setMe(newMe);
  }, []);

  return { me, setMe };
};
