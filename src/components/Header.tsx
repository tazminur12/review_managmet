import React from 'react';
import { Building2, ChevronDown, Check, Phone, Menu } from 'lucide-react';
import { CompanyConfig, CompanyId, SystemMode } from '../types';

interface HeaderProps {
  currentScreenTitle: string;
  activeCompany: CompanyConfig;
  onCompanyChange: (companyId: CompanyId) => void;
  systemMode: SystemMode;
  testModeEnabled: boolean;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreenTitle,
  activeCompany,
  onCompanyChange,
  systemMode,
  testModeEnabled,
  onOpenMobileMenu,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left: Mobile Menu Toggle + Breadcrumb / Screen Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <nav className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-1.5">
            <span>Reviews & Calls</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{currentScreenTitle}</span>
          </nav>
          <h1 className="text-base sm:text-lg font-bold text-[#1F3A5F] tracking-tight">
            {currentScreenTitle}
          </h1>
        </div>
      </div>

      {/* Right: Company Switcher & Status Indicators */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Organic Line status preview */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Phone className="w-3.5 h-3.5 text-[#2A9D8F]" />
          <span>Organic Inbound:</span>
          <span className="font-mono font-semibold text-slate-800">{activeCompany.organicCallNumber}</span>
        </div>

        {/* System Mode Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
          <span
            className={`w-2 h-2 rounded-full ${
              systemMode === 'Automatic'
                ? 'bg-emerald-500 animate-pulse'
                : systemMode === 'Manual'
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`}
          />
          <span>Mode: <strong className="font-semibold text-slate-900">{systemMode}</strong></span>
          {testModeEnabled && (
            <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-sky-100 text-sky-800 font-semibold">TEST</span>
          )}
        </div>

        {/* Company Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors focus:ring-2 focus:ring-[#1F3A5F]/20 focus:outline-hidden"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-6 h-6 rounded-md bg-[#1F3A5F] text-white flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-tight">{activeCompany.name}</span>
              <span className="text-[10px] text-slate-500 font-normal">Switch Company</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 ml-1 shrink-0" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Demo Company
                </p>
                <p className="text-xs text-slate-500">
                  Switching switches client records and settings
                </p>
              </div>

              {/* Option 1: COTG */}
              <button
                onClick={() => {
                  onCompanyChange('COTG');
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm hover:bg-slate-50 transition-colors ${
                  activeCompany.id === 'COTG' ? 'bg-teal-50/60 font-semibold text-[#1F3A5F]' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Cleaner On The Go</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">COTG</span>
                  </div>
                  <span className="text-xs text-slate-500">Sydney Metro · info@cleaneronthego.com.au</span>
                </div>
                {activeCompany.id === 'COTG' && (
                  <Check className="w-4 h-4 text-[#2A9D8F] shrink-0" />
                )}
              </button>

              {/* Option 2: SFG */}
              <button
                onClick={() => {
                  onCompanyChange('SFG');
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm hover:bg-slate-50 transition-colors ${
                  activeCompany.id === 'SFG' ? 'bg-teal-50/60 font-semibold text-[#1F3A5F]' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Serene Facility Group</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">SFG</span>
                  </div>
                  <span className="text-xs text-slate-500">Melbourne Commercial · info@serenefacility.com.au</span>
                </div>
                {activeCompany.id === 'SFG' && (
                  <Check className="w-4 h-4 text-[#2A9D8F] shrink-0" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
