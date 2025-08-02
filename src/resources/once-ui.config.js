import { home } from "./content";

// Base URL for SEO, OG tags, Canonical URLs
export const baseURL = "https://praneon.com";

// Publicly accessible routes for sitemap & navigation
export const routes = {
  "/": true,
  "/about": true,
  "/work": true,
  "/blog": true,
  "/gallery": true,
};

// Global Display Toggles
export const display = {
  location: true,
  time: true,
  themeSwitcher: true,
};

// Password-protected Routes (Optional)
export const protectedRoutes = {
  "/work/automate-design-handovers-with-a-figma-to-code-pipeline": true,
};

// Fonts Configuration — Now mapped to Surgena via CSS Variables
export const fonts = {
  heading: { variable: "--font-heading" },
  body: { variable: "--font-body" },
  label: { variable: "--font-label" },
  code: { variable: "--font-code" }, // Optional: Keep Geist_Mono if you want monospace; else map to Surgena too
};

// Global Style Tokens (Once UI Design Tokens)
export const style = {
  theme: "system",
  neutral: "gray",
  brand: "green",
  accent: "green",
  solid: "color",
  solidStyle: "flat",
  border: "playful",
  surface: "translucent",
  transition: "all",
  scaling: "100",
};

// Data Visualization Style
export const dataStyle = {
  variant: "gradient",
  mode: "categorical",
  height: 24,
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

// Design Effects (For background visuals like gradients, dots, etc.)
export const effects = {
  mask: {
    cursor: true,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: true,
    opacity: 90,
    x: 50,
    y: 0,
    width: 50,
    height: 50,
    tilt: 0,
    colorStart: "accent-background-strong",
    colorEnd: "static-transparent",
  },
  dots: {
    display: true,
    opacity: 20,
    size: "2",
    color: "brand-on-background-weak",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    size: "16",
    thickness: 1,
    angle: 90,
  },
};

// Mailchimp config (effects are used for styling subscription section)
export const mailchimp = {
  effects,
};

// SEO Schema Details (JSON-LD Schema.org)
export const schema = {
  logo: "trademarks/praneon.svg", // Updated logo path
  type: "Organization",
  name: "Praneon",
  description: home.description,
  email: "vishal@praneon.com",
};

// Social Profiles for schema.org sameAs
export const sameAs = {
  linkedin: "https://www.linkedin.com/company/praneon/",
};

// Final Export
export {
  display,
  mailchimp,
  routes,
  protectedRoutes,
  baseURL,
  fonts,
  style,
  schema,
  sameAs,
  effects,
  dataStyle,
};
