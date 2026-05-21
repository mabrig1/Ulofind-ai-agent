import Link from 'next/link';
import Image from 'next/image';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  type: 'housing' | 'shop';
  imageUrl?: string;
  isVerified?: boolean;
}

export default function ListingCard({
  id,
  title,
  price,
  location,
  type,
  imageUrl,
  isVerified,
}: ListingCardProps) {
  return (
    <Link href={`/listing/${id}`} className="block">
      <div className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 bg-gray-100">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No image
            </div>
          )}
          {isVerified && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase mb-1">{type}</p>
          <h3 className="font-semibold text-gray-800 truncate">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{location}</p>
          <p className="text-blue-600 font-bold mt-2">₦{price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
