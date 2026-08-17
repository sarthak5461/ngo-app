"use client";

import { createContext, useContext } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ user, children }) {
  return <AdminContext.Provider value={user}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
