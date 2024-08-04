// components/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-sm">
          &copy; 2024 AI Recipe Generator. All rights reserved.
        </div>
        <nav className="space-x-4 text-sm">
          <Link href="/about">About Us</Link>
          <Link href="/use-cases">Use Cases</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/blog">Blog</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;