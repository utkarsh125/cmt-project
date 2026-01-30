import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="border border-gray-200 p-8 rounded-lg shadow-lg bg-white">
        <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
        <p className="text-xl text-blue-600 font-semibold mb-6">
          ${Number(service.price).toFixed(2)}
        </p>
        <p className="text-gray-700 mb-6 text-lg">{service.description}</p>
        <p className="text-gray-600 mb-8">
          <strong>Duration:</strong> {service.duration} minutes
        </p>

        <div className="flex space-x-4">
          <Link
            href={`/booking?service=${service.slug}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition"
          >
            Book Now
          </Link>
          <Link
            href="/services"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition"
          >
            Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
}
