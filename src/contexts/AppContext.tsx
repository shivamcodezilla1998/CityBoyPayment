import React, { createContext, useContext, useState, ReactNode } from 'react';
import { dummyUsers as initialUsers, dummyRequests as initialRequests, dummyTransactions as initialTransactions } from '../utils/dummyData';

interface AppContextType {
  users: typeof initialUsers;
  requests: typeof initialRequests;
  transactions: typeof initialTransactions;
  notifications: any[];
  setUsers: React.Dispatch<React.SetStateAction<typeof initialUsers>>;
  setRequests: React.Dispatch<React.SetStateAction<typeof initialRequests>>;
  setTransactions: React.Dispatch<React.SetStateAction<typeof initialTransactions>>;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  updateRequestStatus: (id: string, status: string) => void;
  deleteRequest: (id: string) => void;
  addGiftCard: (brand: string) => void;
  giftCards: any[];
  setGiftCards: React.Dispatch<React.SetStateAction<any[]>>;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  issueReward: (userId: string, amount: number) => void;
  inviteMember: (email: string) => void;
  auditLogs: any[];
  addAuditLog: (type: string, desc: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState(initialUsers);
  const [requests, setRequests] = useState(initialRequests);
  const [transactions, setTransactions] = useState(initialTransactions);
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'reward', title: 'New Reward Request', desc: 'User123 requested a $10 Amazon Gift Card.', time: '3 mins ago', unread: true, category: 'Today' },
    { id: 2, type: 'alert', title: 'Gift Card Stock Low', desc: 'Starbucks $5 cards are running out (3 left).', time: '1 hour ago', unread: true, category: 'Today' },
    { id: 3, type: 'system', title: 'System Update', desc: 'Server maintenance scheduled for 2:00 AM.', time: '2 hours ago', unread: false, category: 'Yesterday' },
    { id: 4, type: 'report', title: 'Weekly Report Ready', desc: 'Your weekly analytics report is ready to view.', time: '1 day ago', unread: false, category: 'Older' }
  ]);

  const [giftCards, setGiftCards] = useState([
    { brand: 'Amazon', stock: 150 },
    { brand: 'Starbucks', stock: 130 },
    { brand: 'Target', stock: 110 },
    { brand: 'Uber', stock: 90 },
    { brand: 'Walmart', stock: 70 }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: new Date(Date.now() - 120000).toISOString(), admin: 'Super Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff', type: 'System Settings', desc: 'Toggled Maintenance Mode: OFF', ip: '192.168.1.45' },
    { id: 2, time: new Date(Date.now() - 3600000).toISOString(), admin: 'Super Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff', type: 'System Settings', desc: 'Updated Notification Templates', ip: '192.168.1.45' }
  ]);

  const addAuditLog = (type: string, desc: string) => {
    setAuditLogs(prev => [{
      id: Date.now(),
      time: new Date().toISOString(),
      admin: 'Super Admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff',
      type,
      desc,
      ip: '192.168.1.45'
    }, ...prev]);
  };

  const updateRequestStatus = (id: string, status: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    addAuditLog('Request Update', `Updated request ${id} to ${status}`);
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    addAuditLog('Request Deleted', `Deleted request ${id}`);
  };

  const addGiftCard = (brand: string) => {
    setGiftCards(prev => [...prev, { brand, stock: 100 }]);
    addAuditLog('Gift Card', `Added new Gift Card: ${brand}`);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const issueReward = (userId: string, amount: number) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: u.points + amount } : u));
    setTransactions(prev => [{
      id: `TXN-${Math.floor(Math.random() * 1000000)}`,
      user: user || users[0],
      type: 'System Bonus',
      amount,
      isPositive: true,
      date: new Date().toISOString(),
      status: 'Success'
    }, ...prev]);
    addAuditLog('Reward Issued', `Issued ${amount} points to user ${user?.name || userId}`);
  };

  const inviteMember = (email: string) => {
    const newUser = {
      id: `USR-${Math.floor(Math.random() * 10000)}`,
      name: email.split('@')[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
      points: 0,
      joinedAt: new Date().toISOString(),
      status: 'Active',
    };
    setUsers(prev => [newUser, ...prev]);
    addAuditLog('User Invited', `Invited new member ${email}`);
  };

  return (
    <AppContext.Provider value={{ 
      users, requests, transactions, notifications, giftCards, auditLogs,
      setUsers, setRequests, setTransactions, setNotifications, setGiftCards,
      updateRequestStatus, deleteRequest, addGiftCard,
      markAllNotificationsRead, markNotificationRead, deleteNotification,
      issueReward, inviteMember, addAuditLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
