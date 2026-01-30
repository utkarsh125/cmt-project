'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="bg-blue-900 text-white py-20 px-4 text-center">
      <h1 className="hero-content text-5xl font-bold mb-6">Expert Car Repair Services</h1>
      <p className="hero-content text-xl mb-8 max-w-2xl mx-auto">
        Professional maintenance and repair services at your doorstep. Fast, reliable, and affordable.
      </p>
      <div className="hero-content">
        <Link
          href="/services"
          className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-400 transition"
        >
          Book a Service
        </Link>
      </div>
    </div>
  );
}
