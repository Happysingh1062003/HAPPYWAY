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
import { ExternalLink, ChevronUp, Bookmark, Plus, Search, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_LABELS: Record<string, string> = {
  award: 'Award', grant: 'Grant', speaking: 'Speaking',
  publication: 'Publication', fellowship: 'Fellowship',
  competition: 'Competition', press: 'Press', judging_panel: 'Judging Panel', other: 'Other',
};

const TYPE_COLORS: Record<string, string> = {
  award: 'amber', grant: 'green', speaking: 'blue',
  publication: 'blue', fellowship: 'green',
  competition: 'amber', press: 'red', judging_panel: 'muted', other: 'muted',
};

const DEMO_OPPORTUNITIES = [
  { id: '1', title: 'MIT Technology Review Innovators Under 35', organization: 'MIT Technology Review', type: 'award', description: 'Annual award recognizing exceptionally talented young innovators whose work has the greatest potential to transform the world.', criteria: ['awards'], deadline: '2025-06-15', upvotes: 142, isVerified: true, isCommunity: false, fields: ['ai_ml', 'biotech', 'engineering'] },
  { id: '2', title: 'NSF CAREER Award', organization: 'National Science Foundation', type: 'grant', description: 'The Faculty Early Career Development Program supports early-career faculty who have the potential to serve as academic role models in research and education.', criteria: ['awards', 'scholarly_articles'], deadline: '2025-07-26', upvotes: 98, isVerified: true, isCommunity: false, fields: ['ai_ml', 'engineering', 'research'] },
  { id: '3', title: 'NeurIPS 2025 — Call for Papers', organization: 'NeurIPS Foundation', type: 'publication', description: 'Submit original research papers in machine learning and computational neuroscience to one of the premier venues in the field.', criteria: ['scholarly_articles', 'original_contributions'], deadline: '2025-05-22', upvotes: 76, isVerified: true, isCommunity: false, fields: ['ai_ml', 'research'] },
  { id: '4', title: 'TED Fellows Program', organization: 'TED', type: 'fellowship', description: 'A global community of young innovators and change-makers selected to attend TED events and access mentorship and development.', criteria: ['awards', 'press'], deadline: '2025-04-30', upvotes: 201, isVerified: true, isCommunity: false, fields: ['ai_ml', 'biotech', 'arts', 'medicine'] },
  { id: '5', title: 'IEEE Peer Review Opportunity', organization: 'IEEE', type: 'judging_panel', description: 'Serve as a reviewer for IEEE Transactions on Pattern Analysis. Great for building your judging criterion evidence.', criteria: ['judging'], deadline: '2025-12-31', upvotes: 45, isVerified: false, isCommunity: true, fields: ['ai_ml', 'engineering'] },
  { id: '6', title: 'Forbes 30 Under 30 — Nominations Open', organization: 'Forbes', type: 'award', description: 'Annual list recognizing 600 young leaders across 20 industries. Being featured counts as major press coverage and award.', criteria: ['awards', 'press'], deadline: '2025-05-01', upvotes: 167, isVerified: true, isCommunity: false, fields: ['ai_ml', 'finance', 'biotech', 'entrepreneurship'] },
  { id: '7', title: 'Y Combinator Speaker Series', organization: 'Y Combinator', type: 'speaking', description: 'Opportunity to present at YC\'s Friday speaker series. Strong evidence for critical role and press criteria.', criteria: ['press', 'critical_role'], deadline: null, upvotes: 33, isVerified: false, isCommunity: true, fields: ['entrepreneurship', 'ai_ml'] },
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
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Opportunity feed</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Awards, grants, speaking calls, fellowships — matched to your profile</p>
        </div>
        <Button onClick={() => setSubmitModal(true)}><Plus className="w-4 h-4" /> Submit opportunity</Button>
      </div>

      {/* Personalization */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span>Showing opportunities for</span>
        <Badge variant="blue" pill>AI/ML</Badge>
        <Badge variant="muted" pill>O-1A</Badge>
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
              {tab === 'all' ? 'All' : TYPE_LABELS[tab]}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-auto text-sm">
          <option value="best">Best match</option>
          <option value="deadline">Deadline (soonest)</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <input type="text" placeholder="Search opportunities..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
      </div>

      {/* Opportunity Feed */}
      <div className="space-y-3">
        {filtered.map(opp => {
          const deadlineStatus = opp.deadline ? getDeadlineStatus(opp.deadline) : null;
          const isUpvoted = upvoted.has(opp.id);
          const isSaved = saved.has(opp.id);

          return (
            <Card key={opp.id} padding="md">
              <div className="flex gap-4">
                {/* Upvote */}
                <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-1">
                  <button
                    onClick={() => toggleUpvote(opp.id)}
                    className={cn(
                      'p-1 rounded transition-colors',
                      isUpvoted ? 'text-[var(--brand)] bg-[var(--bg-hover)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                    )}
                    aria-label="Upvote"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <span className="font-mono text-xs font-medium">{opp.upvotes + (isUpvoted ? 1 : 0)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <Badge variant={TYPE_COLORS[opp.type] as 'default' | 'green' | 'amber' | 'red' | 'blue' | 'muted'} pill>{TYPE_LABELS[opp.type]}</Badge>
                    {opp.isVerified && <Badge variant="green" pill>Verified</Badge>}
                    {opp.isCommunity && <Badge variant="amber" pill>Community</Badge>}
                  </div>

                  <h3 className="text-base font-medium mb-0.5">{opp.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">{opp.organization}</p>
                  <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 mb-3">{opp.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {opp.criteria.map(c => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-secondary)]">
                        Helps: {CRITERION_LABELS[c]}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {opp.deadline && (
                      <span className={cn('text-xs flex items-center gap-1', {
                        'text-[var(--red)]': deadlineStatus === 'urgent',
                        'text-[var(--amber)]': deadlineStatus === 'soon',
                        'text-[var(--text-tertiary)]': deadlineStatus === 'normal',
                      })}>
                        <Clock className="w-3 h-3" />
                        {formatDate(opp.deadline)}
                      </span>
                    )}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Button size="sm"><ExternalLink className="w-3 h-3" /> Apply</Button>
                    </a>
                    <button
                      onClick={() => toggleSave(opp.id)}
                      className={cn('p-1.5 rounded transition-colors', isSaved ? 'text-[var(--amber)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]')}
                      aria-label="Save"
                    >
                      <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submit Modal */}
      <Modal isOpen={submitModal} onClose={() => setSubmitModal(false)} title="Submit an opportunity" size="lg">
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g., MIT Technology Review Innovators Under 35" />
          <Input label="Organization" placeholder="e.g., MIT Technology Review" />
          <Select label="Type" options={Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} placeholder="Select type" />
          <Textarea label="Description" placeholder="What is this opportunity about?" maxChars={5000} />
          <Input label="Application URL" placeholder="https://..." />
          <Input label="Deadline" type="date" />
          <Textarea label="Eligibility notes" placeholder="Any specific requirements?" />
          <Button className="w-full" size="lg" onClick={() => { toast.success('Opportunity submitted for review!'); setSubmitModal(false); }}>
            Submit opportunity
          </Button>
        </div>
      </Modal>
    </div>
  );
}
