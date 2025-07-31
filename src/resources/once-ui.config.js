import { home } from "./content";

// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = "https://praneon.com";

const routes = {
  "/": true,
  "/about": true,
  "/work": true,
  "/blog": true,
  "/gallery": true,
};

const display = {
  location: true,
  time: true,
  themeSwitcher: true
};

// Enable password protection on selected routes
// Set password in the .env file, refer to .env.example
const protectedRoutes = {
  "/work/automate-design-handovers-with-a-figma-to-code-pipeline": true,
};

// Fonts Configuration
import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";

const heading = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const label = Geist({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts = {
  heading,
  body,
  label,
  code,
};

// Global Style Tokens
const style = {
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

const dataStyle = {
  variant: "gradient",
  mode: "categorical",
  height: 24,
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false
  },
};

// Visual Effects (Mailchimp Section Design Effects)
const effects = {
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

// Mailchimp no longer needs 'action' URL here.
const mailchimp = {
  effects,
};

// SEO Schema
const schema = {
  logo: "",
  type: "Organization",
  name: "Praneon",
  description: home.description,
  email: "vishal@praneon.com",
};

// Social Profiles
const sameAs = {
  linkedin: "https://www.linkedin.com/company/praneon/",
};

export { display, mailchimp, routes, protectedRoutes, baseURL, fonts, style, schema, sameAs, effects, dataStyle };
