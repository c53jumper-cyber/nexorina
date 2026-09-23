import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  LineChart,
  Megaphone,
  Wallet,
  Menu,
} from 'lucide-react';
import { UserNavSection } from '../../types';

interface MobileBottomNavProps {
  currentSection: UserNavSection;
  onSelectSection: (section: UserNavSection) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentSection,
  onSelectSection,
  onOpenMobileMenu,
}) => {
  const items = [
    { id: 'dashboard' as UserNavSection, label: 'Home', icon: LayoutDashboard },
    { id: 'mining' as UserNavSection, label: 'Mining', icon: Cpu },
    { id: 'trader' as UserNavSection, label: 'Trader', icon: LineChart },
    { id: 'campaigns' as UserNavSection, label: 'Quests', icon: Megaphone },
    { id: 'wallet' as UserNavSection, label: 'Wallet', icon: Wallet },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-white/[0.08] bg-[#07090E]/95 px-2 backdrop-blur-xl md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 transition-colors ${
              isActive ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
              <Icon className="h-5 w-5" />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
          </button>
        );
      })}

      {/* Menu button to open full drawer */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-slate-400 hover:text-slate-200"
      >
        <Menu className="h-5 w-5" />
        <span className="text-[10px] tracking-tight leading-none">More</span>
      </button>
    </div>
  );
};
