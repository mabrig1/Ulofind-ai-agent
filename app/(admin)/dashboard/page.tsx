import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import Lead from '@/models/Lead';
import FraudReport from '@/models/FraudReport';
import { AlertTriangle, Building2, CheckCircle2, Eye, MessageSquare, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await connectDB();
  const [total, verified, pending, leads, reports, danger, recent] = await Promise.all([
    Listing.countDocuments({ available: true }),
    Listing.countDocuments({ available: true, moderationStatus: 'approved', verified: true }),
    Listing.countDocuments({ available: true, moderationStatus: 'pending' }),
    Lead.countDocuments(),
    FraudReport.countDocuments(),
    FraudReport.countDocuments({ 'aiAnalysis.riskLevel': 'danger' }),
    Listing.find({ available: true }).sort({ moderationStatus: 1, postedAt: -1 }).limit(8).lean(),
  ]);

  const stats = [
    { label: 'Active listings', value: total, icon: Building2 },
    { label: 'Verified', value: verified, icon: CheckCircle2 },
    { label: 'Awaiting review', value: pending, icon: Eye },
    { label: 'Buyer leads', value: leads, icon: MessageSquare },
    { label: 'Ada screenings', value: reports, icon: ShieldCheck },
    { label: 'Danger flags', value: danger, icon: AlertTriangle },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#0f5132] text-white px-5 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-200 text-xs font-bold uppercase tracking-[0.2em]">UloFind Operations</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Agent Dashboard</h1>
          <p className="text-green-100 mt-2 max-w-2xl">Review marketplace activity and verification workload. AI screening is decision support; human verification remains required.</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border p-4 shadow-sm">
              <Icon size={20} className="text-[#0f5132]" />
              <p className="text-2xl font-extrabold mt-3">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <section className="mt-8 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-extrabold text-lg">Recent listings</h2>
            <p className="text-sm text-gray-500">Prioritize unverified submissions before featuring them.</p>
          </div>
          <div className="divide-y">
            {recent.length === 0 ? <p className="p-6 text-sm text-gray-500">No listings yet.</p> : recent.map((item: any) => (
              <div key={String(item._id)} className="p-5 flex flex-col md:flex-row md:items-center gap-3 justify-between">
                <div>
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.category} · ₦{Number(item.price).toLocaleString()} · {item.location || item.townArea || item.campusZone || 'Location not supplied'}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${item.moderationStatus === 'approved' ? 'bg-green-100 text-green-800' : item.moderationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                  {item.moderationStatus === 'pending' ? 'Pending approval' : item.moderationStatus === 'rejected' ? 'Rejected' : item.verified ? 'Approved + verified' : 'Approved'}
                </span>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          <strong>Operations rule:</strong> never mark a listing verified solely from an Ada score. Confirm identity, authority to let/sell, property existence and relevant documents independently.
        </div>
      </div>
    </main>
  );
}
