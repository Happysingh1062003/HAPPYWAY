'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { getInitials, FIELD_LABELS } from '@/lib/utils';
import { Search, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_PROFILES = [
  { id: '1', name: 'Dr. Sarah Chen', field: 'ai_ml', role: 'Research Scientist', org: 'MIT CSAIL', headline: 'AI safety researcher looking for co-authors on interpretability papers', lookingFor: ['co_author', 'peer_reviewer'], offering: ['co_author', 'mentor'], skills: ['machine learning', 'NLP', 'interpretability', 'Python'], badges: 3, color: '#2563EB' },
  { id: '2', name: 'Raj Patel', field: 'biotech', role: 'Principal Scientist', org: 'Moderna', headline: 'Biotech innovator, open to cross-disciplinary collaborations in AI+Bio', lookingFor: ['project_partner', 'co_author'], offering: ['mentor', 'peer_reviewer'], skills: ['genomics', 'CRISPR', 'drug discovery', 'bioinformatics'], badges: 5, color: '#059669' },
  { id: '3', name: 'Aisha Mohammed', field: 'engineering', role: 'Staff Engineer', org: 'SpaceX', headline: 'Aerospace engineer, looking for mentorship on EB-1A petition strategy', lookingFor: ['mentor'], offering: ['project_partner'], skills: ['propulsion', 'systems engineering', 'CAD', 'simulation'], badges: 2, color: '#D97706' },
  { id: '4', name: 'Dr. Eva Kowalski', field: 'medicine', role: 'Attending Physician', org: 'Mayo Clinic', headline: 'Clinical researcher in oncology, seeking collaborators for multi-center trials', lookingFor: ['co_author', 'project_partner'], offering: ['co_author', 'peer_reviewer', 'mentor'], skills: ['oncology', 'clinical trials', 'biostatistics', 'grant writing'], badges: 4, color: '#DC2626' },
  { id: '5', name: 'Marcus Johnson', field: 'finance', role: 'VP Quantitative Research', org: 'Citadel', headline: 'Quant researcher bridging AI and finance, open to publication partnerships', lookingFor: ['co_author'], offering: ['mentor', 'peer_reviewer'], skills: ['quantitative finance', 'stochastic models', 'risk management'], badges: 2, color: '#7C3AED' },
  { id: '6', name: 'Yuki Tanaka', field: 'research', role: 'Postdoctoral Fellow', org: 'Stanford', headline: 'Robotics researcher looking for industry mentors and collaboration opportunities', lookingFor: ['mentor', 'project_partner'], offering: ['co_author'], skills: ['robotics', 'computer vision', 'control systems', 'ROS'], badges: 1, color: '#0891B2' },
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
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-display text-2xl">Collaboration network</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Connect with other extraordinary professionals for co-authorship, projects, and peer review</p>
      </div>

      {/* Profile Setup Banner */}
      <Card padding="md" className="bg-[var(--blue-bg)] border-[var(--blue)] border-opacity-30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Your collaboration profile is active</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Looking for: Co-author, Peer reviewer · Offering: Mentor</p>
          </div>
          <Button variant="secondary" size="sm">Edit profile</Button>
        </div>
      </Card>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {[{ v: 'all', l: 'All' }, { v: 'my_field', l: 'My Field' }, { v: 'co_author', l: 'Co-authors' }, { v: 'peer_reviewer', l: 'Reviewers' }, { v: 'mentor', l: 'Mentors' }].map(f => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === f.v ? 'bg-[var(--brand)] text-[var(--text-inverse)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >
              {f.l}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input type="text" placeholder="Search by name, field, or skills..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
      </div>

      {/* Network Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(profile => (
          <Card key={profile.id} padding="md">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0" style={{ backgroundColor: profile.color }}>
                {getInitials(profile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">{profile.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{profile.role} · {profile.org}</p>
              </div>
              <Badge variant="muted" className="text-[10px] flex-shrink-0">{FIELD_LABELS[profile.field]}</Badge>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">{profile.headline}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {profile.lookingFor.map(l => (
                <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--blue-bg)] text-[var(--blue)]">
                  Seeks: {LOOKING_FOR_LABELS[l]}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {profile.skills.slice(0, 4).map(s => (
                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-tertiary)]">{s}</span>
              ))}
            </div>

            <Button variant="secondary" size="sm" className="w-full" onClick={() => setConnectModal(profile.id)}>
              <MessageSquare className="w-3 h-3" /> Connect
            </Button>
          </Card>
        ))}
      </div>

      {/* Connect Modal */}
      <Modal isOpen={!!connectModal} onClose={() => { setConnectModal(null); setMessage(''); }} title="Send connection request" size="sm">
        {connectProfile && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: connectProfile.color }}>
                {getInitials(connectProfile.name)}
              </div>
              <div>
                <p className="text-sm font-medium">{connectProfile.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{connectProfile.role} · {connectProfile.org}</p>
              </div>
            </div>
            <Textarea label="Message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Introduce yourself and explain why you'd like to connect..." maxChars={500} />
            <p className="text-xs text-[var(--text-tertiary)]">Min 20 characters required</p>
            <Button className="w-full" disabled={message.length < 20} onClick={() => { toast.success('Connection request sent!'); setConnectModal(null); setMessage(''); }}>
              Send request
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
