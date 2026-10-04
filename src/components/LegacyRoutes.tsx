"use client";

import { useEffect, useState } from "react";
import styles from "./LegacyRoutes.module.css";

// The previous portfolio used hash routing (#/projects, #/api/v1/details, ...).
// Keep those shared links working by mapping them onto the new page.
const sectionFor: Record<string, string> = {
  "#/projects": "work",
  "#/aboutme": "top",
  "#/contacts": "contact",
};

export function LegacyRoutes() {
  const [details, setDetails] = useState<string | null>(null);

  useEffect(() => {
    const route = () => {
      const hash = window.location.hash.split("?")[0];
      if (hash === "#/api/v1/details") {
        fetch("/api/v1/details.json")
          .then((r) => r.text())
          .then((t) => setDetails(JSON.stringify(JSON.parse(t), null, 2)))
          .catch(() => setDetails('{\n  "status": "error",\n  "message": "Could not load /api/v1/details.json"\n}'));
        return;
      }
      setDetails(null);
      const id = sectionFor[hash];
      if (id) {
        history.replaceState(null, "", `#${id}`);
        document.getElementById(id)?.scrollIntoView();
      }
    };
    route();
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, []);

  if (details === null) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Raw API response">
      <div className={styles.bar}>
        <code>GET /api/v1/details.json</code>
        <a href="#top" className="btn btn-ghost">
          Back to portfolio
        </a>
      </div>
      <pre className={styles.pre}>{details}</pre>
    </div>
  );
}
