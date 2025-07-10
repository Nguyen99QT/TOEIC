/**
 * ================================================================
 * BREADCRUMB HOOK
 * ================================================================
 *
 * Custom hook to generate breadcrumb items based on current route
 */

import { useLocation } from "react-router-dom";
import { BreadcrumbItem } from "../components/ui/Breadcrumb";

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    dynamic?: boolean;
  };
}

// Configuration for breadcrumb labels
const breadcrumbConfig: BreadcrumbConfig = {
  dashboard: { label: "Dashboard" },
  lessons: { label: "Lessons" },
  exercises: { label: "Exercises" },
  flashcards: { label: "Flashcards" },
  profile: { label: "Profile" },
  settings: { label: "Settings" },
  admin: { label: "Admin" },
  users: { label: "User Management" },
  content: { label: "Content Management" },
  questions: { label: "Questions" },
  study: { label: "Study" },
  auth: { label: "Authentication" },
  login: { label: "Login" },
  register: { label: "Register" },
  pricing: { label: "Pricing" },
  "upgrade-premium": { label: "Upgrade Premium" },
  sets: { label: "Sets" },
};

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const location = useLocation();

  // Get path segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) {
    return [];
  }

  const breadcrumbItems: BreadcrumbItem[] = [];
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    // Check if this is a dynamic parameter (ID)
    const isId = /^\d+$/.test(segment);

    let label = "";

    if (isId) {
      // Handle dynamic IDs
      const prevSegment = pathSegments[index - 1];
      if (prevSegment === "lessons") {
        label = `Lesson ${segment}`;
      } else if (prevSegment === "exercises") {
        label = `Exercise ${segment}`;
      } else if (
        prevSegment === "flashcards" ||
        (prevSegment === "study" && pathSegments[index - 2] === "flashcards")
      ) {
        label = `Set ${segment}`;
      } else {
        label = `Item ${segment}`;
      }
    } else {
      // Use configured label or capitalize segment
      label =
        breadcrumbConfig[segment]?.label ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
    }

    breadcrumbItems.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast,
    });
  });

  return breadcrumbItems;
};

// Helper function to manually create breadcrumbs for complex scenarios
export const createBreadcrumbs = (
  items: Partial<BreadcrumbItem>[]
): BreadcrumbItem[] => {
  return items.map((item, index) => ({
    label: item.label || "Unknown",
    href: item.href,
    current: index === items.length - 1,
  }));
};
