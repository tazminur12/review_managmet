import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Building2, 
  Send, 
  BellRing,
  Edit3,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { PrivateFeedbackItem, CompanyConfig, FeedbackStatus } from '../types';

interface PrivateFeedbackViewProps {
  feedback: PrivateFeedbackItem[];
  selectedItem: PrivateFeedbackItem | null;
  onSelectItem: (item: PrivateFeedbackItem) => void;
  onUpdateStatus: (id: string, newStatus: FeedbackStatus, note?: string) => void;
  activeCompany: CompanyConfig;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const PrivateFeedbackView: React.FC<PrivateFeedbackViewProps> = ({
  feedback,
  selectedItem,
  onSelectItem,
  onUpdateStatus,
  activeCompany,
  showToast,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | FeedbackStatus>('all');
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Active selected item fallback
  const activeFeedback = selectedItem || feedback[0] || null;

  const filteredItems = feedback.filter((item) => {
    const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = 
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMarkStatus = (status: FeedbackStatus) => {
    if (!activeFeedback) return;
    onUpdateStatus(activeFeedback.id, status, resolutionNoteInput);
    if (status === 'Resolved') {
      showToast(`Feedback from ${activeFeedback.clientName} marked as Resolved`);
    } else {
      showToast(`Status updated to ${status}`);
    }
    setResolutionNoteInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Description */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2A9D8F]">
                Confidential Client Remediation
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Private Feedback Inbox
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              When customers select "Tell us privately" on their review request, their feedback is routed exclusively here—protecting your public Google reputation while allowing immediate operational recovery.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Target response SLA: <strong>Same Day Resolution</strong></span>
          </div>
        </div>
      </div>

      {/* Main Inbox Grid: Left List (40%), Right Detail (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Inbox List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1F3A5F]/20"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1">
              {(['all', 'New', 'In progress', 'Resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-[#1F3A5F] text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Items List */}
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No feedback items found.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = activeFeedback?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-teal-50/50 border-l-4 border-[#2A9D8F]'
                        : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                        {item.clientName}
                      </span>
                      {/* Status chip */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          item.status === 'New'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : item.status === 'In progress'
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.suburb} · {item.serviceType}</span>
                      {item.isUrgentDueToday && item.status !== 'Resolved' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                          <Clock className="w-3 h-3" /> Due today
                        </span>
                      ) : (
                        <span>{item.receivedAt}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Detail Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          {activeFeedback ? (
            <div className="space-y-6">
              {/* Top Banner with Alert notification summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-700">
                  <BellRing className="w-4 h-4 text-[#2A9D8F] shrink-0" />
                  <span>
                    Alert dispatched to: <strong className="text-slate-900">{activeCompany.email}</strong> and Operations <strong className="text-slate-900">{activeCompany.operationsPhone}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                  Instant SMS/Email
                </span>
              </div>

              {/* Client & Job Details Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeFeedback.clientName}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        activeFeedback.status === 'New'
                          ? 'bg-amber-100 text-amber-800'
                          : activeFeedback.status === 'In progress'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {activeFeedback.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {activeFeedback.suburb}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {activeFeedback.clientPhone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {activeFeedback.clientEmail}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {activeFeedback.jobDate}
                    </span>
                  </div>
                </div>

                {/* Reply due badge */}
                <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold shrink-0 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <div>
                    <div className="leading-tight">Reply due today</div>
                    <span className="text-[10px] text-rose-600 font-normal">Target: same day remediation</span>
                  </div>
                </div>
              </div>

              {/* Client Message Card */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Client's Private Feedback Message
                </label>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  "{activeFeedback.message}"
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
                  <span>Job reference: {activeFeedback.jobId}</span>
                  <span>Received: {activeFeedback.receivedAt}</span>
                </div>
              </div>

              {/* Remediation Notes / History */}
              {activeFeedback.resolutionNote && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Resolution Record</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    {activeFeedback.resolutionNote}
                  </p>
                </div>
              )}

              {/* Action Buttons & Note input */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Operations Follow-Up Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Called client Callum at 9:30 AM, scheduled team leader to re-clean oven rack tomorrow at 10 AM free of charge..."
                    value={resolutionNoteInput}
                    onChange={(e) => setResolutionNoteInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1F3A5F]/20"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        showToast(`Initiating direct call to ${activeFeedback.clientPhone}`, 'info');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Client ({activeFeedback.clientPhone})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeFeedback.status !== 'In progress' && activeFeedback.status !== 'Resolved' && (
                      <button
                        onClick={() => handleMarkStatus('In progress')}
                        className="px-4 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-sky-700" />
                        <span>Mark in progress</span>
                      </button>
                    )}

                    {activeFeedback.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleMarkStatus('Resolved')}
                        className="px-4 py-2 rounded-xl bg-[#2A9D8F] hover:bg-[#207D72] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark resolved</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkStatus('In progress')}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-open item</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400">
              <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Select a feedback item to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
