// components/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/">AI Recipe Generator</Link>
      </div>
      <nav className="hidden md:flex space-x-4">
        <Link href="/about">About Us</Link>
        <Link href="/use-cases">Use Cases</Link>
        <Link href="/how-it-works">How It Works</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 md:hidden">
          <Link href="/about">About Us</Link>
          <Link href="/use-cases">Use Cases</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
