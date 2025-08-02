// src/resources/content.js

import { Logo } from "@once-ui-system/core";

const person = {
  firstName: "Vishal",
  lastName: "N",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Aspiring Doctor & Entrepreneur | Health & Wellness Enthusiast | Founder of Praneon",
  avatar: "/images/avatar.png",
  email: "vishal@praneon.com",
  location: "Asia/Kolkata",
  languages: ["English", "French", "Hindi", "Japanese", "Marathi", "Tamil"],
};

const social = [
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/drvishaln/",
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/praneon/",
  },
  {
    name: "LinkTree",
    icon: "link",
    link: "https://linktr.ee/Bruzilla",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const newsletter = {
  display: true,
  title: `Subscribe to ${person.firstName}'s Wellness Insights`,
  description: "Get exclusive articles & wellness insights on Holistic Healing, Tech, and Naturopathy directly in your inbox.",
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    audience: process.env.MAILCHIMP_AUDIENCE_ID,
  },
};

const home = {
  path: "/",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Showcasing my journey as a ${person.role}`,
  headline: "Align. Heal. Thrive.",
  image: "/images/og/portfolio-og-preview.png",
  featured: {
    display: true,
    title: "Featured Project: AI-Powered Iridology",
    href: "/work/iridology-ai",
  },
  subline: "Integrating ancient naturopathy with modern AI-driven diagnostics for a new era of holistic wellness.",
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Get to know ${person.name}, a visionary in holistic health innovations, currently pioneering AI-integrated Iridology under the brand Praneon.`,
  tableOfContent: {
    display: true,
    subItems: true,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description:
      "I am an aspiring BNYS (Bachelor of Naturopathy & Yogic Sciences) doctor with a mission to bridge traditional healing systems with AI-powered diagnostics. Through Praneon, I’m developing wellness platforms that empower individuals with personalized, non-invasive health insights.",
  },
  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "Praneon Wellness – AI-Driven Iridology",
        timeframe: "Jan 2023 - Present",
        role: "Founder & Innovator",
        achievements: [
          "Developing a Machine Learning-based Iridology Diagnostic System for preventive health assessments.",
          "Creating digital tools that assist BNYS practitioners in combining AI precision with holistic healing practices.",
        ],
        images: [],
      },
      // Uncomment this when Internship is active
      // {
      //   company: "BNYS Internship – Pain Management Clinic",
      //   timeframe: "2026 - 2027",
      //   role: "Internship Trainee",
      //   achievements: [...],
      //   images: [],
      // },
    ],
  },
  studies: {
    display: true,
    title: "Academic Pathway",
    institutions: [
      {
        name: "Sona Medical College of Naturopathy & Yoga",
        description: "Currently pursuing BNYS, specializing in holistic pain management, lifestyle medicine, and wellness retreat conceptualization.",
      },
      {
        name: "Holy Cross Matriculation Higher Secondary School",
        description: "Completed Higher Secondary education with active involvement in health camps, science clubs, and cultural initiatives.",
      },
    ],
  },
  technical: {
    display: true,
    title: "Core Skills",
    skills: [
      {
        title: "AI-Driven Iridology",
        description: "Integrating AI vision systems to analyze Iris patterns for non-invasive preventive health assessments.",
        images: [],
      },
      {
        title: "Holistic Pain & Lifestyle Disease Management",
        description: "Expertise in Naturopathic modalities like Acupuncture, Hydrotherapy, Mud Therapy, and Manual Therapies.",
        images: [],
      },
      {
        title: "Wellness Retreat Planning",
        description: "Designing immersive wellness experiences that blend Yoga, Hydrotherapy, and personalized healing programs.",
        images: [],
      },
      {
        title: "Brand Strategy & Wellness Business Development",
        description: "Strategizing holistic wellness brand positioning and e-commerce initiatives under Praneon.",
        images: [],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Articles & Blogs",
  title: "Insights & Articles on Wellness, Technology & Holistic Healing",
  description: `Latest blogs by ${person.name} on Integrative Healthcare & AI-driven Wellness Innovations.`,
};

const work = {
  path: "/work",
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `Innovative projects where ${person.name} blends Naturopathy and Technology for futuristic wellness solutions.`,
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Visual Gallery – ${person.name}`,
  description: "Explore visual moments from my journey in holistic wellness & personal ventures.",
  images: [
    {
      src: "/images/gallery/Personal Bio Pic.jpg",
      alt: "Personal Bio Pic",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/Prize Receiving Pic.jpg",
      alt: "Prize Receiving Pic",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
