'use client';
import { useRouter } from 'next/navigation';

import { useState, useEffect, useMemo, useCallback, useActionState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CRITERION_LABELS, CRITERION_DESCRIPTIONS, formatDate, formatBytes } from '@/lib/utils';
import {
  Plus, Search, FileText, Upload, Link as LinkIcon, Lock,
  ArrowUpRight, TrendingUp, X, Calendar, Building2,
  Sparkles, Lightbulb, Trash2, ExternalLink, Shield, ChevronRight,
  Filter, ArrowDownAZ,
  Award, Users, Newspaper, Scale, GraduationCap, Briefcase, DollarSign, Activity, BookOpen, Download, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { addEvidenceAction, deleteEvidenceAction } from '@/app/actions/vault';

/* ────────────────────────────────────────── */
/*  Constants                                 */
/* ────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'strength_desc', label: 'Strongest first' },
  { value: 'strength_asc', label: 'Weakest first' },
  { value: 'criterion', label: 'By criterion' },
  { value: 'alpha', label: 'A → Z' },
];

const CRITERION_OPTIONS = Object.entries(CRITERION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/* ────────────────────────────────────────── */
/*  Types                                     */
/* ────────────────────────────────────────── */

interface EvidenceItem {
  id: string;
  title: string;
  criterion: string;
  description?: string;
  organization?: string;
  date?: string;
  fileType?: string | null;
  fileSize?: number | null;
  externalUrl?: string;
  fileObj?: File;
  strengthScore?: number;
}

/* ────────────────────────────────────────── */
/*  Animation Variants                        */
/* ────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/* ────────────────────────────────────────── */
/*  Helpers                                   */
/* ────────────────────────────────────────── */



function getCriterionIcon(criterion: string) {
  switch (criterion) {
    case 'awards': return Award;
    case 'membership': return Users;
    case 'press': return Newspaper;
    case 'judging': return Scale;
    case 'scholarly_articles': return GraduationCap;
    case 'critical_role': return Briefcase;
    case 'high_salary': return DollarSign;
    case 'commercial_success': return Activity;
    case 'original_contributions': return Lightbulb;
    default: return BookOpen;
  }
}

/* ────────────────────────────────────────── */
/*  Component                                 */
/* ────────────────────────────────────────── */

export default function VaultClient({ initialEvidence }: { initialEvidence: EvidenceItem[] }) {
  // ── Local evidence state (simulates DB) ──
  const [evidence, setEvidence] = useState<EvidenceItem[]>(initialEvidence);

  // Sync state when server data changes (e.g. after adding/deleting items)
  useEffect(() => {
    // Merge server data with our local fileObj cache so previews aren't lost
    setEvidence(prev => {
      const fileCache = new Map(prev.map(item => [item.title, item.fileObj]));
      return initialEvidence.map(item => ({
        ...item,
        fileObj: item.fileObj || fileCache.get(item.title) || undefined
      }));
    });
  }, [initialEvidence]);

  const router = useRouter();

  // ── Toolbar state ──
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('newest');

  // ── Drawer / Modal state ──
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<EvidenceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewActive, setPreviewActive] = useState(false);

  // ── Add evidence form state ──
  const [newTitle, setNewTitle] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // ── Filtered & sorted evidence ──
  const filtered = useMemo(() => {
    let result = evidence.filter(item => {
      if (filter && item.criterion !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.organization || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q)
        );
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case 'strength_desc': return (b.strengthScore || 0) - (a.strengthScore || 0);
        case 'strength_asc': return (a.strengthScore || 0) - (b.strengthScore || 0);
        case 'criterion': return a.criterion.localeCompare(b.criterion);
        case 'alpha': return a.title.localeCompare(b.title);
        case 'oldest': return (a.date || '').localeCompare(b.date || '');
        case 'newest':
        default: return (b.date || '').localeCompare(a.date || '');
      }
    });

    return result;
  }, [evidence, search, filter, sort]);

  // ── Stats ──
  const totalItems = evidence.length;
  const targetItems = 25;
  const avgStrength = totalItems > 0
    ? Math.round(evidence.reduce((sum, e) => sum + (e.strengthScore || 0), 0) / totalItems)
    : 0;
  const completionPct = Math.min(100, Math.round((totalItems / targetItems) * 100));
  const criterionCoverage = new Set(evidence.map(e => e.criterion)).size;

  // ── Actions ──
  const handleDownload = useCallback((e: React.MouseEvent, item: EvidenceItem) => {
    e.stopPropagation();
    toast.success('Beginning download...');
    setTimeout(() => {
       let url;
       if (item.fileObj) {
         url = URL.createObjectURL(item.fileObj);
       } else {
         const blob = new Blob([`Evidence Document: ${item.title}\n\nDescription: ${item.description || "No description provided."}\n\nOrganization: ${item.organization || "N/A"}\nCriterion: ${CRITERION_LABELS[item.criterion] || item.criterion}`], { type: 'text/plain' });
         url = URL.createObjectURL(blob);
       }
       const a = document.createElement('a');
       a.href = url;
       a.download = item.fileObj ? `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${item.fileObj.name.split('.').pop()}` : `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
    }, 1000);
  }, []);

  const handlePreview = useCallback((e: React.MouseEvent, item: EvidenceItem) => {
    e.stopPropagation();
    setPreviewActive(true);
  }, []);

  const resetForm = useCallback(() => {
    setNewTitle('');
    setNewCriterion('');
    setNewDescription('');
    setNewOrg('');
    setNewDate('');
    setNewUrl('');
    setUploadTab('file');
    setSelectedFile(null);
    setFormErrors({});
  }, []);

  const handleAddEvidence = useCallback(async () => {
    // Validate
    const errors: Record<string, string> = {};
    if (!newTitle.trim()) errors.title = 'Title is required';
    if (!newCriterion) errors.criterion = 'Select a criterion';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormErrors({});

    const formData = {
      title: newTitle.trim(),
      criterion: newCriterion as any,
      description: newDescription.trim() || undefined,
      organization: newOrg.trim() || undefined,
      date: newDate || new Date().toISOString().split('T')[0],
      url: uploadTab === 'url' ? newUrl : undefined,
      uploadType: uploadTab,
      fileType: uploadTab === 'file' ? (
        selectedFile?.type === '' || selectedFile?.type === 'text/plain' 
          ? (selectedFile?.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : selectedFile?.type)
          : selectedFile?.type || null
      ) : null,
      fileSize: uploadTab === 'file' ? selectedFile?.size || null : null,
    };

    const res = await addEvidenceAction(formData);

    if (res.error) {
      toast.error(res.error);
      setSubmitting(false);
      return;
    }

    // Temporarily stash the physical File into local UI memory so the preview
    // continues working without S3 blob storage upload
    if (uploadTab === 'file' && selectedFile) {
       setEvidence(prev => [
         { ...formData, id: 'temp-'+Date.now(), fileObj: selectedFile } as unknown as EvidenceItem,
         ...prev
       ]);
    }

    setSubmitting(false);
    setDrawerOpen(false);
    resetForm();
    toast.success('Evidence stored securely');
    router.refresh();
  }, [newTitle, newCriterion, newDescription, newOrg, newDate, newUrl, uploadTab, selectedFile, resetForm, router]);

  const handleDelete = useCallback(async (id: string) => {
    const res = await deleteEvidenceAction(id);
    if (res.error) {
       toast.error(res.error);
    } else {
       toast.success('Evidence removed');
       router.refresh();
    }
    setDeleteConfirmId(null);
    setDetailItem(null);
  }, [router]);

  return (
    <motion.div
      className="max-w-[1100px] mx-auto py-2 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ─── Header ─── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium text-[var(--text-primary)] tracking-tight">Evidence Vault</h1>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--bg-muted)] text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
            <Lock className="w-3 h-3" /> Encrypted
          </div>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setDrawerOpen(true); }}>
          <Plus className="w-3.5 h-3.5" /> Add Evidence
        </Button>
      </motion.div>


      {/* ─── Toolbar ─── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field h-9"
            style={{ paddingLeft: '2.25rem' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-auto text-xs h-9 py-0 pr-6 appearance-none cursor-pointer"
              style={{ paddingLeft: '1.75rem' }}
            >
              <option value="" className="bg-[var(--bg)] text-[var(--text-primary)]">All Criteria</option>
              {CRITERION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[var(--bg)] text-[var(--text-primary)]">{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <ArrowDownAZ className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)] pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto text-xs h-9 py-0 pr-6 appearance-none cursor-pointer"
              style={{ paddingLeft: '1.75rem' }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[var(--bg)] text-[var(--text-primary)]">{opt.label}</option>
              ))}
            </select>
          </div>

          {(search || filter) && (
            <button
              onClick={() => { setSearch(''); setFilter(''); }}
              className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* ─── Results Count ─── */}
      {(search || filter) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[var(--text-tertiary)]"
        >
          Showing {filtered.length} of {totalItems} evidence items
          {filter && <> in <strong className="text-[var(--text-secondary)]">{CRITERION_LABELS[filter]}</strong></>}
          {search && <> matching &ldquo;<strong className="text-[var(--text-secondary)]">{search}</strong>&rdquo;</>}
        </motion.p>
      )}

      {/* ─── Grid ─── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title={search || filter ? 'No matching evidence' : 'No evidence yet'}
          description={
            search || filter
              ? 'Try adjusting your search or filter criteria.'
              : 'Add your first piece of evidence to begin building your petition case.'
          }
          action={
            search || filter
              ? <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setFilter(''); }}>Clear Filters</Button>
              : <Button size="sm" onClick={() => { resetForm(); setDrawerOpen(true); }}><Plus className="w-3.5 h-3.5" /> Add Evidence</Button>
          }
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const isFile = !!item.fileType;
              return (
                <motion.div
                  layout
                  variants={cardVariants}
                  key={item.id}
                  exit="exit"
                >
                  <Card
                    padding="none"
                    hover
                    className="group cursor-pointer h-full flex flex-col overflow-hidden"
                    onClick={() => setDetailItem(item)}
                  >


                    <div className="p-5 flex flex-col flex-1">
                      {/* Title */}
                      <div className="mb-2">
                        <h3 className="text-[14px] font-medium text-[var(--text-primary)] line-clamp-2 leading-snug transition-colors duration-200">
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Description */}
                      <div className="mb-4 flex-1">
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                          {item.description || "No description provided."}
                        </p>
                      </div>

                      {/* Criteria */}
                      <div className="mb-4 flex items-center gap-1.5">
                        {(() => {
                           const Icon = getCriterionIcon(item.criterion);
                           return <Icon className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />;
                        })()}
                        <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                          {CRITERION_LABELS[item.criterion] || item.criterion}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-[var(--border)] mt-auto">
                        {item.externalUrl ? (
                          <Button
                             variant="secondary"
                             size="sm"
                             className="flex-1 text-[11px] h-8 px-2 bg-transparent"
                             onClick={(e) => {
                               e.stopPropagation();
                               window.open(item.externalUrl, '_blank');
                             }}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Visit
                          </Button>
                        ) : (
                          <Button
                             variant="secondary"
                             size="sm"
                             className="flex-1 text-[11px] h-8 px-2 bg-transparent"
                             onClick={(e) => handleDownload(e, item)}
                          >
                            <Download className="w-3.5 h-3.5 mr-1" /> Download
                          </Button>
                        )}
                        <Button
                           size="sm"
                           className="flex-1 text-[11px] h-8 px-2"
                           onClick={(e) => { e.stopPropagation(); setDetailItem(item); }}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> See Evidence
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ─── Add Evidence Drawer ─── */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Evidence">
        <div className="space-y-5">
          {/* Upload type tabs */}
          <div className="flex rounded-md border border-[var(--border)] overflow-hidden">
            <button
              type="button"
              onClick={() => setUploadTab('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all duration-150 ${
                uploadTab === 'file'
                  ? 'bg-[var(--text-primary)] text-[var(--bg)]'
                  : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all duration-150 border-l border-[var(--border)] ${
                uploadTab === 'url'
                  ? 'bg-[var(--text-primary)] text-[var(--bg)]'
                  : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Link URL
            </button>
          </div>

          {/* File upload zone / URL input */}
          {uploadTab === 'file' ? (
            <div 
               className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:border-[var(--text-tertiary)] transition-colors cursor-pointer relative"
               onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" />
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-8 h-8 text-[var(--blue)] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{selectedFile.name}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{formatBytes(selectedFile.size)} • Click to change file</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Drop your file here, or click to browse</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">PDF, DOC, DOCX, JPG, PNG up to 25MB</p>
                </>
              )}
            </div>
          ) : (
            <Input
              label="External URL"
              placeholder="https://example.com/article"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              hint="Link to a published article, patent, or profile"
            />
          )}

          <div className="h-px bg-[var(--border)]" />

          {/* Title */}
          <Input
            label="Title"
            placeholder="e.g., IEEE Best Paper Award 2024"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            error={formErrors.title}
          />

          {/* Criterion */}
          <Select
            label="Criterion"
            options={CRITERION_OPTIONS}
            placeholder="Select a criterion..."
            value={newCriterion}
            onChange={(e) => setNewCriterion(e.target.value)}
            error={formErrors.criterion}
          />

          {newCriterion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border)]"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[var(--blue)] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {CRITERION_DESCRIPTIONS[newCriterion]}
              </p>
            </motion.div>
          )}

          {/* Organization + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Organization"
              placeholder="e.g., IEEE, Nature"
              value={newOrg}
              onChange={(e) => setNewOrg(e.target.value)}
            />
            <Input
              label="Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Describe this evidence and how it demonstrates extraordinary ability..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            maxChars={500}
          />


          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="md"
              className="flex-1"
              loading={submitting}
              onClick={handleAddEvidence}
            >
              {submitting ? 'Analyzing...' : 'Add Evidence'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* ─── Evidence Detail Modal ─── */}
      <Modal 
        isOpen={!!detailItem} 
        onClose={() => { setDetailItem(null); setPreviewActive(false); }} 
        title={detailItem?.title || ''} 
        size="lg"
      >
        {detailItem && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Evidence Viewer Pane */}
            <div className="flex-1 bg-[var(--bg-muted)] border border-[var(--border)] rounded-xl min-h-[300px] flex flex-col items-center justify-center text-[var(--text-tertiary)] p-6 text-center relative overflow-hidden">
                 {previewActive ? (
                   <div className="absolute inset-0 w-full h-full bg-[var(--bg)] flex flex-col z-10 overflow-hidden">
                      {detailItem.fileObj ? (
                         detailItem.fileObj.type.startsWith('image/') ? (
                           <img src={URL.createObjectURL(detailItem.fileObj)} alt="preview" className="object-contain w-full h-full" />
                         ) : (
                           <iframe 
                             src={URL.createObjectURL(
                               (!detailItem.fileObj.type || detailItem.fileObj.type === 'text/plain') && detailItem.fileObj.name.toLowerCase().endsWith('.pdf') 
                                 ? new Blob([detailItem.fileObj], { type: 'application/pdf' }) 
                                 : detailItem.fileObj
                             )} 
                             className="w-full h-full border-none bg-white" 
                             title="Document Preview" 
                           />
                         )
                      ) : (
                         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <FileText className="w-12 h-12 mb-4 text-[var(--text-tertiary)] opacity-30" />
                            <p className="font-medium text-[var(--text-secondary)] mb-2">Simulated Document</p>
                            <div className="w-full max-w-sm h-48 bg-white/5 rounded border border-[var(--border)] p-4 text-left overflow-y-auto custom-scrollbar shadow-inner text-[10px] sm:text-xs">
                               <p><strong className="text-[var(--blue)]">Title:</strong> {detailItem.title}</p>
                               <p className="mt-2 text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Description:</strong> {detailItem.description || "N/A"}</p>
                               <p className="mt-2 text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Criterion:</strong> {CRITERION_LABELS[detailItem.criterion] || detailItem.criterion}</p>
                            </div>
                         </div>
                      )}
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 border-none backdrop-blur-sm shadow-xl"
                        onClick={() => setPreviewActive(false)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                   </div>
                 ) : detailItem.externalUrl ? (
                 <>
                    <LinkIcon className="w-10 h-10 mb-3 text-[var(--blue)] mx-auto" />
                    <p className="font-medium text-[var(--text-primary)]">External Link Evidence</p>
                    <a href={detailItem.externalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--blue)] hover:underline mt-2 flex items-center justify-center gap-1">
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                 </>
               ) : (
                 <>
                    <FileText className="w-12 h-12 mb-3 text-[var(--blue)] mx-auto opacity-80" />
                    <p className="font-medium text-[var(--text-primary)] mb-1">Document Preview</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {detailItem.fileType === 'application/pdf' ? 'PDF Document' : 'Uploaded File'} • {formatBytes(detailItem.fileSize || 1234567)}
                    </p>
                    <div className="flex items-center gap-2 mt-6 w-full max-w-[240px]">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="text-xs h-8 flex-1 bg-transparent"
                        onClick={(e) => handlePreview(e, detailItem)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-2" /> Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-xs h-8 flex-1"
                        onClick={(e) => handleDownload(e, detailItem)}
                      >
                        <Download className="w-3.5 h-3.5 mr-2" /> Download
                      </Button>
                    </div>
                 </>
               )}
            </div>

            {/* Info Pane */}
            <div className="flex-1 space-y-6">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">
                  {CRITERION_LABELS[detailItem.criterion] || detailItem.criterion}
                </Badge>
                {detailItem.fileType && (
                  <Badge variant="muted">
                    <FileText className="w-3 h-3" /> {detailItem.fileType === 'application/pdf' ? 'PDF' : 'Document'}
                  </Badge>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {detailItem.organization && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">Organization</span>
                    <p className="text-sm text-[var(--text-primary)] font-medium flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      {detailItem.organization}
                    </p>
                  </div>
                )}
                {detailItem.date && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">Date</span>
                    <p className="text-sm text-[var(--text-primary)] font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      {formatDate(detailItem.date)}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {detailItem.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Description</h4>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">{detailItem.description}</p>
                </div>
              )}
            </div>
          </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteConfirmId(detailItem.id)}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setDetailItem(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Delete Confirmation Modal ─── */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Evidence" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to remove this evidence? This action cannot be undone and will affect your petition strength score.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
