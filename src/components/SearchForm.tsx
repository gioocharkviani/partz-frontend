'use client';

import { useState, useRef } from 'react';
import { Search, Upload, X, Zap, ChevronDown, Camera, AlertCircle } from 'lucide-react';

const BRANDS = ['BMW', 'Mercedes-Benz', 'Toyota', 'Volkswagen', 'Audi', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Opel', 'Peugeot', 'Renault', 'Subaru', 'Mitsubishi'];
const YEARS = Array.from({ length: 35 }, (_, i) => String(2024 - i));

type Mode = 'vin' | 'manual';

interface UploadedFile { name: string; url: string; }

export default function SearchForm() {
  const [mode, setMode] = useState<Mode>('vin');
  const [vin, setVin] = useState('');
  const [vinLoading, setVinLoading] = useState(false);
  const [vinDecoded, setVinDecoded] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleVinDecode = async () => {
    if (vin.length < 17) return;
    setVinLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setBrand('BMW');
    setModel('3 Series (E46)');
    setYear('2003');
    setEngine('2.0L Diesel');
    setVinDecoded(true);
    setVinLoading(false);
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadedFile[] = Array.from(incoming).slice(0, 5 - files.length).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Mode toggle */}
      <div className="flex">
        <button
          onClick={() => setMode('vin')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${mode === 'vin' ? 'border-teal text-teal bg-teal-wash' : 'border-transparent text-muted hover:text-dark hover:bg-teal-wash'}`}
        >
          <Zap size={15} />
          VIN Code (Auto-detect)
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${mode === 'manual' ? 'border-teal text-teal bg-teal-wash' : 'border-transparent text-muted hover:text-dark hover:bg-teal-wash'}`}
        >
          <ChevronDown size={15} />
          Choose Manually
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* VIN mode */}
        {mode === 'vin' && (
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
              Vehicle Identification Number (VIN)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  value={vin}
                  onChange={(e) => { setVin(e.target.value.toUpperCase()); setVinDecoded(false); }}
                  maxLength={17}
                  placeholder="e.g. WBABF91040LT52395"
                  className="input-base pr-10 font-mono tracking-widest text-sm"
                />
                {vin && (
                  <button onClick={() => { setVin(''); setVinDecoded(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-dark transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={handleVinDecode}
                disabled={vin.length < 17 || vinLoading}
                className="px-5 py-2.5 bg-teal text-white text-sm font-bold rounded-lg hover:bg-teal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {vinLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Decoding...</>
                ) : (
                  <><Zap size={14} />Decode</>
                )}
              </button>
            </div>
            <p className="text-xs text-subtle mt-1.5 flex items-center gap-1">
              <AlertCircle size={11} />
              17-character VIN found on dashboard or vehicle registration
            </p>
          </div>
        )}

        {/* Vehicle fields â€” shown after VIN decode or in manual mode */}
        {(vinDecoded || mode === 'manual') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Brand</label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="input-base bg-white appearance-none">
                <option value="">Select Brand</option>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Model</label>
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. 3 Series, Golf" className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="input-base bg-white appearance-none">
                <option value="">Select Year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Engine</label>
              <input value={engine} onChange={(e) => setEngine(e.target.value)} placeholder="e.g. 2.0L Diesel, 1.6T" className="input-base" />
            </div>
          </div>
        )}

        {vinDecoded && (
          <div className="flex items-center gap-2 p-3 bg-teal/10 rounded-xl border border-teal/20 text-sm text-teal font-semibold">
            <Zap size={14} className="fill-teal" />
            Vehicle detected: {brand} {model} {year} Â· {engine}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            Describe the part you need
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="E.g. Right front door mirror with turn signal, OEM preferred..."
            className="input-base resize-none"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
            Upload Photos <span className="text-subtle font-normal normal-case">(broken/damaged part)</span>
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragOver ? 'border-teal bg-teal/5' : 'border-teal-border hover:border-teal/50 hover:bg-teal-wash'}`}
          >
            <Camera size={24} className="mx-auto mb-2 text-subtle" />
            <p className="text-sm font-medium text-muted">Drop photos here or <span className="text-teal font-bold">browse</span></p>
            <p className="text-xs text-subtle mt-0.5">PNG, JPG up to 10MB Â· max 5 files</p>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
          </div>

          {files.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {files.map((f, i) => (
                <div key={i} className="relative group">
                  <img src={f.url} alt={f.name} className="w-16 h-16 object-cover rounded-lg border-2 border-teal-border" />
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button className="btn-primary w-full text-base py-4 rounded-xl justify-center">
          <Search size={18} />
          Find My Part
        </button>
      </div>
    </div>
  );
}

