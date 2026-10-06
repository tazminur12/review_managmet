import React from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Inbox, 
  PhoneCall, 
  SlidersHorizontal,
  Sparkles,
  Building2
} from 'lucide-react';
import { CompanyConfig } from '../types';

export type ScreenId = 'overview' | 'review_requests' | 'private_feedback' | 'call_tracking' | 'settings';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  activeCompany: CompanyConfig;
  unreadFeedbackCount: number;
  missedCallsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  activeCompany,
  unreadFeedbackCount,
  missedCallsCount,
}) => {
  const navItems = [
    {
      id: 'overview' as ScreenId,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'review_requests' as ScreenId,
      label: 'Review Requests',
      icon: Send,
      badge: null,
    },
    {
      id: 'private_feedback' as ScreenId,
      label: 'Private Feedback',
      icon: Inbox,
      badge: unreadFeedbackCount > 0 ? unreadFeedbackCount : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'call_tracking' as ScreenId,
      label: 'Call Tracking',
      icon: PhoneCall,
      badge: missedCallsCount > 0 ? `${missedCallsCount} new` : null,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'settings' as ScreenId,
      label: 'Settings & Approval',
      icon: SlidersHorizontal,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 h-full select-none justify-between">
        <div className="p-5">
          {/* Brand header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#1F3A5F] flex items-center justify-center text-white shadow-xs">
              <span className="font-bold text-lg tracking-tight">QF</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#1F3A5F] tracking-tight">QuoteFlow</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">AU</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Reviews & Call Tracking</p>
            </div>
          </div>

          {/* Active Company pill */}
          <div className="mt-4 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#2A9D8F] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate">{activeCompany.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{activeCompany.code} · Active Tenant</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-1.5" aria-label="Main Navigation">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Module Sections
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[#1F3A5F] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2A9D8F]' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border tabular-nums ${
                        isActive
                          ? 'bg-white/20 text-white border-transparent'
                          : item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 m-4 rounded-xl">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-teal-100 text-[#2A9D8F] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Commercial Standard</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Equal Google Review & Private Feedback dual-routing. No gatekeeping.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg" aria-label="Mobile Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 relative min-w-14 rounded-lg transition-colors ${
                isActive ? 'text-[#1F3A5F]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1F3A5F]' : 'text-slate-500'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium truncate max-w-[64px] ${isActive ? 'font-semibold text-[#1F3A5F]' : 'text-slate-600'}`}>
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
