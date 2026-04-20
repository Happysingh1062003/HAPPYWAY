'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { getInitials, FIELD_LABELS } from '@/lib/utils';
import { Search, MessageSquare, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_PROFILES = [
  { id: '1', name: 'Dr. Sarah Chen', field: 'ai_ml', role: 'Research Scientist', org: 'MIT CSAIL', headline: 'AI safety researcher looking for co-authors on interpretability papers', lookingFor: ['co_author', 'peer_reviewer'], offering: ['co_author', 'mentor'], skills: ['machine learning', 'NLP', 'interpretability', 'Python'] },
  { id: '2', name: 'Raj Patel', field: 'biotech', role: 'Principal Scientist', org: 'Moderna', headline: 'Biotech innovator, open to cross-disciplinary collaborations in AI+Bio', lookingFor: ['project_partner', 'co_author'], offering: ['mentor', 'peer_reviewer'], skills: ['genomics', 'CRISPR', 'drug discovery', 'bioinformatics'] },
  { id: '3', name: 'Aisha Mohammed', field: 'engineering', role: 'Staff Engineer', org: 'SpaceX', headline: 'Aerospace engineer, looking for mentorship on EB-1A petition strategy', lookingFor: ['mentor'], offering: ['project_partner'], skills: ['propulsion', 'systems engineering', 'CAD', 'simulation'] },
  { id: '4', name: 'Dr. Eva Kowalski', field: 'medicine', role: 'Attending Physician', org: 'Mayo Clinic', headline: 'Clinical researcher in oncology, seeking collaborators for multi-center trials', lookingFor: ['co_author', 'project_partner'], offering: ['co_author', 'peer_reviewer', 'mentor'], skills: ['oncology', 'clinical trials', 'biostatistics', 'grant writing'] },
  { id: '5', name: 'Marcus Johnson', field: 'finance', role: 'VP Quantitative Research', org: 'Citadel', headline: 'Quant researcher bridging AI and finance, open to publication partnerships', lookingFor: ['co_author'], offering: ['mentor', 'peer_reviewer'], skills: ['quantitative finance', 'stochastic models', 'risk management'] },
  { id: '6', name: 'Yuki Tanaka', field: 'research', role: 'Postdoctoral Fellow', org: 'Stanford', headline: 'Robotics researcher looking for industry mentors and collaboration opportunities', lookingFor: ['mentor', 'project_partner'], offering: ['co_author'], skills: ['robotics', 'computer vision', 'control systems', 'ROS'] },
];

const LOOKING_FOR_LABELS: Record<string, string> = {
  co_author: 'Co-author', project_partner: 'Project partner',
  peer_reviewer: 'Peer reviewer', mentor: 'Mentor', mentee: 'Mentee',
};

export default function NetworkPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [connectModal, setConnectModal] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const filtered = DEMO_PROFILES.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filter === 'my_field') return p.field === 'ai_ml';
    if (filter !== 'all') return p.lookingFor.includes(filter);
    return true;
  });

  const connectProfile = DEMO_PROFILES.find(p => p.id === connectModal);

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-xl font-medium">Collaboration Network</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Connect with other extraordinary professionals</p>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto scroll-shadow-x">
          {[{ v: 'all', l: 'All' }, { v: 'my_field', l: 'My Field' }, { v: 'co_author', l: 'Co-authors' }, { v: 'peer_reviewer', l: 'Reviewers' }, { v: 'mentor', l: 'Mentors' }].map(f => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`filter-pill ${filter === f.v ? 'active' : ''}`}
            >
              {f.l}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input type="text" placeholder="Search by name or skills..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 h-9" />
        </div>
      </div>

      {/* Network Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(profile => (
          <Card key={profile.id} padding="md" className="flex flex-col">
            <div className="flex items-start gap-4 mb-4 border-b border-[var(--border)] pb-4">
              <div className="w-10 h-10 rounded bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)] flex-shrink-0">
                {getInitials(profile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">{profile.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text-tertiary)]">
                  <Briefcase className="w-3 h-3" />
                  <span className="truncate">{profile.role}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 flex-1">
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">{profile.headline}</p>

              <div className="mb-4">
                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2">Seeking</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.lookingFor.map(l => (
                    <span key={l} className="text-xs text-[var(--text-primary)] font-medium">#{LOOKING_FOR_LABELS[l].toLowerCase()}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.slice(0, 4).map(s => (
                    <Badge key={s} variant="muted" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="secondary" size="md" className="w-full mt-auto" onClick={() => setConnectModal(profile.id)}>
              Connect
            </Button>
          </Card>
        ))}
      </div>

      {/* Connect Modal */}
      <Modal isOpen={!!connectModal} onClose={() => { setConnectModal(null); setMessage(''); }} title="Connection Request" size="sm">
        {connectProfile && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)]">
              <div className="w-10 h-10 rounded bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-sm font-semibold text-[var(--text-primary)]">
                {getInitials(connectProfile.name)}
              </div>
              <div>
                <p className="text-sm font-medium">{connectProfile.name}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{connectProfile.role}</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Textarea label="Message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Introduce yourself..." maxChars={500} />
              <p className="text-xs text-[var(--text-tertiary)] font-mono text-right">{message.length}/500</p>
            </div>
            
            <Button variant="primary" className="w-full" size="lg" disabled={message.length < 20} onClick={() => { toast.success('Connection Request Sent'); setConnectModal(null); setMessage(''); }}>
              Send Request
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
