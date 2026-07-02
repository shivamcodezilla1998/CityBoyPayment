import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Gift, Users,
  FileText, Settings, User, X, ChevronLeft,
  ArrowLeftRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuGroups = [
  {
    title: 'MAIN MENU',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Gift, label: 'Gift Card Requests', path: '/reward-requests', badge: '12' },
      { icon: Users, label: 'Members', path: '/members' },
      { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
      { icon: FileText, label: 'Reports', path: '/reports' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { icon: Settings, label: 'Settings', path: '/settings' },
      { icon: Sparkles, label: 'Audit Logs', path: '/audit-logs' },
      { icon: User, label: 'Profile', path: '/profile' },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const location = useLocation();

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col bg-white text-secondary
    transition-all duration-300 ease-in-out border-r border-soft
    ${isOpen ? 'w-[260px]' : isMobile ? '-translate-x-full w-[260px]' : 'w-20'}
  `;

  return (
    <>
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-canvas/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo Area */}
        <div className="flex items-center h-[72px] px-5 shrink-0 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br from-brand-500 to-brand-700">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-bold text-primary text-sm leading-tight tracking-tight">CityBoyPayment</span>
                  <span className="text-[10px] font-semibold text-tertiary tracking-wider">PAYMENT PORTAL</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="p-2 text-tertiary hover:text-secondary rounded-lg hover:bg-subtle transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 custom-scrollbar scroll-smooth relative px-3">

          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-tertiary mb-1 px-3 uppercase tracking-widest">
                {isOpen ? group.title : '•••'}
              </div>

              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group overflow-hidden
                      ${isActive
                        ? 'bg-brand-50 text-brand-700 font-medium'
                        : 'hover:bg-subtle text-secondary hover:text-primary'}
                      ${!isOpen && !isMobile ? 'justify-center' : ''}
                    `}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    {isActive && (
                      <motion.div layoutId="activeNavIndicator" className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-600 rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3">
                      <item.icon className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'w-5 h-5 text-brand-600' : 'w-5 h-5 text-tertiary group-hover:text-secondary'}`} strokeWidth={isActive ? 2.5 : 2} />
                      {isOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                    </div>

                    {isOpen && item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

        </div>

        {/* Footer Toggle */}
        <div className="p-4 flex flex-col items-center border-t border-soft gap-2">
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mt-2 p-1.5 text-tertiary hover:text-secondary rounded-lg hover:bg-subtle transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
