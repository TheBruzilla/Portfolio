import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css';

import classNames from 'classnames';
import { Background, Column, Flex, opacity, SpacingToken } from '@once-ui-system/core';
import { Footer, Header, RouteGuard, Providers } from '@/components';
import { baseURL, effects, fonts, style, dataStyle } from '@/resources';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: 'Praneon - Vishal N | Holistic Wellness & Innovations',
  description: 'Discover Vishal N’s journey of merging Holistic Healing, Iridology & AI-driven wellness insights through Praneon.',
  alternates: {
    canonical: baseURL,
  },
  openGraph: {
    type: 'website',
    url: baseURL,
    siteName: 'Praneon',
    title: 'Praneon - Empowering Wellness with Vishal N',
    description: 'Explore Vishal N’s holistic innovations, AI projects & wellness transformations.',
    images: [
      {
        url: '/images/og/portfolio-og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Praneon Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Praneon - Vishal N | Wellness & AI Innovations',
    description: 'Get insights into holistic healing & AI-powered wellness with Vishal N.',
    images: ['/images/og/portfolio-og-preview.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Vishal N",
    "url": baseURL,
    "image": `${baseURL}/images/og/portfolio-og-preview.jpg`,
    "sameAs": [
      "https://www.linkedin.com/in/vishal-n-praneon",
      "https://github.com/TheBruzilla"
    ],
    "jobTitle": "Naturopathic Doctor | Wellness Innovator | AI Researcher",
    "worksFor": { "@type": "Organization", "name": "Praneon" },
    "description": "Vishal N integrates Iridology, AI technologies, and Naturopathy for personalized wellness.",
    "knowsAbout": ["Iridology", "Naturopathy", "AI in Healthcare", "Wellness Consulting"],
    "alumniOf": { "@type": "CollegeOrUniversity", "name": "BNYS University" }
  };

  return (
    <html lang="en" suppressHydrationWarning className={classNames(
      fonts.heading.variable,
      fonts.body.variable,
      fonts.label.variable,
      fonts.code.variable
    )}>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    'solid-style': style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    'viz-style': dataStyle.variant,
                  })};
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  const savedTheme = localStorage.getItem('data-theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.setAttribute('data-theme', savedTheme || (savedTheme === 'system' ? systemTheme : savedTheme));
                } catch(e) {
                  console.error('Theme init failed:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Providers>
          <Column background="page" fillWidth style={{ minHeight: '100vh' }} margin="0" padding="0" horizontal="center">
            <Background
              position="fixed"
              mask={{ ...effects.mask }}
              gradient={{ ...effects.gradient }}
              dots={{ ...effects.dots }}
              grid={{ ...effects.grid }}
              lines={{ ...effects.lines }}
            />
            <Flex fillWidth minHeight="16" hide="s" />
            <Header />
            <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
              <Flex horizontal="center" fillWidth minHeight="0">
                <RouteGuard>{children}</RouteGuard>
              </Flex>
            </Flex>
            <Footer />
          </Column>
        </Providers>
      </body>
    </html>
  );
}
