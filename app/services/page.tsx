'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const services = [
    { title: 'Preventive Maintenance', slug: 'preventive-maintenance' },
    { title: 'Body Repair', slug: 'body-repair' },
    { title: 'Car Care', slug: 'car-care' },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Services</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s) => (
          <div key={s.slug} className="border rounded-lg p-6 hover:shadow-lg transition bg-white text-center">
            <h3 className="text-xl font-bold mb-4">{s.title}</h3>
            <Link
              href={`/services/${s.slug}`}
              className="text-automob-blue font-semibold hover:underline"
            >
              Learn More &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
