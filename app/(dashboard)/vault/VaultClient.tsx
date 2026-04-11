'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/ui/Drawer';
import { CRITERION_LABELS, CRITERION_DESCRIPTIONS, formatDate } from '@/lib/utils';
import { Plus, Search, FileText, Upload, Link as LinkIcon, Check } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Evidence vault</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {initialEvidence.length} items across {new Set(initialEvidence.map(e => e.criterion)).size} criteria
          </p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add evidence
        </Button>
      </div>

      {/* Constraints omitted for brevity, keeping main Vault UI intact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search evidence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-[var(--border)] bg-transparent text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
              />
            </div>
            <Select 
              options={[{ value: '', label: 'All Criteria' }, ...Object.entries(CRITERION_LABELS).map(([v, l]) => ({ value: v, label: l }))]}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="sm:w-48"
            />
            <Select 
              options={SORT_OPTIONS}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="sm:w-40"
            />
          </div>

          <div className="grid gap-3">
            {filtered.map((item) => (
              <Card 
                key={item.id} 
                className="p-4 cursor-pointer hover:border-[var(--text-tertiary)] transition-colors group"
                onClick={() => setDetailId(item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--text-primary)] group-hover:text-[var(--blue)] transition-colors line-clamp-1">{item.title}</h3>
                      {item.fileType ? <FileText className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" /> : <LinkIcon className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-1">{item.organization} • {formatDate(item.date ?? '')}</p>
                  </div>
                  {/* @ts-expect-error - dynamic variant from data */}
                  <Badge variant={item.strength}>{item.strength}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs font-mono font-medium text-[var(--text-tertiary)]">
                    {CRITERION_LABELS[item.criterion as keyof typeof CRITERION_LABELS]}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--green)] font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Analyzed
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-display text-lg mb-4">Strength analysis</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Compelling</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--green)] w-[60%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Solid</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--blue)] w-[30%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Evidence Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add evidence">
        <form action={handleAddEvidence} className="space-y-5">
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
            <p className="text-xs text-[var(--text-tertiary)] -mt-3 p-3 bg-[var(--bg-muted)] rounded border border-[var(--border)]">
              {CRITERION_DESCRIPTIONS[newCriterion]}
            </p>
          )}
          <Textarea name="description" label="Description" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Describe this evidence..." maxChars={2000} />

          {/* Upload Tabs */}
          <div>
            <div className="flex p-0.5 bg-[var(--bg-muted)] rounded-lg mb-4">
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${uploadTab === 'file' ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('url')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${uploadTab === 'url' ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Provide URL
              </button>
            </div>

            {uploadTab === 'file' ? (
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[var(--text-tertiary)] transition-colors cursor-pointer bg-[var(--bg-subtle)]">
                <Upload className="w-6 h-6 text-[var(--text-tertiary)] mb-2" />
                <p className="text-sm font-medium text-[var(--text-primary)]">Click to upload or drag and drop</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">PDF, DOCX, JPG, PNG — max 25MB</p>
              </div>
            ) : (
              <Input name="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://example.com/evidence" />
            )}
          </div>

          <Input name="organization" label="Issuing organization" value={newOrg} onChange={e => setNewOrg(e.target.value)} placeholder="e.g., IEEE, Nature, USPTO" />
          <Input name="date" label="Date issued" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />

          <Button type="submit" className="w-full" size="lg" loading={submitting} disabled={!newTitle || !newCriterion}>
            Add evidence
          </Button>
        </form>
      </Drawer>

      {/* Detail Drawer placeholder (unchanged essentially) ... */}
      <Drawer isOpen={!!detailId} onClose={() => setDetailId(null)} title="Evidence Details">
         <div className="p-4 text-sm text-[var(--text-secondary)]">Detail view</div>
      </Drawer>

    </div>
  );
}

// Remove the custom Check function since we will import it from lucide-react
