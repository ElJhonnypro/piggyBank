'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import navbarstyles from './navbar.module.css';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>Piggy Bank</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Navbar */}
        <header className={navbarstyles.header}>
          <nav>
            <ul>
              <li
               className={
                pathname === '/' ? navbarstyles.active : navbarstyles.listitem
                }>
                  <Link href="/">Home</Link>
                  </li>

              <li
               className={
                pathname === '/payments' ? navbarstyles.active : navbarstyles.listitem
                }>
                  <Link href="/payments">Payments</Link>
                  </li>
            </ul>
          </nav>
        </header>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}