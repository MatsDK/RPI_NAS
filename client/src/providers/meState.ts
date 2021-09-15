import React from "react";

interface MeContext {
  me?: any;
  setMe?: React.Dispatch<React.SetStateAction<any>>;
}

export let meContextValue: MeContext = {};
export const MeContext = React.createContext<MeContext>({});
