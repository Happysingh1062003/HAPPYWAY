'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, FIELD_LABELS, VISA_LABELS } from '@/lib/utils';
import { ShoppingBag, Search, ShieldCheck, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const DOC_TYPE_LABELS: Record<string, string> = {
  full_petition: 'Full Petition', cover_letter: 'Cover Letter',
  rec_letter: 'Recommendation Letter', evidence_index: 'Evidence Index',
  strategy_doc: 'Strategy Document',
};

const DEMO_LISTINGS = [
  { id: '1', title: 'Complete O-1A Petition — AI/ML Researcher', description: 'Full approved O-1A petition package for an AI/ML researcher at a top tech company. Includes cover letter, evidence index, and all supporting exhibits. Redacted for privacy but strategy and structure fully intact.', visaType: 'o1a', field: 'ai_ml', documentType: 'full_petition', price: 199, purchases: 47, sellerInitials: 'SK', sellerColor: '#2563EB' },
  { id: '2', title: 'EB-1A Cover Letter — Biotech Scientist', description: 'Detailed cover letter used in a successful EB-1A petition for a biotech scientist. Covers all 8 criteria with specific evidence mapping and legal argumentation.', visaType: 'eb1a', field: 'biotech', documentType: 'cover_letter', price: 79, purchases: 32, sellerInitials: 'AP', sellerColor: '#059669' },
  { id: '3', title: 'Recommendation Letter Templates (5 pack)', description: 'Five different recommendation letter templates from professors, industry leaders, and collaborators. Each template follows best practices for USCIS requirements.', visaType: 'o1a', field: 'engineering', documentType: 'rec_letter', price: 49, purchases: 89, sellerInitials: 'MJ', sellerColor: '#D97706' },
  { id: '4', title: 'Evidence Strategy Doc — Finance O-1A', description: 'Comprehensive evidence-building strategy document outlining which criteria to target, timeline, and specific actions for a finance professional.', visaType: 'o1a', field: 'finance', documentType: 'strategy_doc', price: 129, purchases: 18, sellerInitials: 'LW', sellerColor: '#7C3AED' },
  { id: '5', title: 'Evidence Index — EB-1A Approved (Medicine)', description: 'Full evidence index from an approved EB-1A petition in medicine. Shows exact organization, exhibit labeling, and cross-referencing across all criteria.', visaType: 'eb1a', field: 'medicine', documentType: 'evidence_index', price: 59, purchases: 54, sellerInitials: 'RK', sellerColor: '#DC2626' },
  { id: '6', title: 'Complete O-1A Package — Arts & Entertainment', description: 'Approved O-1A petition for a visual artist. Includes cover letter, evidence of exhibitions, press coverage documentation, and recommendation letters.', visaType: 'o1a', field: 'arts', documentType: 'full_petition', price: 249, purchases: 12, sellerInitials: 'YT', sellerColor: '#0891B2' },
];

const FILTER_TABS = ['all', 'full_petition', 'cover_letter', 'rec_letter', 'evidence_index', 'strategy_doc'];

export default function MarketplacePage() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [purchaseModal, setPurchaseModal] = useState<string | null>(null);

  const filtered = DEMO_LISTINGS.filter(l => {
    if (filter !== 'all' && l.documentType !== filter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'popular') return b.purchases - a.purchases;
    if (sort === 'newest') return 0;
    if (sort === 'price_low') return a.price - b.price;
    if (sort === 'price_high') return b.price - a.price;
    return 0;
  });

  const purchaseListing = DEMO_LISTINGS.find(l => l.id === purchaseModal);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Document marketplace</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Petition documents from approved holders — strategies, letters, evidence indexes</p>
        </div>
        <Button variant="secondary"><ShoppingBag className="w-4 h-4" /> List a document</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === tab ? 'bg-[var(--brand)] text-[var(--text-inverse)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >
              {tab === 'all' ? 'All' : DOC_TYPE_LABELS[tab]}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-auto text-sm">
          <option value="popular">Most popular</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: low-high</option>
          <option value="price_high">Price: high-low</option>
        </select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <input type="text" placeholder="Search marketplace..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(listing => (
          <Card key={listing.id} padding="md">
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant="green" pill><ShieldCheck className="w-3 h-3 mr-0.5" /> Verified</Badge>
              <Badge variant="blue" pill>{VISA_LABELS[listing.visaType]}</Badge>
              <Badge variant="muted" pill>{FIELD_LABELS[listing.field]}</Badge>
            </div>

            <p className="text-xs text-[var(--text-tertiary)] mb-1">{DOC_TYPE_LABELS[listing.documentType]}</p>
            <h3 className="text-base font-medium mb-2">{listing.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">{listing.description}</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium text-white" style={{ backgroundColor: listing.sellerColor }}>
                {listing.sellerInitials}
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">{listing.purchases} purchases</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
              <span className="font-mono text-xl font-medium">{formatCurrency(listing.price)}</span>
              <Button size="sm" onClick={() => setPurchaseModal(listing.id)}>Purchase</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Purchase Modal */}
      <Modal isOpen={!!purchaseModal} onClose={() => setPurchaseModal(null)} title="Purchase document" size="sm">
        {purchaseListing && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">{purchaseListing.title}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{DOC_TYPE_LABELS[purchaseListing.documentType]} · {VISA_LABELS[purchaseListing.visaType]}</p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-muted)] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Document price</span>
                <span className="font-medium">{formatCurrency(purchaseListing.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Platform fee</span>
                <span className="text-[var(--text-tertiary)]">Included</span>
              </div>
              <div className="border-t border-[var(--border)] pt-2 flex justify-between text-sm font-medium">
                <span>You pay</span>
                <span>{formatCurrency(purchaseListing.price)}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-[var(--border)]">
              <p className="text-xs text-[var(--text-tertiary)] text-center">Stripe payment form would appear here</p>
            </div>

            <Button className="w-full" size="lg" onClick={() => { toast.success('Purchase complete! Download link available.'); setPurchaseModal(null); }}>
              <Download className="w-4 h-4" /> Pay {formatCurrency(purchaseListing.price)}
            </Button>

            <p className="text-xs text-[var(--text-tertiary)] text-center">Secure payment via Stripe. Instant download after payment.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
