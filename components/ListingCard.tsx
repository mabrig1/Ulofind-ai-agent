import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

export interface ListingCardProps {
  _id: string;
  title: string;
  price: number;
  priceType: 'per-year' | 'per-month';
  category: 'housing' | 'town-shop' | 'campus-shop';
  photos?: string[];
  location?: string;
  campusZone?: string;
  townArea?: string;
  housingType?: string;
  agentName: string;
  agentPhone: string;
  agentWhatsApp?: string;
  available?: boolean;
  nearUNN?: boolean;
}

const badgeStyle: Record<string, string> = {
  housing: 'bg-green-100 text-green-800',
  'campus-shop': 'bg-blue-100 text-blue-800',
  'town-shop': 'bg-yellow-100 text-yellow-800',
};

const categoryLabel: Record<string, string> = {
  housing: 'Housing',
  'campus-shop': 'Campus Shop',
  'town-shop': 'Town Shop',
};

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ListingCard({
  _id,
  title,
  price,
  priceType,
  category,
  photos,
  location,
  campusZone,
  townArea,
  housingType,
  agentName,
  agentPhone,
  agentWhatsApp,
  available = true,
  nearUNN,
}: ListingCardProps) {
  const displayLocation = location ?? campusZone ?? townArea ?? '';
  const waNumber = (agentWhatsApp ?? agentPhone).replace(/\D/g, '');
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi, I saw "${title}" on UloFind and I'm interested.`
  )}`;
  const photoUrl = photos?.[0];

  return (
    <div className="relative border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow flex flex-col">
      {/* TAKEN overlay */}
      {!available && (
        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-2xl">
          <span className="text-white font-extrabold text-2xl tracking-[6px] border-4 border-white px-4 py-1 rounded rotate-[-12deg]">
            TAKEN
          </span>
        </div>
      )}

      {/* Photo */}
      <div className="relative aspect-video bg-gray-100 flex-shrink-0">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-xs">
            No photo
          </div>
        )}
        {nearUNN && (
          <span
            className="absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#0f5132' }}
          >
            Near UNN
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className={`self-start text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badgeStyle[category]}`}>
          {housingType ?? categoryLabel[category]}
        </span>

        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{title}</h3>

        {displayLocation && (
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={11} />
            <span className="truncate">{displayLocation}</span>
          </div>
        )}

        <p className="font-extrabold text-base" style={{ color: '#0f5132' }}>
          ₦{price.toLocaleString()}
          <span className="text-xs font-normal text-gray-400 ml-1">
            /{priceType === 'per-year' ? 'yr' : 'mo'}
          </span>
        </p>

        <p className="text-xs text-gray-400 truncate">Agent: {agentName}</p>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <Link
            href={`/listing/${_id}`}
            className="flex-1 text-center text-xs font-semibold text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0f5132' }}
          >
            View Details
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
            aria-label="WhatsApp"
          >
            <WaIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
