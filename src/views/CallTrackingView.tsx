import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneMissed, 
  Moon, 
  CalendarCheck, 
  Percent, 
  CheckSquare, 
  Square, 
  Clock, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CallRecord, CompanyConfig } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface CallTrackingViewProps {
  calls: CallRecord[];
  activeCompany: CompanyConfig;
  onToggleBooked: (callId: string) => void;
  onToggleCalledBack: (callId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CallTrackingView: React.FC<CallTrackingViewProps> = ({
  calls,
  activeCompany,
  onToggleBooked,
  onToggleCalledBack,
  showToast,
}) => {
  const [dateFilter, setDateFilter] = useState<'this_week' | 'this_month'>('this_week');

  // Filter calls based on date range
  const displayedCalls = calls.filter((c) => {
    if (dateFilter === 'this_week') return c.period === 'this_week';
    return true; // this_month includes all
  });

  // Calculate KPIs for active date filter
  const totalCalls = displayedCalls.length;
  const answeredCalls = displayedCalls.filter(c => c.status === 'Answered').length;
  const missedCalls = displayedCalls.filter(c => c.status === 'Missed').length;
  const afterHoursCalls = displayedCalls.filter(c => c.isAfterHours).length;
  const bookedCalls = displayedCalls.filter(c => c.isBooked).length;
  const conversionRate = totalCalls > 0 ? (bookedCalls / totalCalls) * 100 : 0;

  // Follow up this morning: Missed calls and calls outside 6:00 AM - 10:00 PM AEST
  const followUpQueue = calls.filter(c => c.status === 'Missed' || c.isAfterHours);

  const kpis = [
    {
      label: 'Total calls',
      value: totalCalls,
      icon: PhoneCall,
      color: 'text-[#1F3A5F] bg-slate-100',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      label: 'Answered',
      value: answeredCalls,
      icon: PhoneIncoming,
      color: 'text-emerald-700 bg-emerald-50',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      label: 'Missed',
      value: missedCalls,
      icon: PhoneMissed,
      color: 'text-rose-700 bg-rose-50',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      label: 'After hours',
      value: afterHoursCalls,
      icon: Moon,
      color: 'text-indigo-700 bg-indigo-50',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      label: 'Booked',
      value: bookedCalls,
      icon: CalendarCheck,
      color: 'text-[#2A9D8F] bg-teal-50',
      formatter: (v: number) => Math.round(v).toString(),
    },
    {
      label: 'Conversion rate',
      value: conversionRate,
      icon: Percent,
      color: 'text-[#1F3A5F] bg-sky-50',
      formatter: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2A9D8F]">
                Dedicated Lead Telephony
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#2A9D8F]" />
              <span>Organic calls to {activeCompany.organicCallNumber}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Inbound calls routed to your cleaning headquarters. Instantly toggle bookings and track after-hours leads for morning follow-ups.
            </p>
          </div>

          {/* Date Filter Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-center">
            <button
              onClick={() => setDateFilter('this_week')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                dateFilter === 'this_week'
                  ? 'bg-white text-[#1F3A5F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This week (10 calls)
            </button>
            <button
              onClick={() => setDateFilter('this_month')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                dateFilter === 'this_month'
                  ? 'bg-white text-[#1F3A5F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This month (14 calls)
            </button>
          </div>
        </div>

        {/* 6 KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium truncate">{kpi.label}</span>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${kpi.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  <AnimatedCounter value={kpi.value} formatter={kpi.formatter} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HIGHLIGHT CARD: Follow up this morning */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Follow up this morning
              </h3>
              <p className="text-xs text-slate-600">
                Missed calls and calls received outside 6:00 AM to 10:00 PM AEST requiring office callback
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-amber-900 border border-amber-200 shadow-2xs tabular-nums">
            {followUpQueue.filter(f => !f.calledBack).length} Pending Callbacks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {followUpQueue.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl bg-white border transition-all ${
                item.calledBack
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-amber-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-sm text-slate-900">
                  {item.callerNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.status === 'Missed'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {item.status === 'Missed' ? 'Missed' : 'After Hours'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-2">
                {item.callerLabel || 'Inbound prospect'} · <span className="text-slate-400">{item.dateTime}</span>
              </p>

              <button
                type="button"
                onClick={() => {
                  onToggleCalledBack(item.id);
                  showToast(
                    !item.calledBack
                      ? `Marked callback completed for ${item.callerNumber}`
                      : `Callback unchecked for ${item.callerNumber}`
                  );
                }}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  item.calledBack
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.calledBack ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Called back ✓</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-slate-400" />
                    <span>Mark Called back</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Calls Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Inbound Call Activity Log</h3>
            <p className="text-xs text-slate-500">Live call events logged via carrier integration</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Showing {displayedCalls.length} calls
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Caller Number</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">After Hours</th>
                <th className="py-3 px-4 text-center pr-6">Job Booked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedCalls.map((call) => (
                <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Caller Number */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      {call.callerNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {call.callerLabel || 'Inbound Quote Inquiry'}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                    <span className="font-medium">{call.dateTime}</span>
                    <div className="text-[11px] text-slate-400 font-mono">AEST</div>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700 tabular-nums">
                    {call.durationDisplay}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {call.status === 'Answered' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 px-2.5 py-0.5 rounded-md bg-emerald-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 px-2.5 py-0.5 rounded-md bg-rose-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Missed
                      </span>
                    )}
                  </td>

                  {/* After Hours Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {call.isAfterHours ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                        <Moon className="w-3 h-3 text-indigo-500" />
                        After hours
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Standard (6 AM-10 PM)</span>
                    )}
                  </td>

                  {/* Booked Toggle (One Click!) */}
                  <td className="py-3.5 px-4 text-center pr-6 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        onToggleBooked(call.id);
                        showToast(
                          !call.isBooked
                            ? `Call ${call.callerNumber} marked as Booked!`
                            : `Call ${call.callerNumber} unmarked from Booked`
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                        call.isBooked
                          ? 'bg-[#2A9D8F] text-white shadow-xs hover:bg-[#207D72]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>{call.isBooked ? 'Booked ✓' : 'Mark Booked'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Small Footnote */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Includes calls from any source that shows this number, including the website.</span>
        </div>
      </div>
    </div>
  );
};
