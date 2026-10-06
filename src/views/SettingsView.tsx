import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Power, 
  Lock, 
  Check, 
  AlertCircle, 
  Building2, 
  FileText, 
  History,
  Phone,
  Mail,
  ExternalLink,
  Info
} from 'lucide-react';
import { SystemMode, CompanyConfig, AuditLogItem } from '../types';

interface SettingsViewProps {
  systemMode: SystemMode;
  onSetSystemMode: (mode: SystemMode) => void;
  testModeEnabled: boolean;
  onToggleTestMode: (enabled: boolean) => void;
  activeCompany: CompanyConfig;
  auditLogs: AuditLogItem[];
  onSwitchEverythingOff: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  systemMode,
  onSetSystemMode,
  testModeEnabled,
  onToggleTestMode,
  activeCompany,
  auditLogs,
  onSwitchEverythingOff,
  showToast,
}) => {
  const [approvalNote, setApprovalNote] = useState(
    'Compliant with Australian dual-routing standard. Both Google and confidential feedback provided equally.'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2A9D8F]">
                Governance & Safeguards
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Settings & Executive Approval
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Configure dispatch parameters, enforce strict audit trails, and manage governance authorization before production rollout.
            </p>
          </div>

          {/* Big "Switch everything off" Button */}
          <button
            type="button"
            onClick={onSwitchEverythingOff}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center shadow-xs"
          >
            <Power className="w-4 h-4 text-rose-600" />
            <span>Switch everything off</span>
          </button>
        </div>
      </div>

      {/* Mode Selector & Test Mode Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Mode Selector (8 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                System Operation Mode
              </h3>
              <span className="text-xs text-slate-400 font-mono">Current: {systemMode}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Control how review invitations are triggered across your cleaning operations. Default state is strictly Off until board sign-off.
            </p>

            {/* Segmented Control: Off, Manual, Automatic */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80">
              {(['Off', 'Manual', 'Automatic'] as SystemMode[]).map((mode) => {
                const isActive = systemMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      onSetSystemMode(mode);
                      showToast(`System mode switched to ${mode}`, mode === 'Off' ? 'info' : 'success');
                    }}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isActive
                        ? mode === 'Off'
                          ? 'bg-slate-800 text-white shadow-xs'
                          : mode === 'Manual'
                          ? 'bg-[#1F3A5F] text-white shadow-xs'
                          : 'bg-[#2A9D8F] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>{mode}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      {mode === 'Off' ? 'No messages' : mode === 'Manual' ? 'Staff clicks send' : 'Sent after job'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automatic mode requires active Super Admin authorisation.</span>
          </div>
        </div>

        {/* Test Mode Toggle (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Test Mode Safeguard
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono">
                Safe Environment
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              When enabled, messages are restricted strictly to designated internal team test contacts (e.g. Tazminur test@example.com).
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  Sends only to team test contacts
                </span>
                <span className="text-[11px] text-slate-500">
                  Real clients are protected from dispatches
                </span>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => {
                  onToggleTestMode(!testModeEnabled);
                  showToast(!testModeEnabled ? 'Test mode activated' : 'Test mode turned off');
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  testModeEnabled ? 'bg-[#2A9D8F]' : 'bg-slate-300'
                }`}
                aria-pressed={testModeEnabled}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    testModeEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Active test recipient: <strong className="text-slate-800">test@example.com</strong>
          </div>
        </div>
      </div>

      {/* PANEL: Management Approval */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Management Approval</h3>
              <p className="text-xs text-slate-500">Formal compliance authorization record</p>
            </div>
          </div>

          {/* Status badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Pending management approval
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Approved by
            </label>
            <input
              type="text"
              readOnly
              value="Elena Rostova (Managing Director)"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Review Date
            </label>
            <input
              type="text"
              readOnly
              value="05 Oct 2026 (Executive Session)"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Approval Note
            </label>
            <input
              type="text"
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1F3A5F]/20"
            />
          </div>
        </div>

        {/* Disabled-looking "Activate" button with helper text */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Only a Super Admin can activate after management approval.</span>
          </div>

          <button
            disabled
            className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-400 text-xs sm:text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2 shadow-none self-start sm:self-center"
            title="Disabled until Super Admin signs off"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Activate Automation</span>
          </button>
        </div>
      </div>

      {/* READ-ONLY DEMO SETTINGS FIELDS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Module Configuration Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Preset parameters for {activeCompany.name} ({activeCompany.code})
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
            Read-only Demo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Field 1: Google Review link */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Google review link</span>
            <div className="font-mono text-slate-800 truncate" title={activeCompany.googleReviewUrl}>
              {activeCompany.googleReviewUrl}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Always shown with equal visual weight</span>
          </div>

          {/* Field 2: Private feedback email */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Private feedback email</span>
            <div className="font-mono text-slate-800">{activeCompany.email}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Receives instant remediation alert</span>
          </div>

          {/* Field 3: Operations phone */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Operations phone</span>
            <div className="font-mono text-slate-800 font-semibold">{activeCompany.operationsPhone}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              COTG 0485 901 719 · SFG 0485 908 433
            </span>
          </div>

          {/* Field 4: Sender name */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Sender name</span>
            <div className="font-semibold text-slate-800">{activeCompany.senderName}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Shown on outgoing SMS headers</span>
          </div>

          {/* Field 5: Reminder after 7 days */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Reminder schedule</span>
            <div className="font-semibold text-slate-800">Reminder after 7 days</div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">One reminder only (Spam prevention)</span>
          </div>

          {/* Field 6: Daily sending limit */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Daily sending limit</span>
            <div className="font-semibold text-slate-800 font-mono">{activeCompany.dailyLimit} messages / day</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Prevents carrier rate limit throttling</span>
          </div>

          {/* Field 7: Call records retention */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 lg:col-span-3">
            <span className="font-semibold text-slate-500 block mb-1">Telephony data retention</span>
            <div className="font-semibold text-slate-800">Call records kept 12 months</div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Australian Privacy Principles (APP) compliance for telecommunications data.
            </span>
          </div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#1F3A5F]" />
            <h3 className="text-base font-bold text-slate-900">Governance & Audit Log</h3>
          </div>
          <span className="text-xs text-slate-400">Immutable ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Admin User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right pr-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-semibold text-slate-900 block">{log.adminName}</span>
                    <span className="text-[11px] text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap text-slate-500 font-mono text-xs">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
