"use client";
import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext({ content: {}, loaded: false });

export function useContent(key, fallback = "") {
  const { content, loaded } = useContext(Ctx);
  if (!loaded) return fallback;
  const v = content[key];
  if (v === undefined || v === null || v === "") return fallback;
  return v;
}

// Read a JSON-encoded list field. Always returns an array.
export function useContentList(key, fallback = []) {
  const { content, loaded } = useContext(Ctx);
  if (!loaded) return fallback;
  const v = content[key];
  if (!v) return fallback;
  if (Array.isArray(v)) return v;
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? p : fallback;
  } catch {
    return fallback;
  }
}

export default function ContentProvider({ children, prefix = "" }) {
  const [content, setContent] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const url = prefix
      ? `/api/content?prefix=${encodeURIComponent(prefix)}`
      : "/api/content";

    fetch(url, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => {
        console.log("CONTENT API:", d);
        setContent(d.content || {});
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [prefix]);
  if (!loaded) return null;
  return <Ctx.Provider value={{ content, loaded }}>{children}</Ctx.Provider>;
}
