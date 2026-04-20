"use client";
import { useEffect } from "react";

export default function SectionObserver() {
  useEffect(() => {
    const selectors = [".reveal", ".reveal-left", ".reveal-right", ".reveal-scale", ".reveal-children"];
    const els = document.querySelectorAll(selectors.join(","));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // Don't unobserve — allows re-trigger if user scrolls back
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
