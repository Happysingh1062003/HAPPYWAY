'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { formatDate, formatBytes } from '@/lib/utils';
import { Plus, Globe, Lock, Layers, Search, Upload, FileText, Link as LinkIcon, PenTool, MessageSquare, LayoutTemplate, Video, Paperclip, type LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPE_ICONS: Record<string, LucideIcon> = { document: FileText, link: LinkIcon, blog: PenTool, prompt: MessageSquare, template: LayoutTemplate, video: Video, other: Paperclip };
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
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl font-medium">Resource Library</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Shared documents, links, and templates</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setDrawerOpen(true)}><Plus className="w-4 h-4" /> Add Resource</Button>
      </div>

      {/* Filter Tabs & Search */}
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

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="input-field pl-9 h-8 text-xs" 
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Layers className="w-6 h-6" />} title="No resources found" description="Add resources to your library to keep everything organized" action={<Button variant="secondary" onClick={() => setDrawerOpen(true)}><Plus className="w-4 h-4" /> Add resource</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(resource => {
            const Icon = TYPE_ICONS[resource.type] || Paperclip;

            return (
              <Card key={resource.id} padding="md" className="flex flex-col">
                <div className="flex items-start justify-between mb-4 border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-[var(--border)] rounded bg-[var(--bg-muted)]">
                      <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">{TYPE_LABELS[resource.type]}</span>
                  </div>
                  {resource.isPublic ? <Globe className="w-4 h-4 text-[var(--text-tertiary)]" /> : <Lock className="w-4 h-4 text-[var(--text-tertiary)]" />}
                </div>
                
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 leading-tight">{resource.title}</h3>
                <p className="text-xs text-[var(--text-tertiary)] line-clamp-3 leading-relaxed mb-6 flex-1">{resource.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  {resource.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-[var(--text-secondary)]">#{tag}</span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                    {resource.fileSize ? formatBytes(resource.fileSize) : resource.externalUrl ? new URL(resource.externalUrl).hostname : 'URL'}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{formatDate(resource.createdAt)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Resource Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add to Library">
        <div className="space-y-6">
          <Input label="Title" placeholder="e.g., Template" />
          <Textarea label="Description" placeholder="Description..." maxChars={2000} />
          <Select label="Type" options={Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} placeholder="Select type" />
          
          <div className="border border-dashed border-[var(--border-strong)] rounded-[var(--radius-md)] p-8 text-center hover:bg-[var(--bg-muted)] transition-colors cursor-pointer">
            <Upload className="w-5 h-5 text-[var(--text-secondary)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--text-primary)]">Select a file</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">or link external below</p>
          </div>
          
          <Input label="External URL" placeholder="https://..." />
          <Input label="Tags" placeholder="Comma separated" />
          
          <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-[var(--radius-md)]">
            <div>
              <p className="text-sm font-medium">Make Public</p>
              <p className="text-xs text-[var(--text-tertiary)]">Others can discover this in the shared library</p>
            </div>
            <div className="w-10 h-5 rounded-full bg-[var(--border)] relative cursor-pointer hover:bg-[var(--text-secondary)] transition-colors">
              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[var(--bg)] shadow-sm transition-transform" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-[var(--border)] mt-8">
             <Button variant="primary" className="w-full h-12" onClick={() => { toast.success('Resource added!'); setDrawerOpen(false); }}>
               Save Resource
             </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
