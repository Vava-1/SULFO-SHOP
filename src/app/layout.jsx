import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata = {
  title: { default: 'Sulfo Rwanda — Shop Online', template: '%s | Sulfo Rwanda' },
  description: 'Shop Sulfo Rwanda\'s full range of quality home care, personal care, and drinking water products. Made in Rwanda since 1962. ISO certified excellence.',
  keywords: ['sulfo rwanda','claire soap','nil water','sante','vague body wash','made in rwanda','rwanda fmcg'],
  openGraph: {
    title: 'Sulfo Rwanda — Shop Online',
    description: 'Quality home & personal care products. Made in Rwanda since 1962.',
    images: [{ url: 'https://sulforwanda.com/wp-content/uploads/2024/01/About-us-top-image-2.jpg' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <CartDrawer />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
