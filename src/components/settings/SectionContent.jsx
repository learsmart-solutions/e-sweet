import React from "react";

// Section pages register themselves by living in ./account and ending in
// "Page.jsx". Each page file exports:
//
//   export const sectionKey = "profile";   // matches `key` in sections.js
//   export default ProfilePage;            // the page component
//
// There is no list to edit when a page is added or removed, so pages built
// on separate branches never touch the same lines here.
const pageModules = import.meta.glob("./account/*Page.jsx", { eager: true });

const pagesByKey = Object.values(pageModules).reduce((pages, module) => {
  if (module.sectionKey && module.default) {
    pages[module.sectionKey] = module.default;
  }
  return pages;
}, {});

/**
 * Renders the page for `section`, or `fallback` when no page is registered
 * for it (Settings.jsx passes its "coming soon" panel).
 */
const SectionContent = ({ section, fallback = null }) => {
  const Page = pagesByKey[section.key];
  return Page ? <Page /> : fallback;
};

export default SectionContent;
