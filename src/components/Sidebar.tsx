import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Inbox, 
  PhoneCall, 
  SlidersHorizontal,
  Sparkles,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { CompanyConfig } from '../types';

export type ScreenId = 'overview' | 'review_requests' | 'private_feedback' | 'call_tracking' | 'settings';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  activeCompany: CompanyConfig;
  unreadFeedbackCount: number;
  missedCallsCount: number;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  activeCompany,
  unreadFeedbackCount,
  missedCallsCount,
  mobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    {
      id: 'overview' as ScreenId,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      description: 'KPIs & activity snapshot',
    },
    {
      id: 'review_requests' as ScreenId,
      label: 'Review Requests',
      icon: Send,
      badge: null,
      description: 'Post-service dispatches',
    },
    {
      id: 'private_feedback' as ScreenId,
      label: 'Private Feedback',
      icon: Inbox,
      badge: unreadFeedbackCount > 0 ? `${unreadFeedbackCount} new` : null,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Customer remediation',
    },
    {
      id: 'call_tracking' as ScreenId,
      label: 'Call Tracking',
      icon: PhoneCall,
      badge: missedCallsCount > 0 ? `${missedCallsCount} missed` : null,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Organic phone leads',
    },
  ];

  const secondaryNavItems = [
    {
      id: 'settings' as ScreenId,
      label: 'Settings & Approval',
      icon: SlidersHorizontal,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      description: 'Governance & config',
    },
  ];

  const handleItemClick = (screen: ScreenId) => {
    onSelectScreen(screen);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* =========================================================================
          DESKTOP & TABLET SIDEBAR (Fixed & Non-scrolling with main page)
          ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 shrink-0 h-full select-none z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        {/* Top Brand Header */}
        <div className="p-4 lg:p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F3A5F] to-[#2C4E7E] flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="font-bold text-base tracking-tight text-teal-300">QF</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-[#1F3A5F] tracking-tight">QuoteFlow</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-[#2A9D8F] border border-teal-200/60 font-mono">
                    AU
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  Reviews & Calls Module
                </p>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Active Tenant Card */}
        {!isCollapsed ? (
          <div className="p-3 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#1F3A5F] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                <Building2 className="w-4 h-4 text-[#2A9D8F]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {activeCompany.name}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate">{activeCompany.code} · Active Tenant</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 mx-auto my-3 shrink-0">
            <div
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#2A9D8F]"
              title={`${activeCompany.name} (${activeCompany.code})`}
            >
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Scrollable Navigation Area (Sidebar internal scroll only if items overflow) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Group 1: Core Modules */}
          <div>
            {!isCollapsed && (
              <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Core Modules
              </div>
            )}
            <nav className="space-y-1" aria-label="Core Navigation">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isCollapsed
                        ? 'justify-center p-3'
                        : 'justify-between px-3.5 py-2.5'
                    } ${
                      isActive
                        ? 'bg-[#1F3A5F] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-teal-300' : 'text-slate-500'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tabular-nums shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white border-transparent'
                            : item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && item.badge && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Group 2: Governance & Settings */}
          <div>
            {!isCollapsed && (
              <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Governance
              </div>
            )}
            <nav className="space-y-1" aria-label="Governance Navigation">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isCollapsed
                        ? 'justify-center p-3'
                        : 'justify-between px-3.5 py-2.5'
                    } ${
                      isActive
                        ? 'bg-[#1F3A5F] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-teal-300' : 'text-slate-500'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border tabular-nums shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white border-transparent'
                            : item.badgeColor
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
        </div>

        {/* Sidebar Bottom: Operational Compliance Box */}
        {!isCollapsed ? (
          <div className="p-3 m-3 border-t border-slate-100 bg-slate-50/80 rounded-xl shrink-0">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-teal-100 text-[#2A9D8F] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900">Standard Dual-Route</p>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Google Review & Private Feedback always displayed equally.
                </p>
              </div>
            </div>

            {/* Operator info */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 truncate">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-700 truncate">Marcus Vance (Ops)</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">AEST</span>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-100 flex justify-center shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#2A9D8F] flex items-center justify-center" title="Compliant Dual-Routing Active">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </aside>

      {/* =========================================================================
          MOBILE SLIDE-OVER DRAWER (Rich Full Sidebar on Mobile)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1F3A5F] flex items-center justify-center text-white font-bold text-sm">
                  <span className="text-teal-300">QF</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#1F3A5F]">QuoteFlow</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-50 text-[#2A9D8F] border border-teal-200">
                      AU
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Reviews & Calls Demo</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseMobileMenu}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Company pill */}
            <div className="p-3 mx-4 my-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-900">{activeCompany.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{activeCompany.code} · Active Tenant</p>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                  Core Modules
                </span>
                <nav className="space-y-1">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-[#1F3A5F] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isActive
                                ? 'bg-white/20 text-white border-transparent'
                                : item.badgeColor
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

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                  Governance
                </span>
                <nav className="space-y-1">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-[#1F3A5F] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              isActive
                                ? 'bg-white/20 text-white border-transparent'
                                : item.badgeColor
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
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <p className="text-[11px] font-semibold text-slate-800">QuoteFlow Demo</p>
              <p className="text-[10px] text-slate-500 mt-0.5">For management review.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION (Persistent & accessible)
          ========================================================================= */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
        aria-label="Mobile Navigation"
      >
        {[...mainNavItems, ...secondaryNavItems].map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 relative min-w-14 rounded-lg transition-colors cursor-pointer ${
                isActive ? 'text-[#1F3A5F]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1F3A5F]' : 'text-slate-500'}`} />
                {item.badge && item.id !== 'settings' && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium truncate max-w-[62px] ${
                  isActive ? 'font-bold text-[#1F3A5F]' : 'text-slate-600'
                }`}
              >
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
