import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans'
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono'
});

export const metadata = {
  title: 'Mubaraq Olalekan — Electrical & Electronics Engineer',
  description:
    'Mubaraq Olalekan — Electrical & Electronics Engineer specializing in Embedded Systems, IoT, Electronics and PCB Design.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <div className="substrate" aria-hidden="true"></div>
        {children}
      </body>
    </html>
  );
}
