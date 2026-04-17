'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/ui/Drawer';
import { CRITERION_LABELS, CRITERION_DESCRIPTIONS, formatDate } from '@/lib/utils';
import { Plus, Search, FileText, Upload, Link as LinkIcon, Lock, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { addEvidenceAction } from '@/app/actions/vault';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'strength', label: 'Strength (high-low)' },
  { value: 'criterion', label: 'Criterion' },
];

interface EvidenceItem {
  id: string;
  title: string;
  criterion: string;
  strength: string;
  strengthScore: number;
  description?: string;
  organization?: string;
  date?: string;
  fileType?: string | null;
}

export default function VaultClient({ initialEvidence }: { initialEvidence: EvidenceItem[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('newest');
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [submitting, setSubmitting] = useState(false);

  const filtered = initialEvidence.filter(item => {
    if (filter && item.criterion !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'strength') return b.strengthScore - a.strengthScore;
    if (sort === 'criterion') return a.criterion.localeCompare(b.criterion);
    return 0;
  });

  const handleAddEvidence = async (formData: FormData) => {
    setSubmitting(true);
    formData.append('uploadType', uploadTab);
    
    // Calls Next.js 15 Server Action
    const result = await addEvidenceAction(null, formData);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Evidence added successfully! AI is analyzing...');
      setDrawerOpen(false);
      setNewTitle(''); setNewCriterion(''); setNewDescription('');
      setNewOrg(''); setNewDate(''); setNewUrl('');
    }
    
    setSubmitting(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-fade-in space-y-12">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl md:text-2xl font-light tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-serif)' }}>Evidence vault</h1>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[var(--border)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
           <Lock className="w-3 h-3" /> Private
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between border-b border-[var(--border)] pb-8">
        <div className="relative flex-1 max-w-sm w-full">
          <input
            type="text"
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 border-b border-[var(--border)] bg-transparent text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-tertiary)] rounded-none"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-xs text-[var(--text-secondary)] focus:outline-none cursor-pointer uppercase tracking-wider font-mono border-none"
          >
            <option value="">All Criteria</option>
            {Object.entries(CRITERION_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-xs text-[var(--text-secondary)] focus:outline-none cursor-pointer uppercase tracking-wider font-mono border-none"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-1.5 text-[var(--text-primary)] hover:opacity-70 transition-opacity uppercase tracking-wider text-[10px] font-mono border border-[var(--border)] px-3 py-1.5">
            <Plus className="w-3 h-3" /> Add evidence
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
        {filtered.map((item, i) => {
           // We use a subtle noise or pastel color placeholder to give an image-like feel
           const isFile = !!item.fileType;
           
           return (
             <div 
               key={item.id} 
               className="relative flex items-start gap-5 group cursor-pointer" 
               onClick={() => setDetailId(item.id)}
             >
                {/* Visual Square Thumbnail */}
                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[var(--bg-muted)] flex items-center justify-center box-border border border-transparent group-hover:border-[var(--text-tertiary)] transition-colors duration-500">
                   {isFile ? <FileText className="w-6 h-6 text-[var(--text-tertiary)]" strokeWidth={1} /> : <LinkIcon className="w-6 h-6 text-[var(--text-tertiary)]" strokeWidth={1} />}
                </div>

                {/* Info Details */}
                <div className="flex-1 min-w-0 pr-6 pt-1">
                   <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</h3>
                   <div className="text-[11px] text-[var(--text-tertiary)] flex gap-1 mt-1 font-serif">
                     <span className="italic">by:</span>
                     <span className="uppercase tracking-wider font-sans font-medium text-[var(--text-secondary)]">{item.organization || 'Unknown'}</span>
                   </div>
                   
                   <p className="text-[10px] text-[var(--text-tertiary)] mt-6 font-mono tracking-widest uppercase">
                     Saved: {formatDate(item.date ?? '')}
                   </p>
                </div>

                {/* Action icon top right */}
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
             </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 flex items-center justify-center text-[var(--text-tertiary)] text-sm font-mono uppercase tracking-widest">
          No items found.
        </div>
      )}

      <div className="pt-16 pb-8 border-t border-[var(--border)] mt-16">
        <p className="text-xs text-[var(--text-tertiary)] font-serif italic">
          Works you&apos;ve uploaded to your vault.
        </p>
      </div>

      {/* Add Evidence Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add evidence">
        <form action={handleAddEvidence} className="space-y-6">
          <Input name="title" label="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g., IEEE Best Paper Award 2024" />
          <Select
            name="criterion"
            label="USCIS Criterion"
            value={newCriterion}
            onChange={e => setNewCriterion(e.target.value)}
            options={Object.entries(CRITERION_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            placeholder="Select criterion category"
          />
          {newCriterion && (
            <p className="text-xs text-[var(--text-tertiary)] -mt-2 uppercase tracking-wide font-mono">
              {CRITERION_DESCRIPTIONS[newCriterion]}
            </p>
          )}
          <Textarea name="description" label="Description" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Describe this evidence..." maxChars={2000} />

          {/* Upload Tabs (Minimalist) */}
          <div className="space-y-4">
            <div className="flex border-b border-[var(--border)]">
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${uploadTab === 'file' ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
              >
                File
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('url')}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${uploadTab === 'url' ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
              >
                URL
              </button>
            </div>

            {uploadTab === 'file' ? (
              <div className="border border-[var(--border)] p-12 flex flex-col items-center justify-center text-center hover:border-[var(--text-primary)] transition-colors cursor-pointer bg-transparent">
                <Upload className="w-5 h-5 text-[var(--text-primary)] mb-4" strokeWidth={1} />
                <p className="text-xs uppercase tracking-widest font-mono text-[var(--text-primary)]">Upload</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-2 font-mono">PDF, DOCX, JPG, PNG / MAX 25MB</p>
              </div>
            ) : (
              <Input name="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://example.com/evidence" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input name="organization" label="Issuing organization" value={newOrg} onChange={e => setNewOrg(e.target.value)} placeholder="e.g., IEEE, Nature" />
            <Input name="date" label="Date issued" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
          </div>

          <Button type="submit" className="w-full mt-4" size="lg" loading={submitting} disabled={!newTitle || !newCriterion}>
            Save to Vault
          </Button>
        </form>
      </Drawer>

      <Drawer isOpen={!!detailId} onClose={() => setDetailId(null)} title="Evidence Details">
         <div className="p-4 text-sm text-[var(--text-secondary)] font-mono">Detail view...</div>
      </Drawer>

    </div>
  );
}
