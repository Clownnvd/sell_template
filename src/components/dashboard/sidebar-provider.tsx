"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface SidebarContextValue {
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isMobileOpen: false,
  openMobile: () => {},
  closeMobile: () => {},
  collapsed: false,
  toggleCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const scrollLockCount = useRef(0);

  const lockScroll = useCallback(() => {
    scrollLockCount.current += 1;
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    scrollLockCount.current = Math.max(0, scrollLockCount.current - 1);
    if (scrollLockCount.current === 0) {
      document.body.style.overflow = "";
    }
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
    lockScroll();
  }, [lockScroll]);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
    unlockScroll();
  }, [unlockScroll]);

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        closeMobile();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen, closeMobile]);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        openMobile,
        closeMobile,
        collapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
