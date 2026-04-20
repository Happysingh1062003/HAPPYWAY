'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate, getDeadlineStatus, CRITERION_LABELS } from '@/lib/utils';
import { ExternalLink, ChevronUp, Bookmark, Plus, Search, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_LABELS: Record<string, string> = {
  award: 'Award', grant: 'Grant', speaking: 'Speaking',
  publication: 'Publication', fellowship: 'Fellowship',
  competition: 'Competition', press: 'Press', judging_panel: 'Judging Panel', other: 'Other',
};

const DEMO_OPPORTUNITIES = [
  { id: '1', title: 'MIT Technology Review Innovators Under 35', organization: 'MIT Technology Review', type: 'award', description: 'Annual award recognizing exceptionally talented young innovators whose work has the greatest potential to transform the world.', criteria: ['awards'], deadline: '2025-06-15', upvotes: 142, isVerified: true, isCommunity: false, fields: ['ai_ml', 'biotech', 'engineering'] },
  { id: '2', title: 'NSF CAREER Award', organization: 'National Science Foundation', type: 'grant', description: 'The Faculty Early Career Development Program supports early-career faculty who have the potential to serve as academic role models in research and education.', criteria: ['awards', 'scholarly_articles'], deadline: '2025-07-26', upvotes: 98, isVerified: true, isCommunity: false, fields: ['ai_ml', 'engineering', 'research'] },
  { id: '3', title: 'NeurIPS 2025 — Call for Papers', organization: 'NeurIPS Foundation', type: 'publication', description: 'Submit original research papers in machine learning and computational neuroscience to one of the premier venues in the field.', criteria: ['scholarly_articles', 'original_contributions'], deadline: '2025-05-22', upvotes: 76, isVerified: true, isCommunity: false, fields: ['ai_ml', 'research'] },
  { id: '4', title: 'TED Fellows Program', organization: 'TED', type: 'fellowship', description: 'A global community of young innovators and change-makers selected to attend TED events and access mentorship and development.', criteria: ['awards', 'press'], deadline: '2025-04-30', upvotes: 201, isVerified: true, isCommunity: false, fields: ['ai_ml', 'biotech', 'arts', 'medicine'] },
];

const FILTER_TABS = ['all', 'award', 'grant', 'speaking', 'publication', 'fellowship', 'press', 'judging_panel'];

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('best');
  const [search, setSearch] = useState('');
  const [submitModal, setSubmitModal] = useState(false);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = DEMO_OPPORTUNITIES.filter(o => {
    if (filter !== 'all' && o.type !== filter) return false;
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.organization.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'upvotes') return b.upvotes - a.upvotes;
    if (sort === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return b.upvotes - a.upvotes;
  });

  const toggleUpvote = (id: string) => {
    setUpvoted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from saved'); }
      else { next.add(id); toast.success('Saved!'); }
      return next;
    });
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl font-medium">Opportunity Feed</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Awards, grants, speaking calls matching your profile</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setSubmitModal(true)}><Plus className="w-4 h-4" /> Submit Opportunity</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto scroll-shadow-x flex-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`filter-pill ${filter === tab ? 'active' : ''}`}
            >
              {tab === 'all' ? 'All' : TYPE_LABELS[tab]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 h-8 text-xs" />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-auto h-8 text-xs py-0">
             <option value="best">Best match</option>
             <option value="deadline">Soonest</option>
             <option value="upvotes">Upvotes</option>
          </select>
        </div>
      </div>

      {/* Opportunity Feed */}
      <div className="space-y-4">
        {filtered.map(opp => {
          const deadlineStatus = opp.deadline ? getDeadlineStatus(opp.deadline) : null;
          const isUpvoted = upvoted.has(opp.id);
          const isSaved = saved.has(opp.id);

          return (
            <Card key={opp.id} padding="md" className="flex flex-col sm:flex-row gap-6">
              
              <div className="flex flex-col items-center justify-start gap-1 p-3 bg-[var(--bg-muted)] border border-[var(--border)] rounded min-w-[60px]">
                <button
                  onClick={() => toggleUpvote(opp.id)}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    isUpvoted ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  )}
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <span className={cn("font-mono text-sm font-semibold", isUpvoted && "text-[var(--text-primary)]")}>{opp.upvotes + (isUpvoted ? 1 : 0)}</span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest bg-[var(--bg-muted)] px-1.5 py-0.5 rounded">{TYPE_LABELS[opp.type]}</span>
                     {opp.isVerified && <span className="text-[10px] text-[var(--text-primary)] font-mono flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>}
                  </div>

                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1 leading-tight">{opp.title}</h3>
                  <p className="text-sm text-[var(--text-tertiary)] mb-4">{opp.organization}</p>
                  
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">{opp.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {opp.criteria.map(c => (
                      <span key={c} className="text-xs font-mono text-[var(--text-secondary)]">#{CRITERION_LABELS[c].replace(/\s+/g, '')}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    {opp.deadline && (
                      <span className={cn('text-xs font-mono flex items-center gap-1.5', {
                        'text-[var(--red)]': deadlineStatus === 'urgent',
                        'text-[var(--amber)]': deadlineStatus === 'soon',
                        'text-[var(--text-tertiary)]': deadlineStatus === 'normal',
                      })}>
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(opp.deadline)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSave(opp.id)}
                      className={cn('p-2 rounded border transition-colors', isSaved ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)]')}
                      aria-label="Save"
                    >
                      <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
                    </button>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="secondary"><ExternalLink className="w-3.5 h-3.5" /> Apply</Button>
                    </a>
                  </div>
                </div>
              </div>

            </Card>
          );
        })}
      </div>

      {/* Submit Modal */}
      <Modal isOpen={submitModal} onClose={() => setSubmitModal(false)} title="Submit an Opportunity" size="lg">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <Input label="Title" placeholder="e.g., MIT Tech Review 35" />
             <Input label="Organization" placeholder="e.g., MIT Technology Review" />
          </div>
          <Select label="Type" options={Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} placeholder="Select type" />
          <Textarea label="Description" placeholder="What is this opportunity about?" maxChars={5000} />
          
          <div className="grid grid-cols-2 gap-4">
             <Input label="Application URL" placeholder="https://..." />
             <Input label="Deadline" type="date" />
          </div>
          
          <Textarea label="Eligibility notes" placeholder="Any specific requirements?" />
          
          <div className="pt-4 mt-6 border-t border-[var(--border)]">
             <Button variant="primary" className="w-full h-12" onClick={() => { toast.success('Opportunity submitted for review!'); setSubmitModal(false); }}>
               Submit Opportunity
             </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
