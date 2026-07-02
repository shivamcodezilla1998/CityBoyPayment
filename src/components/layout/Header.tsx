import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User, Settings, LogOut, Plus, Calendar as CalendarIcon, ChevronDown, X, Gift, FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../../contexts/AppContext';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState<any>(null);
  const [formData, setFormData] = useState({ userId: '', amount: '', email: '', brand: '' });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { users, notifications, markAllNotificationsRead, markNotificationRead, deleteNotification, issueReward, inviteMember, addGiftCard } = useAppContext();

  const handleLogout = () => {
    setIsDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setIsActionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <header className="sticky top-0 z-30 h-[72px] bg-white/80 backdrop-blur-md border-b border-soft flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all">
        <div className="flex items-center gap-4 flex-1">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 rounded-lg text-secondary hover:bg-subtle transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Global Search */}
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <Search className="w-4 h-4 text-tertiary absolute left-3" />
            <input
              type="text"
              placeholder="Search transactions, members, or settings... (Cmd+K)"
              className="w-full pl-9 pr-4 py-2 bg-subtle/50 hover:bg-subtle border border-transparent hover:border-soft focus:bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-tertiary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 relative">

          {/* Date Display (Hidden on very small screens) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-subtle rounded-md border border-soft">
            <CalendarIcon className="w-4 h-4 text-tertiary" />
            <span className="text-xs font-medium text-secondary">{currentDate}</span>
          </div>

          {/* Quick Actions Button */}
          <div className="relative hidden sm:flex items-center" ref={actionDropdownRef}>
            <button
              onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 shadow-sm transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Action</span>
            </button>

            {isActionDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-soft py-1.5 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                <button onClick={() => { setIsActionDropdownOpen(false); setActiveActionModal({ name: 'Issue Reward', desc: 'Manually issue points to a user' }); }} className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-subtle hover:text-brand-600 transition-colors">Issue Reward</button>
                <button onClick={() => { setIsActionDropdownOpen(false); setActiveActionModal({ name: 'Invite Member', desc: 'Send an email invitation' }); }} className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-subtle hover:text-brand-600 transition-colors">Invite Member</button>
                <button onClick={() => { setIsActionDropdownOpen(false); setActiveActionModal({ name: 'Add Gift Card', desc: 'Create a new card type' }); }} className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-subtle hover:text-brand-600 transition-colors">Add Gift Card</button>
              </div>
            )}
          </div>

          {/* Mobile Search Icon */}
          <button
            onClick={() => toast.success('Search opened')}
            className="md:hidden p-2 rounded-full text-secondary hover:bg-subtle transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-full text-secondary hover:bg-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-[-10px] sm:right-[-60px] top-[calc(100%+12px)] w-[320px] sm:w-[380px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-soft z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                {/* Triangle pointer */}
                <div className="absolute -top-2 right-[20px] sm:right-[70px] w-4 h-4 bg-subtle border-t border-l border-soft transform rotate-45"></div>

                <div className="relative bg-white rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-subtle/80 backdrop-blur-sm border-b border-soft px-5 py-4 flex items-center justify-center gap-2">
                    <span className="font-bold text-secondary uppercase tracking-wide text-[13px]">Notification Center</span>
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-secondary text-sm">No notifications</div>
                    ) : (
                      notifications.map((notif) => {
                        const Icon = notif.type === 'reward' ? Gift : notif.type === 'alert' ? Bell : notif.type === 'system' ? Settings : FileText;
                        return (
                          <div key={notif.id} onClick={() => { markNotificationRead(notif.id); toast.success('Viewing notification details'); setIsNotificationsOpen(false); }} className={`p-4 flex gap-4 hover:bg-subtle/50 transition-colors cursor-pointer group ${notif.unread ? 'bg-brand-50/10' : ''}`}>
                            <div className={`pt-1 shrink-0 transition-colors ${notif.unread ? 'text-brand-500' : 'text-tertiary group-hover:text-secondary'}`}>
                              <Icon className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] font-semibold mb-0.5 ${notif.unread ? 'text-[#3b82f6]' : 'text-primary'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-secondary leading-relaxed">
                                {notif.desc}
                              </p>
                              <p className="text-[10px] text-tertiary mt-1.5 font-medium">
                                {notif.time}
                              </p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); toast.success('Deleted'); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 rounded self-start ml-2 text-tertiary hover:text-danger-500 transition-all">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-soft bg-white">
                    <button
                      className="w-full py-2 text-[13px] font-bold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50"
                      onClick={() => { markAllNotificationsRead(); toast.success('All marked as read'); }}
                      disabled={notifications.filter(n => n.unread).length === 0}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-subtle transition-colors border border-transparent hover:border-soft focus:outline-none"
            >
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-sm font-medium text-primary leading-none">Admin User</span>
                <span className="text-xs text-secondary mt-1">Superadmin</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center overflow-hidden border border-brand-200 shadow-sm">
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin" className="w-full h-full object-cover" />
                </div>
                <ChevronDown className="w-4 h-4 text-tertiary hidden sm:block" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-soft py-1.5 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-4 py-2 border-b border-soft mb-1 sm:hidden">
                  <p className="text-sm font-medium text-primary">Admin User</p>
                  <p className="text-xs text-secondary">admin@cityboy.com</p>
                </div>
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                  className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-subtle hover:text-brand-600 flex items-center gap-3 transition-colors"
                >
                  <User className="w-4 h-4 text-tertiary group-hover:text-brand-500" /> My Profile
                </button>
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
                  className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-subtle hover:text-brand-600 flex items-center gap-3 transition-colors"
                >
                  <Settings className="w-4 h-4 text-tertiary group-hover:text-brand-500" /> Account Settings
                </button>
                <div className="h-px bg-subtle my-1.5"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* Global Quick Action Modal */}
      <Modal isOpen={!!activeActionModal} onClose={() => setActiveActionModal(null)} title={activeActionModal?.name || ''}>
        <div className="space-y-4">
          <p className="text-secondary text-sm">{activeActionModal?.desc}</p>
          <div className="bg-subtle p-4 rounded-xl border border-soft flex flex-col items-center justify-center py-6">
            {activeActionModal?.name === 'Issue Reward' && (
              <div className="w-full space-y-3">
                <select
                  className="w-full border-soft rounded-lg p-2 text-sm outline-none focus:border-brand-500 bg-white"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                >
                  <option value="">Select User</option>
                  {users.slice(0, 100).map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Amount (Points)"
                  className="w-full border-soft rounded-lg p-2 text-sm outline-none focus:border-brand-500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
                <p className="text-[10px] text-tertiary mt-1">* Showing first 100 users for performance</p>
              </div>
            )}
            {activeActionModal?.name === 'Invite Member' && (
              <div className="w-full space-y-3">
                <input
                  type="email"
                  placeholder="User Email"
                  className="w-full border-soft rounded-lg p-2 text-sm outline-none focus:border-brand-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}
            {activeActionModal?.name === 'Add Gift Card' && (
              <div className="w-full space-y-3">
                <input
                  type="text"
                  placeholder="Brand Name (e.g., Netflix)"
                  className="w-full border-soft rounded-lg p-2 text-sm outline-none focus:border-brand-500"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-soft">
            <Button variant="outline" onClick={() => setActiveActionModal(null)}>Cancel</Button>
            <Button onClick={() => {
              if (activeActionModal?.name === 'Issue Reward' && formData.userId && formData.amount) {
                issueReward(formData.userId, parseInt(formData.amount));
                toast.success(`Issued ${formData.amount} points!`);
              } else if (activeActionModal?.name === 'Invite Member' && formData.email) {
                inviteMember(formData.email);
                toast.success(`Invited ${formData.email}!`);
              } else if (activeActionModal?.name === 'Add Gift Card' && formData.brand) {
                addGiftCard(formData.brand);
                toast.success(`Added ${formData.brand} gift card!`);
              } else {
                toast.error('Please fill all fields');
                return;
              }
              setFormData({ userId: '', amount: '', email: '', brand: '' });
              setActiveActionModal(null);
            }}>Confirm Action</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
