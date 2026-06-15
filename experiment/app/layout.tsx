import type { ReactNode } from 'react';

export const metadata = {
  title: 'bump',
  description: 'you get in by being there.',
  // The experiment must not be indexed.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '0 auto', padding: 24 }}>
        {children}
      </body>
    </html>
  );
}
