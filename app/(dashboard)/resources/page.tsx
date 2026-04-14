'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
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
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Resource library</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Your personal library — documents, links, blogs, prompts, and anything useful</p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}><Plus className="w-4 h-4" /> Add resource</Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide border-b border-white/5">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${filter === tab ? 'border-white/20 text-white bg-white/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-white/5'}`}
          >
            {tab === 'all' ? 'All' : TYPE_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="SEARCH RESOURCES..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full bg-[#050505] border border-white/5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 pl-11 py-3.5 tracking-widest" 
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Layers className="w-6 h-6" />} title="No resources found" description="Add resources to your library to keep everything organized" action={<Button onClick={() => setDrawerOpen(true)}><Plus className="w-4 h-4" /> Add resource</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(resource => {
            const Icon = TYPE_ICONS[resource.type] || Paperclip;
            return (
            <div key={resource.id} className="group relative flex flex-col p-6 gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-[var(--brand)]/40 hover:shadow-[0_0_20px_rgba(200,200,200,0.05)] hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm h-full cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                 <div className="flex items-center gap-2 text-[10px] text-[var(--brand)] font-medium uppercase tracking-widest bg-[var(--brand)]/10 px-2.5 py-1 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-[var(--brand)]/20">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{TYPE_LABELS[resource.type]}</span>
                 </div>
                 {resource.isPublic ? <Globe className="w-4 h-4 text-zinc-500" /> : <Lock className="w-4 h-4 text-zinc-600" />}
              </div>
              <div className="flex-1 mt-1">
                 <h3 className="text-base font-semibold text-white mb-2 leading-tight tracking-tight group-hover:text-[var(--brand)] transition-colors">{resource.title}</h3>
                 <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{resource.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {resource.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-zinc-300 border border-white/10 px-2 py-0.5 rounded-md bg-white/5">{tag}</span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{resource.fileSize ? formatBytes(resource.fileSize) : resource.externalUrl ? new URL(resource.externalUrl).hostname : 'URL'}</span>
                <span className="text-[10px] font-mono text-zinc-600 truncate">{formatDate(resource.createdAt)}</span>
              </div>
            </div>
            );
          })}
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
