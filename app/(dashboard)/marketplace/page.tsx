'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, FIELD_LABELS, VISA_LABELS } from '@/lib/utils';
import { Search, ShieldCheck, Code, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DOC_TYPE_LABELS: Record<string, string> = {
  full_petition: 'Full Petition', cover_letter: 'Cover Letter', rec_letter: 'Rec Letter', evidence_index: 'Evidence Index', strategy_doc: 'Strategy Doc',
};

const DEMO_LISTINGS = [
  { id: '1', title: 'Complete O-1A Petition — AI/ML Researcher', description: 'Full approved O-1A petition package for an AI/ML researcher at a top tech company.', visaType: 'o1a', field: 'ai_ml', documentType: 'full_petition', price: 199, purchases: 47, rating: 4.9, views: 1204, sellerInitials: 'SK' },
  { id: '2', title: 'EB-1A Cover Letter — Biotech Scientist', description: 'Detailed cover letter used in a successful EB-1A petition for a biotech scientist.', visaType: 'eb1a', field: 'biotech', documentType: 'cover_letter', price: 79, purchases: 32, rating: 4.8, views: 890, sellerInitials: 'AP' },
  { id: '3', title: 'Recommendation Letter Templates (5 pack)', description: 'Five different recommendation letter templates from professors, industry leaders, and collaborators.', visaType: 'o1a', field: 'engineering', documentType: 'rec_letter', price: 49, purchases: 142, rating: 5.0, views: 3400, sellerInitials: 'MJ' },
];

const FILTER_TABS = ['all', 'full_petition', 'cover_letter', 'rec_letter', 'evidence_index', 'strategy_doc'];
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function MarketplacePage() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [purchaseModal, setPurchaseModal] = useState<string | null>(null);

  const filtered = DEMO_LISTINGS.filter(l => {
    if (filter !== 'all' && l.documentType !== filter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const purchaseListing = DEMO_LISTINGS.find(l => l.id === purchaseModal);

  return (
    <motion.div className="max-w-[1100px] mx-auto space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl font-medium">Marketplace</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Acquire proven blueprints. Don't reinvent the wheel.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex gap-2 overflow-x-auto flex-1">
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} className={`filter-pill ${filter === tab ? 'active' : ''}`}>
              {tab === 'all' ? 'All' : DOC_TYPE_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(listing => (
          <motion.div variants={itemVariants} key={listing.id}>
            <Card padding="md" className="flex flex-col h-full relative overflow-hidden group hover:border-[var(--text-primary)] transition-colors">
              
              {/* Social Proof Psychology */}
              {listing.purchases > 40 && (
                 <div className="absolute top-0 right-0 bg-[var(--text-primary)] text-[var(--bg)] text-[9px] font-bold uppercase tracking-wider px-2 py-1 select-none">
                    Bestseller
                 </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="p-2 border border-[var(--border)] rounded bg-[var(--bg)]">
                  <Code className="w-4 h-4 text-[var(--text-primary)]" />
                </div>
                {/* Authority positioning */}
                <Badge variant="default" className="text-[10px] font-mono border-[var(--text-primary)] text-[var(--text-primary)]">
                    <ShieldCheck className="w-3 h-3 mr-1" />VERIFIED APPROVAL
                </Badge>
              </div>

              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 leading-tight">{listing.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-6 flex-1">{listing.description}</p>

              {/* Trust signals */}
              <div className="flex items-center gap-4 mb-4 text-[10px] text-[var(--text-tertiary)]">
                 <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {listing.purchases} sales</span>
                 <span className="flex items-center gap-1">★ {listing.rating} ({Math.floor(listing.purchases * 0.4)})</span>
              </div>

              <div className="pt-4 border-t border-[var(--border)] mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-semibold">{formatCurrency(listing.price)}</span>
                  <Button size="sm" variant="primary" onClick={() => setPurchaseModal(listing.id)}>View Details</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
