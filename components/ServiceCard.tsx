import Link from 'next/link';

interface ServiceProps {
  slug: string;
  name: string;
  description: string;
  price: number;
}

export default function ServiceCard({
  slug,
  name,
  description,
  price,
}: ServiceProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition bg-white">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{name}</h3>
      <p className="text-gray-600 mb-4 h-20 overflow-hidden text-ellipsis">
        {description}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-semibold text-blue-600">
          ${Number(price).toFixed(2)}
        </span>
        <Link
          href={`/services/${slug}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
