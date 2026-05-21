'use client';

import { useEffect, useState } from 'react';
import ListingCard, { type ListingCardProps } from '@/components/ListingCard';

interface Props {
  category: string;
  excludeId: string;
}

export default function SimilarListings({ category, excludeId }: Props) {
  const [listings, setListings] = useState<ListingCardProps[]>([]);

  useEffect(() => {
    fetch(`/api/listings?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((d) => {
        const filtered = (d.listings ?? [])
          .filter((l: ListingCardProps) => String(l._id) !== excludeId)
          .slice(0, 3);
        setListings(filtered);
      })
      .catch(() => {});
  }, [category, excludeId]);

  if (listings.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {listings.map((l) => (
        <ListingCard key={String(l._id)} {...l} _id={String(l._id)} />
      ))}
    </div>
  );
}
