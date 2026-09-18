"use client";

import { createContext, useContext, useCallback } from "react";
import { toast } from "sonner";

const DonateCtx = createContext({ open: () => {} });

export function useDonate() {
  return useContext(DonateCtx);
}

export default function DonateProvider({ children }) {
  const open = useCallback(() => {
    toast.info("Online donations are coming soon.");
  }, []);

  return <DonateCtx.Provider value={{ open }}>{children}</DonateCtx.Provider>;
}
