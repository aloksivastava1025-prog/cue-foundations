/**
 * Cue Foundations · Add Product Wizard Modal
 * ────────────────────────────────────────────
 * A 4-step product-creation modal with drafts, drag-drop image upload, toggle settings, and an animated success screen.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/add-product-wizard-modal.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue064
 *
 * Original Cue ID: cue064
 * Category: Forms
 * ────────────────────────────────────────────
 */

/**
 * Add Product Modal — 4-step wizard with draft, image upload, publish.
 *
 * Usage:
 *   <AddProductModal
 *     open={showModal}
 *     onClose={() => setShowModal(false)}
 *     onPublish={payload => console.log('publish', payload)}
 *   />
 */

import React, { useEffect, useRef, useState } from 'react';

export interface ProductPayload {
  name: string;
  description: string;
  category: string;
  price: string;
  compare: string;
  currency: string;
  images: { name: string; data: string }[];
  publish: boolean;
  guest: boolean;
  inventory: boolean;
  email: boolean;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onPublish?: (payload: ProductPayload) => void | Promise<void>;
  storageKey?: string;
}

const EMPTY: ProductPayload = {
  name: '', description: '', category: '',
  price: '', compare: '', currency: 'USD',
  images: [],
  publish: true, guest: true, inventory: false, email: false,
};

const STEPS = ['General', 'Pricing', 'Files', 'Settings'] as const;

export default function AddProductModal({
  open, onClose, onPublish,
  storageKey = 'mantra.addProduct.draft',
}: AddProductModalProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ProductPayload>(EMPTY);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [phase, setPhase] = useState<'edit' | 'publishing' | 'done'>('edit');
  const [dragOver, setDragOver] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore draft on open
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setData({ ...EMPTY, ...JSON.parse(raw) });
        showToast('Draft restored');
      }
    } catch {}
  }, [open, storageKey]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  if (!open) return null;

  function showToast(msg: string, error = false) {
    setToast({ msg, error });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }

  function validate(currentStep: number): boolean {
    if (currentStep === 1 && !data.name.trim()) {
      setErrors({ name: true }); showToast('Name is required', true); return false;
    }
    if (currentStep === 2 && (!data.price || Number(data.price) <= 0)) {
      setErrors({ price: true }); showToast('Enter a valid price', true); return false;
    }
    return true;
  }

  function goTo(target: number) {
    if (target <= step) { setStep(target); return; }
    if (validate(step)) setStep(step + 1);
  }

  function next() {
    if (!validate(step)) return;
    if (step < STEPS.length) setStep(step + 1);
    else publish();
  }

  function saveDraft() {
    localStorage.setItem(storageKey, JSON.stringify(data));
    showToast('Draft saved');
  }

  async function publish() {
    setPhase('publishing');
    await new Promise(r => setTimeout(r, 900));
    localStorage.removeItem(storageKey);
    await onPublish?.(data);
    setPhase('done');
  }

  function requestClose() {
    if (phase === 'done' || confirm('Discard this product?')) {
      localStorage.removeItem(storageKey);
      setData(EMPTY); setStep(1); setPhase('edit'); setErrors({});
      onClose();
    }
  }

  function updateField<K extends keyof ProductPayload>(key: K, value: ProductPayload[K]) {
    setData(d => ({ ...d, [key]: value }));
    if (errors[key as string]) setErrors(e => ({ ...e, [key]: false }));
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    [...files].forEach(f => {
      if (!f.type.startsWith('image/')) return;
      if (data.images.length >= 10) { showToast('Max 10 images', true); return; }
      const reader = new FileReader();
      reader.onload = () => {
        setData(d => ({ ...d, images: [...d.images, { name: f.name, data: reader.result as string }] }));
      };
      reader.readAsDataURL(f);
    });
  }

  const isLast = step === STEPS.length;
  const primaryLabel = phase === 'publishing' ? 'Publishing…' : (isLast ? 'Publish product' : 'Next step →');

  return (
    <>
      <style>{CSS}</style>
      <div className="apm-scrim">
        <div className="apm-modal" role="dialog" aria-modal="true" aria-labelledby="apm-title">
          <div className="apm-inner">

            {/* HEADER */}
            <div className="apm-header">
              <div className="apm-brand-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div className="apm-header-text">
                <div className="apm-title" id="apm-title">Add Product</div>
                <div className="apm-subtitle">Add a new product to your store.</div>
              </div>
              <button className="apm-close" onClick={requestClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* STEPPER */}
            {phase !== 'done' && (
              <div className="apm-stepper">
                {STEPS.map((label, i) => {
                  const n = i + 1;
                  const state = n === step ? 'active' : n < step ? 'done' : '';
                  return (
                    <div key={label} className={`apm-step ${state}`} onClick={() => goTo(n)}>
                      <span className="apm-step-num">{n < step ? '' : n}</span>
                      {label}
                    </div>
                  );
                })}
              </div>
            )}

            {/* PANELS */}
            <div className="apm-panels">
              {phase === 'done' ? (
                <div className="apm-panel">
                  <div className="apm-success">
                    <div className="apm-success-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div className="apm-success-title">Product added</div>
                    <div className="apm-success-desc">Your product is live on the store.</div>
                    <dl className="apm-summary">
                      <dt>Name</dt><dd>{data.name}</dd>
                      <dt>Price</dt>
                      <dd>{data.currency} {Number(data.price).toFixed(2)}
                        {data.compare && <span className="apm-compare"> {data.currency} {Number(data.compare).toFixed(2)}</span>}
                      </dd>
                      <dt>Images</dt><dd>{data.images.length} attached</dd>
                      <dt>Published</dt><dd>{data.publish ? 'Yes, live now' : 'Draft only'}</dd>
                    </dl>
                  </div>
                </div>
              ) : step === 1 ? (
                <div className="apm-panel">
                  <div className="apm-form-panel">
                    <FormGroup label="Name" required>
                      <input
                        className={`apm-input ${errors.name ? 'error' : ''}`}
                        value={data.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="e.g. Universal Design System"
                      />
                      <div className="apm-help">Give your product a short and clear name.</div>
                    </FormGroup>
                    <FormGroup label="Description">
                      <textarea
                        className="apm-textarea"
                        value={data.description}
                        onChange={e => updateField('description', e.target.value)}
                        placeholder="Powerful Figma Design System for creating landing pages, websites and dashboards."
                      />
                      <div className="apm-help">Give your product a short and clear description.</div>
                    </FormGroup>
                    <FormGroup label="Category">
                      <select className="apm-input" value={data.category} onChange={e => updateField('category', e.target.value)}>
                        <option value="">Select a category…</option>
                        {['Design System','Template','Icons','Illustrations','Font','Other'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </FormGroup>
                  </div>
                  <div className="apm-bottom-help">Set the basics that appear on the product page and search results.</div>
                </div>
              ) : step === 2 ? (
                <div className="apm-panel">
                  <div className="apm-form-panel">
                    <div className="apm-row-2">
                      <FormGroup label="Price" required>
                        <div className="apm-price-wrap">
                          <span className="apm-prefix">$</span>
                          <input
                            className={`apm-input ${errors.price ? 'error' : ''}`}
                            type="number" step="0.01" min="0"
                            value={data.price}
                            onChange={e => updateField('price', e.target.value)}
                            placeholder="49.00"
                          />
                        </div>
                        <div className="apm-help">Base list price.</div>
                      </FormGroup>
                      <FormGroup label="Compare-at">
                        <div className="apm-price-wrap">
                          <span className="apm-prefix">$</span>
                          <input
                            className="apm-input"
                            type="number" step="0.01" min="0"
                            value={data.compare}
                            onChange={e => updateField('compare', e.target.value)}
                            placeholder="79.00"
                          />
                        </div>
                        <div className="apm-help">Shows as strikethrough.</div>
                      </FormGroup>
                    </div>
                    <FormGroup label="Currency">
                      <select className="apm-input" value={data.currency} onChange={e => updateField('currency', e.target.value)}>
                        {['USD','EUR','GBP','INR','JPY'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </FormGroup>
                  </div>
                  <div className="apm-bottom-help">Buyers see the base price; compare-at renders next to it as strikethrough.</div>
                </div>
              ) : step === 3 ? (
                <div className="apm-panel">
                  <div className="apm-form-panel">
                    <FormGroup label="Product images">
                      <label
                        className={`apm-dropzone ${dragOver ? 'drag' : ''}`}
                        onDragEnter={e => { e.preventDefault(); setDragOver(true); }}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                      >
                        <div className="apm-dd-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="15" rx="2"/>
                            <circle cx="8" cy="8" r="1.5"/>
                            <polyline points="21 12 16 7 7 16"/>
                            <line x1="12" y1="18" x2="12" y2="23"/>
                            <polyline points="9 21 12 18 15 21"/>
                          </svg>
                        </div>
                        <div className="apm-dd-text">Drop your images here, or</div>
                        <span className="apm-dd-btn">Click to browse</span>
                        <input type="file" accept="image/*" multiple hidden onChange={e => addFiles(e.target.files)} />
                      </label>
                      {data.images.length > 0 && (
                        <div className="apm-preview-grid">
                          {data.images.map((img, i) => (
                            <div key={i} className="apm-preview" style={{ backgroundImage: `url("${img.data}")` }}>
                              <button className="apm-preview-remove" type="button"
                                onClick={() => setData(d => ({ ...d, images: d.images.filter((_, j) => j !== i) }))}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="apm-bottom-help">Add up to 10 images. Used in checkout, email and social sharing. {data.images.length}/10 selected.</div>
                </div>
              ) : (
                <div className="apm-panel">
                  <div className="apm-form-panel">
                    {([
                      ['publish',   'Publish immediately',    'Product is visible in the storefront on save.'],
                      ['guest',     'Allow guest checkout',   'Buyers can purchase without an account.'],
                      ['inventory', 'Track inventory',        'Deduct stock automatically on purchase.'],
                      ['email',     'Send launch email',      'Notify subscribers when this product goes live.'],
                    ] as const).map(([key, name, desc]) => (
                      <div key={key} className="apm-toggle-row">
                        <div>
                          <div className="apm-toggle-name">{name}</div>
                          <div className="apm-toggle-desc">{desc}</div>
                        </div>
                        <div
                          className={`apm-toggle ${data[key] ? 'on' : ''}`}
                          onClick={() => updateField(key, !data[key] as any)}
                          role="switch" aria-checked={data[key]}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="apm-bottom-help">These settings can be changed later from the product's settings tab.</div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="apm-footer">
              {phase === 'done' ? (
                <>
                  <button className="apm-btn apm-btn-draft" onClick={() => { setData(EMPTY); setStep(1); setPhase('edit'); }}>Add another</button>
                  <button className="apm-btn apm-btn-primary" onClick={requestClose}>View product →</button>
                </>
              ) : (
                <>
                  {step > 1 && <button className="apm-btn apm-btn-back" onClick={() => setStep(step - 1)}>← Back</button>}
                  <button className="apm-btn apm-btn-draft" onClick={saveDraft} disabled={phase === 'publishing'}>Save as draft</button>
                  <button className="apm-btn apm-btn-primary" onClick={next} disabled={phase === 'publishing'}>{primaryLabel}</button>
                </>
              )}
            </div>

          </div>
        </div>

        {toast && (
          <div className="apm-toast show">
            <span className="apm-tick" style={{ color: toast.error ? 'var(--apm-red)' : 'var(--apm-green-fg)' }}>{toast.error ? '!' : '✓'}</span>
            <span>{toast.msg}</span>
          </div>
        )}
      </div>
    </>
  );
}

function FormGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="apm-form-group">
      <label className="apm-label">{label}{required && <span className="apm-req"> *</span>}</label>
      {children}
    </div>
  );
}

const CSS = `
:root {
  --apm-card-bg: #ffffff;
  --apm-border: #ececf1;
  --apm-border-strong: #dedee5;
  --apm-divider: #f2f2f5;
  --apm-text: #0f1114;
  --apm-muted: #7a7d85;
  --apm-brand-50: #eaf0ff;
  --apm-brand-500: #3358df;
  --apm-brand-600: #2949c2;
  --apm-green-bg: #dcf7e3;
  --apm-green-fg: #16a34a;
  --apm-red: #ef4444;
  --apm-chip-bg: #efefef;
}
.apm-scrim {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; z-index: 1000;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--apm-text);
}
.apm-modal {
  background: var(--apm-card-bg); border-radius: 18px;
  width: 100%; max-width: 480px; max-height: calc(100vh - 40px);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06);
}
.apm-modal::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 140px;
  background-image:
    linear-gradient(to right, var(--apm-divider) 1px, transparent 1px),
    linear-gradient(to bottom, var(--apm-divider) 1px, transparent 1px);
  background-size: 20px 20px;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);
  pointer-events: none;
}
.apm-inner { position: relative; padding: 20px 24px 22px; display: flex; flex-direction: column; min-height: 0; flex: 1; }
.apm-header { display: flex; gap: 12px; margin-bottom: 14px; flex-shrink: 0; }
.apm-brand-mark {
  width: 40px; height: 40px; border-radius: 11px;
  background: linear-gradient(180deg, var(--apm-brand-500) 0%, var(--apm-brand-600) 100%);
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(51,88,223,0.35), inset 0 -1px 0 rgba(0,0,0,0.1);
}
.apm-header-text { flex: 1; padding-top: 2px; }
.apm-title { font-size: 17px; font-weight: 600; letter-spacing: -0.3px; }
.apm-subtitle { font-size: 12.5px; color: var(--apm-muted); margin-top: 2px; }
.apm-close {
  background: transparent; border: none;
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--apm-muted); cursor: pointer;
  align-self: flex-start; transition: background 0.15s;
}
.apm-close:hover { background: var(--apm-divider); color: var(--apm-text); }
.apm-stepper {
  background: var(--apm-chip-bg); border-radius: 12px;
  padding: 5px; display: flex; gap: 4px;
  margin-bottom: 14px; flex-shrink: 0;
}
.apm-step {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 7px 6px; border-radius: 8px;
  font-size: 11.5px; font-weight: 500; color: #4b4f57;
  cursor: pointer; user-select: none; transition: all 0.2s;
}
.apm-step:hover { color: var(--apm-text); }
.apm-step.active { background: #fff; color: var(--apm-text); box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.apm-step.done { color: var(--apm-brand-600); }
.apm-step-num {
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--apm-border-strong); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; font-variant-numeric: tabular-nums;
  transition: all 0.2s;
}
.apm-step.active .apm-step-num { background: var(--apm-brand-500); }
.apm-step.done .apm-step-num { background: var(--apm-green-fg); }
.apm-step.done .apm-step-num::after { content: '✓'; font-size: 10px; }
.apm-panels { flex: 1; min-height: 0; overflow-y: auto; margin: 0 -6px; padding: 0 6px; }
.apm-panels::-webkit-scrollbar { width: 6px; }
.apm-panels::-webkit-scrollbar-thumb { background: var(--apm-border-strong); border-radius: 3px; }
.apm-panel { animation: apmFadeIn 0.25s ease; }
@keyframes apmFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.apm-form-panel { border: 1px solid var(--apm-border); border-radius: 12px; padding: 14px; margin-bottom: 10px; }
.apm-form-group { margin-bottom: 12px; }
.apm-form-group:last-child { margin-bottom: 0; }
.apm-label { display: block; font-size: 12px; font-weight: 600; color: var(--apm-text); margin-bottom: 6px; }
.apm-req { color: var(--apm-red); }
.apm-input, .apm-textarea {
  width: 100%; background: #fff;
  border: 1px solid var(--apm-border-strong); border-radius: 8px;
  padding: 9px 11px; font-size: 13px; font-family: inherit; color: var(--apm-text);
  outline: none; transition: border-color 0.15s, box-shadow 0.15s;
}
.apm-input:focus, .apm-textarea:focus { border-color: var(--apm-brand-500); box-shadow: 0 0 0 3px rgba(51,88,223,0.18); }
.apm-input.error { border-color: var(--apm-red); }
.apm-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }
.apm-textarea { resize: none; min-height: 56px; line-height: 1.4; }
.apm-help { font-size: 11px; color: var(--apm-muted); margin-top: 5px; }
.apm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.apm-price-wrap { position: relative; }
.apm-price-wrap .apm-prefix { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--apm-muted); font-size: 13px; pointer-events: none; }
.apm-price-wrap .apm-input { padding-left: 24px; }
.apm-dropzone {
  border: 1.5px dashed var(--apm-border-strong); border-radius: 10px;
  padding: 20px 14px; text-align: center; background: #fafafb;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  cursor: pointer; transition: all 0.2s;
}
.apm-dropzone.drag { border-color: var(--apm-brand-500); background: var(--apm-brand-50); }
.apm-dd-icon { color: var(--apm-brand-500); }
.apm-dd-text { font-size: 12px; color: var(--apm-muted); }
.apm-dd-btn {
  background: #fff; border: 1px solid var(--apm-border-strong); border-radius: 7px;
  padding: 6px 12px; font-size: 11.5px; font-weight: 500; color: var(--apm-text);
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.apm-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 8px; margin-top: 12px; }
.apm-preview { aspect-ratio: 1; border-radius: 8px; background: var(--apm-divider); background-size: cover; background-position: center; position: relative; overflow: hidden; }
.apm-preview-remove {
  position: absolute; top: 4px; right: 4px;
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(0,0,0,0.6); color: #fff; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 12px; line-height: 1;
}
.apm-toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-top: 1px solid var(--apm-divider);
}
.apm-toggle-row:first-child { border-top: none; padding-top: 0; }
.apm-toggle-name { font-size: 13px; font-weight: 500; }
.apm-toggle-desc { font-size: 11px; color: var(--apm-muted); margin-top: 2px; }
.apm-toggle {
  width: 34px; height: 20px; border-radius: 999px;
  background: var(--apm-border-strong); position: relative; cursor: pointer;
  transition: background 0.2s; flex-shrink: 0;
}
.apm-toggle::after {
  content: ''; position: absolute; left: 2px; top: 2px;
  width: 16px; height: 16px; border-radius: 50%; background: #fff;
  transition: transform 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.15);
}
.apm-toggle.on { background: var(--apm-brand-500); }
.apm-toggle.on::after { transform: translateX(14px); }
.apm-bottom-help { font-size: 11px; color: var(--apm-muted); margin: -4px 0 0; line-height: 1.4; }
.apm-success { text-align: center; padding: 12px 8px 4px; }
.apm-success-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--apm-green-bg); color: var(--apm-green-fg);
  margin: 0 auto 14px; display: flex; align-items: center; justify-content: center;
  animation: apmPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes apmPop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
.apm-success-title { font-size: 18px; font-weight: 600; }
.apm-success-desc { font-size: 12.5px; color: var(--apm-muted); margin-top: 6px; }
.apm-summary {
  margin: 18px 0 0; padding: 14px; background: var(--apm-divider);
  border-radius: 10px; text-align: left; font-size: 12px;
}
.apm-summary dt { color: var(--apm-muted); font-weight: 500; margin-top: 6px; }
.apm-summary dt:first-child { margin-top: 0; }
.apm-summary dd { color: var(--apm-text); font-weight: 600; margin: 2px 0 0; }
.apm-compare { color: var(--apm-muted); font-weight: 500; text-decoration: line-through; }
.apm-footer { display: flex; gap: 8px; margin-top: 12px; padding-top: 4px; flex-shrink: 0; }
.apm-btn {
  padding: 10px 16px; border-radius: 9px;
  font-size: 12.5px; font-weight: 600; cursor: pointer; border: none;
  font-family: inherit; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.apm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.apm-btn-draft { background: var(--apm-chip-bg); color: var(--apm-text); }
.apm-btn-draft:hover:not(:disabled) { background: var(--apm-border-strong); }
.apm-btn-primary { background: var(--apm-brand-500); color: #fff; flex: 1; }
.apm-btn-primary:hover:not(:disabled) { background: var(--apm-brand-600); }
.apm-btn-back { background: transparent; color: var(--apm-muted); }
.apm-btn-back:hover:not(:disabled) { color: var(--apm-text); background: var(--apm-divider); }
.apm-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(20px);
  background: #0f1114; color: #fff;
  padding: 10px 16px; border-radius: 10px;
  font-size: 12.5px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  opacity: 0; transition: all 0.25s; z-index: 1001; pointer-events: none;
  display: flex; align-items: center; gap: 8px;
}
.apm-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
@media (max-width: 520px) {
  .apm-modal { max-width: 100%; }
  .apm-inner { padding: 18px 18px 20px; }
  .apm-title { font-size: 16px; }
  .apm-step { font-size: 0; }
  .apm-step-num { margin: 0 auto; }
}
@media (max-width: 380px) { .apm-row-2 { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) {
  .apm-panel, .apm-success-icon, .apm-toast { animation: none !important; transition: none !important; }
}
`;
