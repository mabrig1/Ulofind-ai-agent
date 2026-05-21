interface Props {
  params: { id: string };
}

export default function ListingDetailPage({ params }: Props) {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Listing Detail</h1>
      <p className="text-gray-600">Listing ID: {params.id}</p>
    </main>
  );
}
