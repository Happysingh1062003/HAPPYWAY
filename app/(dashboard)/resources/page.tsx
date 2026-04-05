'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatBytes } from '@/lib/utils';
import { Plus, Globe, Lock, Layers, Search, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_ICONS: Record<string, string> = { document: '📄', link: '🔗', blog: '📝', prompt: '💬', template: '📋', video: '🎥', other: '📎' };
const TYPE_LABELS: Record<string, string> = { document: 'Document', link: 'Link', blog: 'Blog', prompt: 'Prompt', template: 'Template', video: 'Video', other: 'Other' };

const DEMO_RESOURCES = [
  { id: '1', title: 'O-1A Petition Cover Letter Template', type: 'template', description: 'A comprehensive cover letter template specifically designed for O-1A extraordinary ability petitions.', tags: ['o-1a', 'template', 'cover-letter'], fileSize: 245000, isPublic: true, createdAt: '2024-08-15' },
  { id: '2', title: 'USCIS Policy Manual — Extraordinary Ability', type: 'link', description: 'Official USCIS guidance on O-1A classification criteria and evidence requirements.', tags: ['uscis', 'policy', 'official'], externalUrl: 'https://www.uscis.gov/policy-manual', isPublic: false, createdAt: '2024-07-20' },
  { id: '3', title: 'How I Got My O-1A Approved — Blog Post', type: 'blog', description: 'Detailed walkthrough of a successful O-1A petition in AI/ML, including strategy and timeline.', tags: ['experience', 'ai-ml', 'strategy'], externalUrl: 'https://example.com/blog', isPublic: true, createdAt: '2024-09-01' },
  { id: '4', title: 'Evidence Strength Evaluation Prompt', type: 'prompt', description: 'ChatGPT/Claude prompt for evaluating the strength of your evidence against USCIS criteria.', tags: ['ai', 'prompt', 'evaluation'], isPublic: true, createdAt: '2024-10-05' },
  { id: '5', title: 'Recommendation Letter Guidelines', type: 'document', description: 'Guidelines and examples for requesting strong recommendation letters from experts in your field.', tags: ['rec-letter', 'guidelines'], fileSize: 189000, isPublic: false, createdAt: '2024-06-12' },
  { id: '6', title: 'USCIS Criteria Explainer Video', type: 'video', description: 'Video breakdown of all 8 O-1A criteria with examples of strong evidence for each.', tags: ['video', 'criteria', 'tutorial'], externalUrl: 'https://youtube.com/example', isPublic: true, createdAt: '2024-11-01' },
];

const FILTER_TABS = ['all', 'document', 'link', 'blog', 'prompt', 'template', 'video', 'other'];

export default function ResourcesPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = DEMO_RESOURCES.filter(r => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">Resource library</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Your personal library — documents, links, blogs, prompts, and anything useful</p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}><Plus className="w-4 h-4" /> Add resource</Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${filter === tab ? 'bg-[var(--accent)] text-[var(--text-inverse)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
          >
            {tab === 'all' ? 'All' : TYPE_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <input type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Layers className="w-6 h-6" />} title="No resources found" description="Add resources to your library to keep everything organized" action={<Button onClick={() => setDrawerOpen(true)}><Plus className="w-4 h-4" /> Add resource</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(resource => (
            <Card key={resource.id} padding="md" className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{TYPE_ICONS[resource.type]}</span>
                <Badge variant="muted">{TYPE_LABELS[resource.type]}</Badge>
                {resource.isPublic ? (
                  <Globe className="w-3 h-3 text-[var(--green)] ml-auto" />
                ) : (
                  <Lock className="w-3 h-3 text-[var(--text-tertiary)] ml-auto" />
                )}
              </div>
              <h3 className="text-sm font-medium mb-1 line-clamp-2">{resource.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 flex-1">{resource.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-tertiary)]">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-3 border-t border-[var(--border)]">
                <span>
                  {resource.fileSize ? formatBytes(resource.fileSize) : resource.externalUrl ? new URL(resource.externalUrl).hostname : ''}
                </span>
                <span>{formatDate(resource.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Resource Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add resource">
        <div className="space-y-5">
          <Input label="Title" placeholder="e.g., O-1A Petition Template" />
          <Textarea label="Description" placeholder="What is this resource about?" maxChars={2000} />
          <Select label="Type" options={Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} placeholder="Select type" />
          <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-secondary)]">Upload file or enter URL below</p>
          </div>
          <Input label="External URL" placeholder="https://..." />
          <Input label="Tags" placeholder="Press Enter to add tags" hint="Comma-separated tags" />
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-muted)]">
            <div>
              <p className="text-sm font-medium">Make public</p>
              <p className="text-xs text-[var(--text-tertiary)]">Others can discover this in the shared library</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-[var(--border-strong)] relative cursor-pointer">
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white" />
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={() => { toast.success('Resource added!'); setDrawerOpen(false); }}>
            Add resource
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
