import React, { useState, useEffect } from 'react';
import { PREFIXES, encodeGuest } from './utils/guestLink';

interface GeneratedLink {
  id: string;
  prefix: string;
  guestName: string;
  url: string;
  createdAt: string;
}

const buildMessage = (link: GeneratedLink) => `ආදරණීය ${link.guestName} ${link.prefix} ❤️

අපේ ආදර කතාවේ සුන්දරම පරිච්ඡේදය ආරම්භ කරන මේ සුවිශේෂී මොහොතේ, අපේ ජීවිතයේ වටිනාම දිනය වන විවාහ මංගල්‍යය සමඟින් එක්වන්නට ${link.prefix} හදපිරි සෙනෙහසින් ආරාධනා කරමු. 💍🤍

අපගේ ආදරය, සතුට සහ අලුත් ජීවිතයක බලාපොරොත්තු පිරුණු මේ සුන්දර දිනයේ සියලු විස්තර පහත සබැඳිය ඔස්සේ නැරඹිය හැකියි.

🌸Wedding Invitation link🌸
${link.url}

ඔබගේ ආදරණීය පැමිණීම අපේ සතුට තවත් අර්ථවත් කරනු ඇත. අපේ ජීවිතයේ මේ අමරණීය මොහොත ඔබ සමඟ බෙදාගැනීමට අපි මහත් ආසාවෙන් බලා සිටිමු. 🥹❤️

ආදරයෙන් හා සෙනෙහසින්

❤️ චානක සහ හංසිනී ❤️

දෙහදක් එක්වන, ආදරයෙන් ජීවිතය ලියැවෙන අලුත් ආරම්භයක්… ✨💐`;

export default function Admin() {
  const [prefix, setPrefix] = useState('ඔබට');
  const [guestName, setGuestName] = useState('');
  const [links, setLinks] = useState<GeneratedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [latest, setLatest] = useState<GeneratedLink | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('generatedLinks');
    if (saved) {
      setLinks(JSON.parse(saved));
    }
  }, []);

  const prefixes = PREFIXES;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const baseUrl = window.location.origin;
    const url = `${baseUrl}/?g=${encodeGuest(guestName.trim(), prefix)}`;
    
    const newLink: GeneratedLink = {
      id: crypto.randomUUID(),
      prefix,
      guestName: guestName.trim(),
      url,
      createdAt: new Date().toLocaleString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    const newLinks = [newLink, ...links];
    setLinks(newLinks);
    localStorage.setItem('generatedLinks', JSON.stringify(newLinks));
    setLatest(newLink);
    setGuestName('');
  };

  const handleCopy = async (link: GeneratedLink, kind: 'link' | 'message') => {
    try {
      await navigator.clipboard.writeText(kind === 'link' ? link.url : buildMessage(link));
      setCopiedId(`${kind}-${link.id}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDelete = (id: string) => {
    const newLinks = links.filter(l => l.id !== id);
    setLinks(newLinks);
    localStorage.setItem('generatedLinks', JSON.stringify(newLinks));
    if (latest?.id === id) setLatest(null);
  };

  const copyButton = (link: GeneratedLink, kind: 'link' | 'message', label: string) => (
    <button
      type="button"
      onClick={() => handleCopy(link, kind)}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
    >
      {copiedId === `${kind}-${link.id}` ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          {label}
        </>
      )}
    </button>
  );

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Generator Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            LINK GENERATOR
          </h1>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Select Prefix</label>
                <select
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                >
                  {prefixes.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-600">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. සුනිල් අයියා"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm active:scale-[0.99] flex justify-center items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Generate Message
            </button>
          </form>

          {latest && (
            <div className="mt-6 space-y-3">
              <pre className="whitespace-pre-wrap break-words bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm leading-relaxed text-slate-800" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                {buildMessage(latest)}
              </pre>
              <div className="flex gap-2">
                {copyButton(latest, 'link', 'Copy Link')}
                {copyButton(latest, 'message', 'Copy Full Message')}
              </div>
            </div>
          )}
        </div>

        {/* Generated Links List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Recently Generated Links
          </h2>

          {links.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No links generated yet.
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {link.prefix} {link.guestName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {link.createdAt.replace(',', '')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {copyButton(link, 'link', 'Copy Link')}
                    {copyButton(link, 'message', 'Copy Full Message')}

                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete link"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
