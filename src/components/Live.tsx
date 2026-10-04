"use client";

import { useSyncExternalStore } from "react";
import { careerStart } from "@/data/resume";
import { roleDuration, yearsSince } from "@/lib/dates";

// The site is static, so anything computed at build time goes stale until the
// next deploy. These render the build-time value into the HTML (so the page
// reads correctly without JavaScript), then recompute from the visitor's
// current date as soon as the page hydrates.
const noopSubscribe = () => () => {};
const buildTime = new Date();

function useToday<T>(compute: (now: Date) => T): T {
  return useSyncExternalStore(
    noopSubscribe,
    () => compute(new Date()),
    () => compute(buildTime),
  );
}

/** Whole years since the first professional role, e.g. 4. */
export function YearsOfExperience() {
  return <>{useToday((now) => yearsSince(careerStart, now))}</>;
}

export function RoleDuration({ start, end }: { start: string; end: string | null }) {
  return <>{useToday((now) => roleDuration(start, end, now))}</>;
}

export function CurrentYear() {
  return <>{useToday((now) => now.getFullYear())}</>;
}
