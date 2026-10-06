import React from 'react';
import { 
  Send, 
  Eye, 
  MessageSquareWarning, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneMissed, 
  CalendarCheck, 
  Percent, 
  ArrowRight,
  Clock,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { JobRequest, PrivateFeedbackItem, CallRecord, CompanyConfig } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ScreenId } from '../components/Sidebar';

interface OverviewViewProps {
  jobs: JobRequest[];
  feedback: PrivateFeedbackItem[];
  calls: CallRecord[];
  activeCompany: CompanyConfig;
  onNavigate: (screen: ScreenId) => void;
  onSelectFeedback: (item: PrivateFeedbackItem) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  jobs,
  feedback,
  calls,
  activeCompany,
  onNavigate,
  onSelectFeedback,
}) => {
  // Aggregate KPIs
  const sentJobsCount = jobs.filter(j => j.status !== 'Not sent').length;
  const openedJobsCount = jobs.filter(j => j.status === 'Opened' || j.status === 'Private feedback received').length;
  const privateFeedbackCount = feedback.length;

  const totalCallsCount = calls.length;
  const answeredCallsCount = calls.filter(c => c.status === 'Answered').length;
  const missedCallsCount = calls.filter(c => c.status === 'Missed').length;
  const bookedCallsCount = calls.filter(c => c.isBooked).length;
  const conversionRate = totalCallsCount > 0 ? (bookedCallsCount / totalCallsCount) * 100 : 0;

  // Unresolved feedback items
  const unresolvedFeedback = feedback.filter(f => f.status !== 'Resolved');

  // Missed calls needing follow-up
  const followUpCalls = calls.filter(c => c.status === 'Missed' || (c.isAfterHours && !c.calledBack));

  // Chart data
  const requestsChartData = [
    { name: 'Wk 1', sent: 18, opened: 15 },
    { name: 'Wk 2', sent: 24, opened: 21 },
    { name: 'Wk 3', sent: 31, opened: 26 },
    { name: 'Wk 4', sent: 28, opened: 25 },
    { name: 'Current', sent: sentJobsCount + 6, opened: openedJobsCount + 4 },
  ];

  const callsChartData = [
    { name: 'Wk 1', answered: 11, missed: 2 },
    { name: 'Wk 2', answered: 14, missed: 1 },
    { name: 'Wk 3', answered: 16, missed: 3 },
    { name: 'Wk 4', answered: 13, missed: 2 },
    { name: 'Current', answered: answeredCallsCount, missed: missedCallsCount },
  ];

  const kpis = [
    {
      title: 'Review requests sent',
      value: sentJobsCount + 42, // demo historical + active
      icon: Send,
      color: 'text-[#1F3A5F] bg-blue-50',
      description: 'Via SMS & Email',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      title: 'Links opened',
      value: openedJobsCount + 34,
      icon: Eye,
      color: 'text-[#2A9D8F] bg-teal-50',
      description: '79% open rate',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      title: 'Private feedback received',
      value: privateFeedbackCount,
      icon: MessageSquareWarning,
      color: 'text-amber-700 bg-amber-50',
      description: 'Kept off public web',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      title: 'Calls this month',
      value: totalCallsCount + 34,
      icon: PhoneCall,
      color: 'text-[#1F3A5F] bg-slate-100',
      description: `To ${activeCompany.organicCallNumber}`,
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      title: 'Answered',
      value: answeredCallsCount + 32,
      icon: PhoneIncoming,
      color: 'text-emerald-700 bg-emerald-50',
      description: '92% pickup rate',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      title: 'Missed',
      value: missedCallsCount,
      icon: PhoneMissed,
      color: 'text-rose-700 bg-rose-50',
      description: 'Needs morning callback',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      title: 'Booked',
      value: bookedCallsCount + 22,
      icon: CalendarCheck,
      color: 'text-[#2A9D8F] bg-teal-50',
      description: 'Confirmed cleaning jobs',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      title: 'Conversion rate',
      value: conversionRate > 0 ? conversionRate : 68.5,
      icon: Percent,
      color: 'text-[#1F3A5F] bg-indigo-50',
      description: 'Inquiry to booking',
      formatter: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1F3A5F] to-[#2C4D79] text-white rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Live Overview · {activeCompany.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                <Clock className="w-3 h-3 text-teal-300" /> Sydney / Melbourne AEST
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Executive Reviews & Call Dashboard
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Standardised post-service review dispatch with neutral dual-routing (Google Review + Private Feedback) and organic marketing phone tracking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('review_requests')}
              className="px-4 py-2.5 bg-[#2A9D8F] hover:bg-[#207D72] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Review Requests</span>
            </button>
            <button
              onClick={() => onNavigate('call_tracking')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Operational Performance Metrics
          </h3>
          <span className="text-xs text-slate-500 font-medium">Auto-synced with completed quotes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all duration-150 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-slate-500 leading-snug line-clamp-1">
                    {kpi.title}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    <AnimatedCounter value={kpi.value} formatter={kpi.formatter} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    {kpi.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Small Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Review Requests Sent per Week */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Review Requests Sent per Week</h4>
              <p className="text-xs text-slate-500">Weekly breakdown of messages sent and links opened</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F3A5F]" /> Sent
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" /> Opened
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F3A5F',
                    borderColor: '#142742',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="sent" name="Requests Sent" fill="#1F3A5F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="opened" name="Links Opened" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Calls per Week split Answered/Missed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Inbound Calls per Week</h4>
              <p className="text-xs text-slate-500">Answered vs Missed inquiries on organic line</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F3A5F]" /> Answered
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" /> Missed
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F3A5F',
                    borderColor: '#142742',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="answered" name="Answered Calls" fill="#1F3A5F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missed" name="Missed Calls" fill="#E63946" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Needs Attention Today List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Needs Attention Today</h3>
              <p className="text-xs text-slate-500">
                High-priority queue: unresolved customer feedback & missed morning calls
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 tabular-nums">
            {unresolvedFeedback.length + followUpCalls.length} Pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unresolved Private Feedback Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
              <span>Unresolved Private Feedback ({unresolvedFeedback.length})</span>
              <button
                onClick={() => onNavigate('private_feedback')}
                className="text-[#2A9D8F] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View Inbox</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {unresolvedFeedback.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                All customer feedback has been resolved!
              </div>
            ) : (
              unresolvedFeedback.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectFeedback(item);
                    onNavigate('private_feedback');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xs bg-slate-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900 group-hover:text-[#1F3A5F]">
                      {item.clientName}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      Reply Due Today
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    "{item.message}"
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>{item.suburb} · {item.serviceType}</span>
                    <span className="font-medium text-[#2A9D8F] flex items-center gap-1">
                      Action <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Missed Calls & After-Hours Follow-up Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
              <span>Missed Calls to Follow Up Morning ({followUpCalls.length})</span>
              <button
                onClick={() => onNavigate('call_tracking')}
                className="text-[#2A9D8F] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Call Tracking</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {followUpCalls.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                All missed inquiries have been returned!
              </div>
            ) : (
              followUpCalls.map((call) => (
                <div
                  key={call.id}
                  onClick={() => onNavigate('call_tracking')}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xs bg-slate-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <PhoneMissed className="w-3.5 h-3.5 text-rose-600" />
                      <span className="font-mono font-semibold text-xs text-slate-900 group-hover:text-[#1F3A5F]">
                        {call.callerNumber}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {call.isAfterHours ? 'After Hours (5:20 AM)' : 'Missed Call'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {call.callerLabel || 'Inbound service quote inquiry'}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>{call.dateTime}</span>
                    <span className="font-medium text-[#2A9D8F] flex items-center gap-1">
                      Return Call <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
