import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { absorbBibleJson } from '../utils/jsonImporter';
import type { BibleTranslation } from '../types/bible';

interface JsonImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (translation: BibleTranslation) => void;
}

export const JsonImporterModal: React.FC<JsonImporterModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewInfo, setPreviewInfo] = useState<{
    name: string;
    booksCount: number;
    sampleVerse: string;
    translation: BibleTranslation;
  } | null>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    setPreviewInfo(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const fallbackName = customName.trim() || file.name.replace(/\.[^/.]+$/, '');
      const parsedTranslation = absorbBibleJson(json, fallbackName);

      if (parsedTranslation.books.length === 0) {
        throw new Error('No books found in this file.');
      }

      const firstBook = parsedTranslation.books[0];
      const firstChap = firstBook.chapters[0];
      const firstVerse = firstChap?.verses[0];
      const sample = firstVerse
        ? `${firstBook.name} ${firstChap.chapter}:${firstVerse.verse} - "${firstVerse.text}"`
        : 'No verses preview available';

      setPreviewInfo({
        name: parsedTranslation.name,
        booksCount: parsedTranslation.books.length,
        sampleVerse: sample,
        translation: parsedTranslation,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse JSON file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (previewInfo) {
      const finalTranslation = {
        ...previewInfo.translation,
        name: customName.trim() || previewInfo.translation.name,
      };
      onImportSuccess(finalTranslation);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Absorb / Import Bible JSON</h2>
              <p className="text-xs text-slate-400">Import any standard or nested JSON translation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Custom Translation Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. World English Bible (WEB), ESV, NIV, etc."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
              isDragging
                ? 'border-amber-400 bg-amber-500/5'
                : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="p-3 bg-slate-800 rounded-full text-slate-300 shadow-inner">
              <FileText className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Click to browse or drop your Bible JSON file here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports hierarchical books/chapters, flat verses array, or object mappings
              </p>
            </div>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 py-3 text-amber-400 text-sm">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing & absorbing Bible data...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start space-x-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Import Error</p>
                <p className="text-xs text-red-400 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {previewInfo && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>Format Recognized & Parsed!</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 pl-7">
                <p>
                  <strong className="text-slate-200">Name:</strong> {customName || previewInfo.name}
                </p>
                <p>
                  <strong className="text-slate-200">Books absorbed:</strong> {previewInfo.booksCount}
                </p>
                <p className="italic text-slate-400 line-clamp-2">
                  Sample: {previewInfo.sampleVerse}
                </p>
              </div>
            </div>
          )}

          {/* Supported Format Guide */}
          <div className="p-3 bg-slate-800/40 rounded-xl text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Supported Formats:</span>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Standard Books Array: <code>{`{ books: [ { name, chapters: [...] } ] }`}</code></li>
              <li>Public Repository format: <code>{`[ { name: "Genesis", chapters: [...] } ]`}</code></li>
              <li>Flat Verses list: <code>{`{ verses: [ { book, chapter, verse, text } ] }`}</code></li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            disabled={!previewInfo}
            onClick={handleConfirmImport}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition ${
              previewInfo
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Save Translation
          </button>
        </div>
      </div>
    </div>
  );
};
