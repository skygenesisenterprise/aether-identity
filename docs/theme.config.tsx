import React from "react";

export default {
  logo: <span>Aether Identity Documentation</span>,
  project: {
    link: "https://github.com/skygenesisenterprise/aether-identity",
  },
  chat: {
    link: "https://github.com/skygenesisenterprise/aether-identity/discussions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
  },
  docsRepositoryBase: "https://github.com/skygenesisenterprise/aether-identity/blob/main/docs",
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://github.com/skygenesisenterprise/aether-identity" target="_blank">
          Aether Identity
        </a>
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Aether Identity Documentation" />
      <meta name="og:title" content="Aether Identity Documentation" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Aether Identity",
    };
  },
  navigation: {
    prev: true,
    next: true,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  darkMode: true,
  primaryHue: 210,
};
