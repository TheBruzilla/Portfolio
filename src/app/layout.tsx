import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css';

import classNames from 'classnames';
import { Background, Column, Flex, opacity, SpacingToken } from '@once-ui-system/core';
import { Footer, Header, RouteGuard, Providers } from '@/components';
import { baseURL, effects, fonts, style, dataStyle, home } from '@/resources';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Praneon - Vishal N | Holistic Wellness & Innovations',
  description: 'Discover Vishal N’s journey of merging Holistic Healing, Iridology & AI-driven wellness insights through Praneon.',
  metadataBase: new URL('https://praneon.com'),
  openGraph: {
    title: 'Praneon - Empowering Wellness with Vishal N',
    description: 'Explore Vishal N’s holistic innovations, AI projects & wellness transformations.',
    url: 'https://praneon.com',
    siteName: 'Praneon',
    images: [
      {
        url: '/images/og/portfolio-og-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Praneon Portfolio Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Praneon - Vishal N | Wellness & AI Innovations',
    description: 'Get insights into holistic healing & AI-powered wellness with Vishal N.',
    images: ['/images/og/portfolio-og-preview.jpg'],
  },
  alternates: {
    canonical: 'https://praneon.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                  const resolvedTheme = (!savedTheme || savedTheme === 'system')
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : savedTheme;
                  root.setAttribute('data-theme', resolvedTheme);
                } catch (e) {
                  console.error('Theme initialization failed:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `
          }}
        />
      </head>
      <body>
        <Providers>
          <Column background="page" fillWidth style={{ minHeight: '100vh' }} margin="0" padding="0" horizontal="center">
            <Background
              position="fixed"
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor,
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
            <Flex fillWidth minHeight="16" hide="s" />
            <Header />
            <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
              <Flex horizontal="center" fillWidth minHeight="0">
                <RouteGuard>
                  {children}
                </RouteGuard>
              </Flex>
            </Flex>
            <Footer />
          </Column>
        </Providers>
      </body>
    </html>
  );
}
