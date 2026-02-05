"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface SidebarContextValue {
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
  showPlans: boolean;
  openPlans: () => void;
  closePlans: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isMobileOpen: false,
  openMobile: () => {},
  closeMobile: () => {},
  collapsed: false,
  toggleCollapsed: () => {},
  showPlans: false,
  openPlans: () => {},
  closePlans: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  // Counter-based scroll lock to handle overlapping overlays
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

  const openPlans = useCallback(() => {
    setShowPlans(true);
    lockScroll();
  }, [lockScroll]);

  const closePlans = useCallback(() => {
    setShowPlans(false);
    unlockScroll();
  }, [unlockScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPlans) {
          closePlans();
        } else if (isMobileOpen) {
          closeMobile();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen, showPlans, closeMobile, closePlans]);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        openMobile,
        closeMobile,
        collapsed,
        toggleCollapsed,
        showPlans,
        openPlans,
        closePlans,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
