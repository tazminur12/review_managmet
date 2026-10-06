import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  X, 
  Star, 
  Info, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { JobRequest, CompanyConfig, Channel, JobStatus } from '../types';

interface ReviewRequestsViewProps {
  jobs: JobRequest[];
  activeCompany: CompanyConfig;
  onSendRequest: (jobId: string, channel: Channel) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ReviewRequestsView: React.FC<ReviewRequestsViewProps> = ({
  jobs,
  activeCompany,
  onSendRequest,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [previewChannel, setPreviewChannel] = useState<Channel>('Both');
  const [activePreviewTab, setActivePreviewTab] = useState<'email' | 'sms'>('email');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'not_sent' && job.status === 'Not sent') ||
      (statusFilter === 'sent' && job.status === 'Sent') ||
      (statusFilter === 'opened' && job.status === 'Opened') ||
      (statusFilter === 'feedback' && job.status === 'Private feedback received');

    return matchesSearch && matchesStatus;
  });

  const handleOpenPreview = (job: JobRequest) => {
    setSelectedJob(job);
    setPreviewChannel(job.channel);
    setActivePreviewTab(job.channel === 'SMS' ? 'sms' : 'email');
  };

  const handleSend = () => {
    if (!selectedJob) return;
    onSendRequest(selectedJob.id, previewChannel);
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Section Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2A9D8F]">
                Standardised Customer Communication
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Post-Service Review Requests
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Dispatch standard invitations to recent clients. Both options—Google Review and Private Feedback—are always presented with equal prominence, ensuring full compliance and genuine feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Daily limit: </span>
              <strong className="text-slate-900 font-semibold">{jobs.filter(j => j.status !== 'Not sent').length} / {activeCompany.dailyLimit} sent</strong>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, suburb, service, or job ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1F3A5F]/20 transition-all"
            />
          </div>

          {/* Segmented status filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#1F3A5F] text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setStatusFilter('not_sent')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'not_sent'
                  ? 'bg-[#1F3A5F] text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Not sent ({jobs.filter(j => j.status === 'Not sent').length})
            </button>
            <button
              onClick={() => setStatusFilter('sent')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'sent'
                  ? 'bg-[#1F3A5F] text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Sent ({jobs.filter(j => j.status === 'Sent').length})
            </button>
            <button
              onClick={() => setStatusFilter('opened')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'opened'
                  ? 'bg-[#1F3A5F] text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Opened ({jobs.filter(j => j.status === 'Opened').length})
            </button>
            <button
              onClick={() => setStatusFilter('feedback')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'feedback'
                  ? 'bg-[#1F3A5F] text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Private Feedback ({jobs.filter(j => j.status === 'Private feedback received').length})
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Client & Service</th>
                <th className="py-3 px-4">Job Date</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No jobs match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const isNotSent = job.status === 'Not sent';
                  const isFailingDemo = !!job.alreadySentCheckFail;

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Client */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{job.clientName}</span>
                          {job.clientEmail === 'test@example.com' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                              TEAM TEST
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {job.suburb} · <span className="text-slate-600">{job.serviceType}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {job.clientEmail} · {job.clientPhone}
                        </div>
                      </td>

                      {/* Job Date */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        <span className="font-medium">{job.jobDate}</span>
                        <div className="text-[11px] text-slate-400 font-mono">{job.id}</div>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 px-2.5 py-1 rounded-lg bg-slate-100">
                          {job.channel === 'Email' ? (
                            <Mail className="w-3.5 h-3.5 text-blue-600" />
                          ) : job.channel === 'SMS' ? (
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <>
                              <Mail className="w-3 h-3 text-blue-600" />
                              <Smartphone className="w-3 h-3 text-emerald-600" />
                            </>
                          )}
                          {job.channel}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {job.status === 'Not sent' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 px-2.5 py-1 rounded-md bg-slate-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Not sent
                          </span>
                        )}
                        {job.status === 'Sent' && (
                          <div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 px-2.5 py-1 rounded-md bg-sky-50">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              Sent
                            </span>
                            {job.sentAt && (
                              <div className="text-[10px] text-slate-400 mt-0.5">{job.sentAt}</div>
                            )}
                          </div>
                        )}
                        {job.status === 'Opened' && (
                          <div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 px-2.5 py-1 rounded-md bg-teal-50">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" />
                              Opened
                            </span>
                            {job.openedAt && (
                              <div className="text-[10px] text-slate-400 mt-0.5">{job.openedAt}</div>
                            )}
                          </div>
                        )}
                        {job.status === 'Private feedback received' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 px-2.5 py-1 rounded-md bg-amber-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Private feedback
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                        {isNotSent ? (
                          <button
                            onClick={() => handleOpenPreview(job)}
                            className="px-3.5 py-1.5 bg-[#1F3A5F] hover:bg-[#142742] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-[#2A9D8F]" />
                            <span>Send review request</span>
                          </button>
                        ) : isFailingDemo ? (
                          <button
                            onClick={() => handleOpenPreview(job)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            title="Test automated safeguard failure check"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Inspect Check Failure</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenPreview(job)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Preview message</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Preview exact message & channel selection */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1F3A5F] text-white flex items-center justify-center">
                  <Send className="w-4 h-4 text-[#2A9D8F]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Review Request Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Client: <strong className="text-slate-800">{selectedJob.clientName}</strong> ({selectedJob.suburb}) · {selectedJob.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Dispatch Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Email', 'SMS', 'Both'] as Channel[]).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        setPreviewChannel(ch);
                        if (ch === 'Email') setActivePreviewTab('email');
                        if (ch === 'SMS') setActivePreviewTab('sms');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        previewChannel === ch
                          ? 'bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ch === 'Email' && <Mail className="w-3.5 h-3.5" />}
                      {ch === 'SMS' && <Smartphone className="w-3.5 h-3.5" />}
                      {ch === 'Both' && (
                        <>
                          <Mail className="w-3 h-3" />
                          <span>+</span>
                          <Smartphone className="w-3 h-3" />
                        </>
                      )}
                      <span>{ch}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Format Switcher for 'Both' */}
              {previewChannel === 'Both' && (
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Viewing preview for:</span>
                  <button
                    onClick={() => setActivePreviewTab('email')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                      activePreviewTab === 'email'
                        ? 'bg-teal-50 text-[#2A9D8F] border border-teal-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Email Template
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('sms')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                      activePreviewTab === 'sms'
                        ? 'bg-teal-50 text-[#2A9D8F] border border-teal-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SMS Message
                  </button>
                </div>
              )}

              {/* Exact Preview Container */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">
                    Live Mockup Preview ({activePreviewTab === 'email' ? 'Email' : 'SMS'} View)
                  </span>
                  <span className="text-[11px] text-slate-400">Zero star ratings · Compliant layout</span>
                </div>

                {activePreviewTab === 'email' ? (
                  /* EMAIL PREVIEW */
                  <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
                    {/* Email Headers */}
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">From:</span>
                        <span className="font-semibold text-slate-800">
                          {activeCompany.name} &lt;{activeCompany.email}&gt;
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">To:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedJob.clientName} &lt;{selectedJob.clientEmail}&gt;
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">Subject:</span>
                        <span className="font-bold text-slate-900">
                          How did we do, {selectedJob.clientFirstName}?
                        </span>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="p-6 text-slate-800 space-y-5">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <div className="w-7 h-7 rounded-lg bg-[#1F3A5F] text-white flex items-center justify-center font-bold text-xs">
                          {activeCompany.code.slice(0, 2)}
                        </div>
                        <span className="font-bold text-sm text-[#1F3A5F]">{activeCompany.name}</span>
                      </div>

                      <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <p>Hi {selectedJob.clientFirstName},</p>
                        <p>
                          Thank you for choosing {activeCompany.name} for your recent {selectedJob.serviceType.toLowerCase()}. We hope our cleaners delivered the thorough service you expected.
                        </p>
                        <p>
                          Your honest feedback helps our Australian team maintain high cleaning standards. Please let us know how we did today:
                        </p>
                      </div>

                      {/* TWO EQUAL BUTTONS SIDE BY SIDE */}
                      <div className="py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Button 1: Google Review */}
                          <div className="p-3.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs cursor-default">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                                G
                              </span>
                              <span>Leave a Google review</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Share your public review on Google
                            </span>
                          </div>

                          {/* Button 2: Tell us privately */}
                          <div className="p-3.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs cursor-default">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <MessageSquare className="w-4 h-4 text-[#2A9D8F]" />
                              <span>Tell us privately</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Direct confidential line to management
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        Whichever link you choose, your feedback goes directly to helping our cleaners and operations managers. Thank you for your support!
                      </p>

                      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                        <p>Cleaner On The Go Operations Team · Sydney & Melbourne</p>
                        <p className="underline hover:text-slate-600 cursor-pointer">
                          You received this message because you booked a service. Unsubscribe from review requests.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SMS PREVIEW */
                  <div className="border border-slate-200 rounded-2xl bg-slate-50 p-4 shadow-xs">
                    <div className="max-w-sm mx-auto bg-white rounded-2xl p-4 shadow-md border border-slate-200 text-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-400">
                        <span>SMS to {selectedJob.clientPhone}</span>
                        <span>Sender: {activeCompany.senderName}</span>
                      </div>

                      <div className="space-y-2.5 text-slate-800 leading-relaxed">
                        <p>
                          Hi {selectedJob.clientFirstName}, thanks for choosing {activeCompany.name}! How did our cleaning team do?
                        </p>
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500 block font-sans text-[10px]">Google Review:</span>
                            <span className="text-[#1F3A5F] underline truncate block">
                              {activeCompany.googleReviewUrl}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block font-sans text-[10px]">Or tell us privately:</span>
                            <span className="text-[#2A9D8F] underline truncate block">
                              https://cleaneronthego.com.au/f/{selectedJob.id}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Reply STOP to opt out of future messages.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Critical Info Note */}
              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-2.5 text-xs text-slate-800">
                <Info className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-[#1F3A5F]">Equal Presentation Policy:</strong>
                  <span className="ml-1 text-slate-700">
                    Every client gets the same message and both links. No gatekeeping, star filters, or conditional diversion.
                  </span>
                </div>
              </div>

              {/* Automated Checks List */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Automated Pre-flight Safeguard Checks
                </p>

                <div className="space-y-2 text-xs">
                  {/* Check 1 */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Client has not unsubscribed
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700">Active subscriber</span>
                  </div>

                  {/* Check 2: Might fail for the demo job */}
                  <div className="flex items-center justify-between">
                    {selectedJob.alreadySentCheckFail ? (
                      <>
                        <span className="text-rose-700 font-medium flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          No request sent for this job yet
                        </span>
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          Failed: Already sent on 04 Oct
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-700 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          No request sent for this job yet
                        </span>
                        <span className="text-[11px] font-medium text-emerald-700">First dispatch</span>
                      </>
                    )}
                  </div>

                  {/* Check 3 */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Daily limit not reached
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {jobs.filter(j => j.status !== 'Not sent').length} / {activeCompany.dailyLimit} allowed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                {selectedJob.alreadySentCheckFail ? (
                  <div className="flex items-center gap-2 text-xs text-rose-600 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    <span>Send disabled: Check failed (Already sent)</span>
                    <button
                      disabled
                      className="px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 text-xs sm:text-sm font-semibold cursor-not-allowed shadow-none"
                    >
                      Send review request
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSend}
                    className="px-5 py-2.5 rounded-xl bg-[#2A9D8F] hover:bg-[#207D72] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm & Send ({previewChannel})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
