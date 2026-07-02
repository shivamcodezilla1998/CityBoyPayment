import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import {
  CheckCircle2, Clock, XCircle, User, CreditCard,
  ArrowUpRight, ArrowDownRight, Bell, Settings as SettingsIcon,
  Shield, Mail, Lock, Eye, Check, X, Filter, Download, Plus, AlertCircle, Calendar as CalendarIcon, History, Activity, Gift, Search
} from 'lucide-react';

// --- Shared Chart Options ---
const getBarOptions = (title: string): ApexOptions => ({
  chart: { type: 'bar', toolbar: { show: false } },
  colors: ['#4C5BE0'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
  dataLabels: { enabled: false },
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yaxis: { max: (val: number) => Math.ceil(val * 1.15) },
  title: { text: title, style: { fontWeight: '600', color: '#475569' } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
});

const getLineOptions = (title: string): ApexOptions => ({
  chart: { type: 'line', toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#3b82f6', '#4C5BE0'],
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  title: { text: title, style: { fontWeight: '600', color: '#475569' } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
});

const getPieOptions = (labels: string[]): ApexOptions => ({
  chart: { type: 'donut' },
  labels,
  colors: ['#4C5BE0', '#4C5BE0', '#f43f5e'],
  legend: { position: 'bottom' },
});

// --- Components ---

export function RewardRequests() {
  const { requests, updateRequestStatus } = useAppContext();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const itemsPerPage = 10;

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const filteredRequests = filterStatus === 'All' ? requests : requests.filter((r: any) => r.status === filterStatus);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(currentRequests.map((r: any) => r.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRowIds(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  const handleBulkAction = (action: 'Approved' | 'Rejected') => {
    selectedRowIds.forEach(id => updateRequestStatus(id, action));
    toast.success(`Bulk ${action.toLowerCase()} completed for ${selectedRowIds.length} requests!`);
    setSelectedRowIds([]);
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Request ID,Member,Email,Gift Card,Points,Date,Status\n"
      + filteredRequests.map((r: any) => `${r.id},${r.user.name},${r.user.email},${r.giftCard},${r.points},${new Date(r.date).toLocaleDateString()},${r.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reward_requests.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Export completed!');
  };

  const series = [{ name: 'Requests', data: [12, 19, 15, 25, 22, 30, 28] }];

  return (
    <PageContainer title="Reward Requests" description="Manage all member reward requests here.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-soft relative">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-primary">Weekly Requests</h3>
              <p className="text-xs text-secondary">Volume over the last 7 days</p>
            </div>
            <select className="bg-subtle border border-soft text-xs rounded-lg px-2 py-1">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <Chart options={getBarOptions('')} series={series} type="bar" height={250} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-soft flex flex-col justify-center gap-4">
          <div className="p-4 bg-amber-50 rounded-xl flex items-center gap-4 border border-amber-100">
            <Clock className="text-warning-500 w-8 h-8" />
            <div><p className="text-sm font-medium text-amber-700">Pending</p><p className="text-2xl font-bold text-amber-900">{requests.filter((r: any) => r.status === 'Pending').length}</p></div>
          </div>
          <div className="p-4 bg-brand-50 rounded-xl flex items-center gap-4 border border-brand-100">
            <CheckCircle2 className="text-brand-500 w-8 h-8" />
            <div><p className="text-sm font-medium text-brand-700">Approved</p><p className="text-2xl font-bold text-brand-900">{requests.filter((r: any) => r.status === 'Approved').length}</p></div>
          </div>
          <div className="p-4 bg-red-50 rounded-xl flex items-center gap-4 border border-red-100">
            <XCircle className="text-danger-500 w-8 h-8" />
            <div><p className="text-sm font-medium text-red-700">Rejected</p><p className="text-2xl font-bold text-red-900">{requests.filter((r: any) => r.status === 'Rejected').length}</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-soft overflow-hidden">
        <div className="p-5 border-b border-soft flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="font-bold text-primary">All Requests</h3>
            <p className="text-xs text-secondary font-medium">Showing {filteredRequests.length} total items</p>
          </div>
          <div className="flex gap-2 items-center">
            {selectedRowIds.length > 0 && (
              <div className="flex items-center gap-2 mr-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{selectedRowIds.length} selected</span>
                <Button variant="outline" className="text-xs h-8 px-3 border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100" onClick={() => handleBulkAction('Approved')}>Approve All</Button>
                <Button variant="outline" className="text-xs h-8 px-3 border-red-200 text-red-700 bg-red-50 hover:bg-danger-50" onClick={() => handleBulkAction('Rejected')}>Reject All</Button>
              </div>
            )}
            <select
              className="text-xs h-8 px-2 border border-soft rounded-md outline-none bg-white text-secondary"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); setSelectedRowIds([]); }}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Button variant="outline" onClick={exportToCSV} className="text-xs h-8 px-3 border-soft gap-2"><Download className="w-3.5 h-3.5" /> Export</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-subtle/50 text-secondary text-xs border-b border-soft">
                <th className="px-5 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-strong text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    checked={currentRequests.length > 0 && selectedRowIds.length === currentRequests.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Member</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Request ID</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Gift Card</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Points</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentRequests.map((req: any, idx: number) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`hover:bg-subtle/80 transition-colors group ${selectedRowIds.includes(req.id) ? 'bg-brand-50/30' : ''}`}
                >
                  <td className="px-5 py-3 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-strong text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                      checked={selectedRowIds.includes(req.id)}
                      onChange={() => handleSelectRow(req.id)}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={req.user.avatar} alt={req.user.name} className="w-9 h-9 rounded-full object-cover border border-soft shadow-sm" />
                      <div>
                        <span className="font-semibold text-sm text-primary block">{req.user.name}</span>
                        <span className="text-xs text-secondary block">{req.user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-secondary font-mono font-medium">{req.id}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-primary">{req.giftCard}</td>
                  <td className="px-5 py-3 text-sm font-bold text-brand-600">{req.points.toLocaleString()}</td>
                  <td className="px-5 py-3 text-xs text-secondary">{new Date(req.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border
                      ${req.status === 'Approved' ? 'bg-brand-50 text-brand-700 border-brand-200' :
                        req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="outline"
                      className="h-8 text-xs font-medium bg-white hover:bg-subtle transition-colors"
                      onClick={() => {
                        setSelectedRequest(req);
                        setIsDrawerOpen(true);
                      }}
                    >
                      Review Request
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-soft flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">Showing {filteredRequests.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} results</span>
            <div className="flex gap-1">
              <Button variant="outline" className="h-7 text-xs px-2 border-soft" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>Previous</Button>
              <Button variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === 1 ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(1)}>1</Button>
              {currentPage > 3 && <span className="px-1 text-tertiary">...</span>}
              {Array.from({ length: totalPages }).map((_, i) => i + 1).filter(p => p !== 1 && p !== totalPages && Math.abs(currentPage - p) <= 1).map(p => (
                <Button key={p} variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === p ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(p)}>{p}</Button>
              ))}
              {currentPage < totalPages - 2 && <span className="px-1 text-tertiary">...</span>}
              {totalPages > 1 && (
                <Button variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === totalPages ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
              )}
              <Button variant="outline" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="h-7 text-xs px-2 border-soft">Next</Button>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Review Reward Request"
        width="w-full max-w-2xl"
        footer={
          selectedRequest?.status === 'Pending' ? (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setIsRejectModalOpen(true)}>Reject</Button>
              <Button className="bg-brand-600 hover:bg-brand-700" onClick={() => setIsApproveModalOpen(true)}>Approve Request</Button>
            </div>
          ) : (
            <div className="flex justify-end"><Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Close</Button></div>
          )
        }
      >
        {selectedRequest && (
          <div className="p-6 space-y-8">

            {/* Member Information */}
            <section>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><User className="w-4 h-4 text-brand-600" /> Member Information</h4>
              <div className="bg-subtle rounded-xl p-4 border border-soft flex items-start gap-4">
                <img src={selectedRequest.user.avatar} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-secondary font-medium mb-0.5">Name</p>
                    <p className="font-bold text-primary">{selectedRequest.user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium mb-0.5">Email</p>
                    <p className="font-medium text-primary text-sm">{selectedRequest.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium mb-0.5">Member ID</p>
                    <p className="font-mono text-xs text-primary">{selectedRequest.user.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium mb-0.5">Current Points</p>
                    <p className="font-bold text-brand-600">{selectedRequest.user.points.toLocaleString()} pts</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Request Details */}
            <section>
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><Gift className="w-4 h-4 text-brand-600" /> Request Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-soft">
                  <p className="text-xs text-secondary font-medium mb-1">Requested Gift Card</p>
                  <p className="font-bold text-primary flex items-center gap-2"><CreditCard className="w-4 h-4 text-tertiary" /> {selectedRequest.giftCard}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-soft">
                  <p className="text-xs text-secondary font-medium mb-1">Points Required</p>
                  <p className="font-bold text-red-600 text-lg">-{selectedRequest.points.toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* History */}
            <div className="grid grid-cols-2 gap-6">
              <section>
                <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2"><History className="w-4 h-4 text-secondary" /> Reward History</h4>
                <div className="bg-subtle rounded-xl p-4 border border-soft space-y-3">
                  <div className="flex justify-between items-center"><span className="text-xs text-secondary">Total Earned</span><span className="font-bold text-brand-600">24,500</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-secondary">Total Redeemed</span><span className="font-bold text-red-600">-12,000</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-soft"><span className="text-xs font-bold text-primary">Net Balance</span><span className="font-bold text-brand-600">12,500</span></div>
                </div>
              </section>
              <section>
                <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-secondary" /> Recent Participation</h4>
                <div className="bg-subtle rounded-xl p-4 border border-soft space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-primary">Beach Cleanup 2026</p>
                      <p className="text-[10px] text-secondary">2 weeks ago</p>
                    </div>
                    <span className="text-xs font-bold text-brand-600">+500 pts</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-primary">Recycling Workshop</p>
                      <p className="text-[10px] text-secondary">1 month ago</p>
                    </div>
                    <span className="text-xs font-bold text-brand-600">+250 pts</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Timeline */}
            <section>
              <h4 className="text-sm font-bold text-primary mb-4">Request Timeline</h4>
              <div className="ml-2 pl-4 border-l-2 border-brand-100 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-brand-600 ring-4 ring-brand-50"></div>
                  <p className="text-sm font-bold text-primary">Request Submitted</p>
                  <p className="text-xs text-secondary">{new Date(selectedRequest.date).toLocaleString()}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-50"></div>
                  <p className="text-sm font-bold text-primary">Under Review</p>
                  <p className="text-xs text-secondary">Currently pending admin action</p>
                </div>
              </div>
            </section>

            {/* Admin Notes */}
            {selectedRequest.status === 'Pending' && (
              <section>
                <label className="text-sm font-bold text-primary mb-2 block">Admin Notes (Internal)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full h-24 p-3 bg-white border border-soft rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                  placeholder="Add any internal notes about this request..."
                />
              </section>
            )}

          </div>
        )}
      </Drawer>

      {/* Approve Modal */}
      <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Approve Reward Request">
        <div className="space-y-4">
          <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl text-brand-800 text-sm">
            You are about to approve <strong>{selectedRequest?.giftCard}</strong> for <strong>{selectedRequest?.user.name}</strong>. This will deduct <strong>{selectedRequest?.points.toLocaleString()} points</strong> from their account permanently.
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
            <Button className="bg-brand-600 hover:bg-brand-700" onClick={() => {
              if (selectedRequest) {
                updateRequestStatus(selectedRequest.id, 'Approved');
              }
              toast.success('Reward request approved!');
              setIsApproveModalOpen(false);
              setIsDrawerOpen(false);
            }}>Confirm Approval</Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Reward Request">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm mb-4 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Rejecting this request will return {selectedRequest?.points.toLocaleString()} points to the user's balance. Please provide a reason.</p>
          </div>

          <div>
            <label className="text-sm font-bold text-primary mb-1 block">Rejection Reason (Sent to user) *</label>
            <select
              className="w-full p-2.5 bg-subtle border border-soft rounded-lg text-sm mb-3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              <option value="suspicious">Suspicious activity detected</option>
              <option value="points">Insufficient point balance validation</option>
              <option value="stock">Requested item out of stock</option>
              <option value="other">Other (Specify in notes)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectReason}
              onClick={() => {
                if (selectedRequest) {
                  updateRequestStatus(selectedRequest.id, 'Rejected');
                }
                toast.success('Reward request rejected.');
                setIsRejectModalOpen(false);
                setIsDrawerOpen(false);
              }}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}

export function Members() {
  const { users } = useAppContext();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const activeCount = users.filter((u: any) => u.status === 'Active').length;
  const inactiveCount = users.length - activeCount;
  const pieSeries = [activeCount, inactiveCount, 0];
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const itemsPerPage = 10;

  const filteredUsers = filterStatus === 'All' ? users : users.filter((u: any) => u.status === filterStatus);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "User ID,Name,Email,Total Points,Joined Date,Status\n"
      + filteredUsers.map((u: any) => `${u.id},${u.name},${u.email},${u.points},${new Date(u.joinedAt).toLocaleDateString()},${u.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "members.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Export completed!');
  };

  return (
    <PageContainer title="Members" description="View and manage all registered members.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-soft flex flex-col items-center justify-center relative">
          <div className="absolute top-4 left-6">
            <h3 className="font-bold text-primary">Member Status</h3>
          </div>
          <Chart options={getPieOptions(['Active', 'Inactive', 'Banned'])} series={pieSeries} type="donut" height={280} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-soft relative">
          <div className="absolute top-4 left-6 z-10">
            <h3 className="font-bold text-primary">Member Growth</h3>
            <p className="text-xs text-secondary">Signups over the last 6 months</p>
          </div>
          <Chart options={getLineOptions('')} series={[{ name: 'New Users', data: [150, 410, 350, 510, 490, 620] }]} type="line" height={300} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-soft overflow-hidden">
        <div className="p-5 border-b border-soft flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="font-bold text-primary">Member Directory</h3>
            <p className="text-xs text-secondary font-medium">Showing {filteredUsers.length} total members</p>
          </div>
          <div className="flex gap-2">
            <select
              className="text-xs h-8 px-2 border border-soft rounded-md outline-none bg-white text-secondary"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Button variant="outline" onClick={exportToCSV} className="text-xs h-8 px-3 border-soft gap-2"><Download className="w-3.5 h-3.5" /> Export</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-subtle/50 text-secondary text-xs border-b border-soft">
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Member Details</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">User ID</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Total Points</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Joined Date</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUsers.map((user: any, idx: number) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-subtle/80 transition-colors group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-soft shadow-sm" />
                      <div>
                        <span className="font-semibold text-sm text-primary block">{user.name}</span>
                        <span className="text-xs text-secondary block">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-secondary font-mono font-medium">{user.id}</td>
                  <td className="px-5 py-3 text-sm font-bold text-brand-600">{user.points.toLocaleString()}</td>
                  <td className="px-5 py-3 text-xs text-secondary">{new Date(user.joinedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border
                      ${user.status === 'Active' ? 'bg-brand-50 text-brand-700 border-brand-200' :
                        'bg-subtle text-secondary border-soft'}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="outline"
                      className="h-8 text-xs font-medium bg-white hover:bg-subtle transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Profile
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-soft flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} members</span>
            <div className="flex gap-1">
              <Button variant="outline" className="h-7 text-xs px-2 border-soft" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>Previous</Button>
              <Button variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === 1 ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(1)}>1</Button>
              {currentPage > 3 && <span className="px-1 text-tertiary">...</span>}
              {Array.from({ length: totalPages }).map((_, i) => i + 1).filter(p => p !== 1 && p !== totalPages && Math.abs(currentPage - p) <= 1).map(p => (
                <Button key={p} variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === p ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(p)}>{p}</Button>
              ))}
              {currentPage < totalPages - 2 && <span className="px-1 text-tertiary">...</span>}
              {totalPages > 1 && (
                <Button variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === totalPages ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
              )}
              <Button variant="outline" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="h-7 text-xs px-2 border-soft">Next</Button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Member Profile">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-subtle rounded-xl border border-soft">
              <img src={selectedUser.avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4" />
              <h4 className="text-xl font-bold text-primary">{selectedUser.name}</h4>
              <p className="text-sm text-secondary mb-2">{selectedUser.email}</p>
              <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border
                ${selectedUser.status === 'Active' ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-subtle text-secondary border-soft'}`}>
                {selectedUser.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-soft">
                <p className="text-xs text-secondary font-medium mb-1">Total Points</p>
                <p className="font-bold text-brand-600 text-xl">{selectedUser.points.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl border border-soft">
                <p className="text-xs text-secondary font-medium mb-1">Joined Date</p>
                <p className="font-bold text-primary">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-soft">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
              <Button variant="outline" onClick={() => { toast.success('Password reset email sent'); setSelectedUser(null); }}>Reset Password</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}

export function GiftCards() {
  const { giftCards } = useAppContext();

  return (
    <PageContainer title="Gift Cards" description="Manage gift card inventory and types.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {giftCards.map((card: any, i: number) => (
          <motion.div
            key={card.brand}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-soft relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -z-0 opacity-10 transition-transform group-hover:scale-110
              ${i % 2 === 0 ? 'bg-brand-500' : i % 3 === 0 ? 'bg-brand-500' : 'bg-amber-500'}`}></div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex justify-between items-start mb-2">
                <div className="p-3 bg-subtle rounded-xl shadow-sm"><CreditCard className="w-6 h-6 text-primary" /></div>
                <button onClick={() => toast.success(`${card.brand} card edited`)} className="text-tertiary hover:text-brand-600"><SettingsIcon className="w-4 h-4" /></button>
              </div>
              <h3 className="text-xl font-bold text-primary">{card.brand}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-secondary text-sm font-medium">Stock: <span className="text-primary font-bold">{card.stock}</span></p>
                <div className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">Active</div>
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-subtle/50 p-6 rounded-2xl border-2 border-dashed border-soft flex flex-col items-center justify-center text-center hover:bg-subtle transition-colors cursor-pointer group"
          onClick={() => toast.success('New gift card wizard opened')}
        >
          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform text-brand-600"><Plus className="w-6 h-6" /></div>
          <h3 className="font-bold text-primary">Add New Card</h3>
          <p className="text-xs text-secondary mt-1">Create a new reward option</p>
        </motion.div>
      </div>
    </PageContainer>
  );
}

export function Transactions() {
  const { transactions } = useAppContext();
  const inflow = transactions.filter((t: any) => t.isPositive).reduce((acc: number, t: any) => acc + t.amount, 0);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('All');
  const itemsPerPage = 10;

  const filteredTransactions = filterType === 'All' ? transactions : transactions.filter((t: any) => t.type === filterType);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Transaction ID,User,Type,Amount,Date,Status\n"
      + filteredTransactions.map((t: any) => `${t.id},${t.user.name},${t.type},${t.isPositive ? '+' : '-'}${t.amount},${new Date(t.date).toLocaleDateString()},${t.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Export completed!');
  };

  return (
    <PageContainer title="Transactions" description="View system-wide point and reward transactions.">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-soft">
          <Chart options={getLineOptions('Transaction Volume')} series={[{ name: 'Inflow', data: [100, 200, 150, 300, 250, 400] }, { name: 'Outflow', data: [80, 150, 120, 250, 200, 350] }]} type="area" height={250} />
        </div>
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full blur-xl"></div>
          <ArrowUpRight className="w-10 h-10 mb-4 text-brand-200" />
          <p className="text-brand-200 text-xs font-bold uppercase tracking-wider">Total Volume</p>
          <p className="text-3xl font-black mt-2">{inflow.toLocaleString()}</p>
          <p className="text-brand-200 text-[10px] font-medium mt-1 uppercase tracking-widest">Points Issued</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-soft overflow-hidden">
        <div className="p-5 border-b border-soft flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="font-bold text-primary">Recent Transactions</h3>
            <p className="text-xs text-secondary font-medium">Showing {filteredTransactions.length} records</p>
          </div>
          <div className="flex gap-2">
            <select
              className="text-xs h-8 px-2 border border-soft rounded-md outline-none bg-white text-secondary"
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Types</option>
              <option value="Earning">Earning</option>
              <option value="Redemption">Redemption</option>
              <option value="System Bonus">System Bonus</option>
              <option value="Refund">Refund</option>
            </select>
            <Button variant="outline" onClick={exportToCSV} className="text-xs h-8 px-3 border-soft gap-2"><Download className="w-3.5 h-3.5" /> Export</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-subtle/50 text-secondary text-xs border-b border-soft">
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Transaction ID</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">User</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Type</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentTransactions.map((txn: any, idx: number) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-subtle/80 transition-colors"
                >
                  <td className="px-5 py-3 text-xs text-secondary font-mono font-medium">{txn.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <img src={txn.user.avatar} className="w-6 h-6 rounded-full" />
                      <span className="font-semibold text-xs text-primary">{txn.user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-medium text-secondary">{txn.type}</td>
                  <td className={`px-5 py-3 font-bold text-sm text-right ${txn.isPositive ? 'text-brand-600' : 'text-primary'}`}>
                    {txn.isPositive ? '+' : '-'}{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-xs text-secondary">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border
                      ${txn.status === 'Success' ? 'bg-brand-50 text-brand-700 border-brand-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {txn.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-soft flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">Showing {filteredTransactions.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} records</span>
            <div className="flex gap-1">
              <Button variant="outline" className="h-7 text-xs px-2 border-soft" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>Previous</Button>
              <Button variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === 1 ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(1)}>1</Button>
              {currentPage > 3 && <span className="px-1 text-tertiary">...</span>}
              {Array.from({ length: totalPages }).map((_, i) => i + 1).filter(p => p !== 1 && p !== totalPages && Math.abs(currentPage - p) <= 1).map(p => (
                <Button key={p} variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === p ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(p)}>{p}</Button>
              ))}
              {currentPage < totalPages - 2 && <span className="px-1 text-tertiary">...</span>}
              {totalPages > 1 && (
                <Button variant="outline" className={`h-7 text-xs px-2 border-soft ${currentPage === totalPages ? 'bg-subtle' : ''}`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
              )}
              <Button variant="outline" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="h-7 text-xs px-2 border-soft">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export function Reports() {
  return (
    <PageContainer title="Reports & Analytics" description="Generate and view comprehensive analytics reports.">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-soft mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">Date Range</label>
            <select className="text-sm font-bold text-primary bg-subtle border border-soft rounded-lg px-3 py-1.5 outline-none">
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">Report Type</label>
            <select className="text-sm font-bold text-primary bg-subtle border border-soft rounded-lg px-3 py-1.5 outline-none">
              <option>Overview</option>
              <option>Financial</option>
              <option>User Engagement</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.success('Exporting PDF...')} className="text-xs h-9 gap-2 border-soft hover:bg-subtle"><Download className="w-3.5 h-3.5" /> PDF</Button>
          <Button variant="outline" onClick={() => toast.success('Exporting Excel...')} className="text-xs h-9 gap-2 border-soft hover:bg-subtle"><Download className="w-3.5 h-3.5" /> Excel</Button>
          <Button variant="outline" onClick={() => toast.success('Exporting CSV...')} className="text-xs h-9 gap-2 border-soft hover:bg-subtle"><Download className="w-3.5 h-3.5" /> CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-soft">
          <p className="text-xs font-bold text-secondary mb-1">Total Points Issued</p>
          <p className="text-2xl font-black text-brand-600">1.2M</p>
          <p className="text-[10px] text-brand-600 font-bold mt-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +12.5% vs last month</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-soft">
          <p className="text-xs font-bold text-secondary mb-1">Total Points Redeemed</p>
          <p className="text-2xl font-black text-red-600">845K</p>
          <p className="text-[10px] text-brand-600 font-bold mt-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +8.2% vs last month</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-soft">
          <p className="text-xs font-bold text-secondary mb-1">Approval Rate</p>
          <p className="text-2xl font-black text-primary">92.4%</p>
          <p className="text-[10px] text-red-600 font-bold mt-2 flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> -1.1% vs last month</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-soft">
          <p className="text-xs font-bold text-secondary mb-1">Avg Request Value</p>
          <p className="text-2xl font-black text-primary">2,450</p>
          <p className="text-[10px] text-tertiary font-bold mt-2 flex items-center gap-1">pts per request</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-soft lg:col-span-2">
          <Chart options={getBarOptions('Monthly Point Flow')} series={[{ name: 'Issued', data: [120, 150, 180, 220, 210, 280, 300] }, { name: 'Redeemed', data: [90, 120, 140, 180, 150, 210, 250] }]} type="bar" height={300} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-soft flex flex-col justify-center">
          <Chart options={getPieOptions(['Amazon', 'Starbucks', 'Target', 'Walmart'])} series={[45, 25, 20, 10]} type="donut" height={280} />
          <h4 className="text-center font-bold text-primary mt-4 text-sm">Most Popular Gift Cards</h4>
        </div>
      </div>
    </PageContainer>
  );
}

export function AuditLogs() {
  const { auditLogs } = useAppContext();

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Timestamp,Admin User,Action Type,Description,IP Address\n"
      + auditLogs.map((log: any) => `${new Date(log.time).toISOString()},${log.admin},${log.type},"${log.desc}",${log.ip}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Logs exported successfully!');
  };

  return (
    <PageContainer title="System Audit Logs" description="Track all administrative actions and system changes for compliance.">
      <div className="bg-white rounded-2xl shadow-sm border border-soft overflow-hidden min-h-[600px]">
        <div className="p-5 border-b border-soft flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="font-bold text-primary">Activity History</h3>
            <p className="text-xs text-secondary font-medium">Total {auditLogs.length} records</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search logs..." className="pl-9 pr-4 py-1.5 text-sm bg-subtle border border-soft rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all w-64" />
            </div>
            <Button variant="outline" onClick={exportLogs} className="text-xs h-9 px-4 border-soft gap-2 hover:bg-subtle"><Download className="w-3.5 h-3.5" /> Export CSV</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-subtle/50 text-secondary text-xs border-b border-soft">
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Timestamp</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Admin User</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Action Type</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Description</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log: any, i: number) => (
                <tr key={log.id || i} className="hover:bg-subtle/80 transition-colors group">
                  <td className="px-5 py-3 text-xs text-secondary font-medium">
                    <span className="block">{new Date(log.time).toLocaleDateString()}</span>
                    <span className="block text-[10px] text-tertiary">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <img src={log.avatar} alt={log.admin} className="w-7 h-7 rounded-full shadow-sm" />
                      <span className="font-semibold text-xs text-primary">{log.admin}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-subtle text-secondary border border-soft">{log.type}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-primary font-medium">{log.desc}</td>
                  <td className="px-5 py-3 text-[11px] text-tertiary font-mono bg-subtle/50 rounded inline-block mt-2 px-1.5 py-0.5 border border-soft">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General', 'Reward Rules', 'Gift Card Settings', 'Email Templates', 'Notification Templates', 'Security', 'Admin Profile', 'Theme'];

  return (
    <PageContainer title="Settings" description="System configuration and preferences.">
      <div className="bg-white rounded-2xl shadow-sm border border-soft flex overflow-hidden min-h-[600px]">

        {/* Settings Sidebar */}
        <div className="w-64 bg-subtle border-r border-soft p-4 shrink-0">
          <h3 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4 px-3">Configuration</h3>
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all
                  ${activeTab === tab ? 'bg-white text-brand-700 shadow-sm border border-soft' : 'text-secondary hover:bg-slate-200/50 hover:text-primary'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-black text-primary mb-6 border-b border-soft pb-4">{activeTab}</h2>

            {activeTab === 'General' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-soft pb-5">
                  <div>
                    <p className="font-bold text-primary">Allow User Registration</p>
                    <p className="text-xs text-secondary font-medium mt-1">Enable or disable new user signups from the public portal.</p>
                  </div>
                  <div onClick={() => toast.success('Registration toggled')} className="w-12 h-6 bg-brand-600 rounded-full relative cursor-pointer hover:bg-brand-700 transition-colors shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-soft pb-5">
                  <div>
                    <p className="font-bold text-primary">Maintenance Mode</p>
                    <p className="text-xs text-secondary font-medium mt-1">Put the application in maintenance mode. Only admins can login.</p>
                  </div>
                  <div onClick={() => toast.error('Maintenance mode toggled')} className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer hover:bg-slate-300 transition-colors shadow-inner">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Support Email Address</label>
                  <input type="email" defaultValue="support@cityboy.com" className="w-full px-4 py-2.5 bg-white border border-soft rounded-xl text-primary text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm" />
                </div>
                <Button onClick={() => toast.success('Settings saved successfully')} className="px-8">Save Changes</Button>
              </div>
            )}

            {activeTab !== 'General' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-subtle rounded-full flex items-center justify-center mb-4">
                  <SettingsIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{activeTab} configuration</h3>
                <p className="text-sm text-secondary max-w-sm">This section is currently using default system parameters. Customization options will be available soon.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
}

export function Profile() {
  return (
    <PageContainer title="User Profile" description="Manage your account details and preferences.">
      <div className="bg-white rounded-2xl shadow-sm border border-soft max-w-4xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-slate-800 to-brand-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="p-6 relative">
          <div className="w-24 h-24 bg-white rounded-full absolute -top-12 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff&size=96" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-black text-primary">Admin User</h2>
            <p className="text-secondary flex items-center gap-1 mt-1 text-xs font-bold bg-subtle self-start inline-flex px-2 py-0.5 rounded-full"><Shield className="w-3 h-3 text-brand-500" /> Superadmin Role</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-tertiary" /> Full Name</label>
              <input type="text" value="Admin User" readOnly className="w-full px-4 py-2.5 bg-subtle border border-soft rounded-lg text-secondary text-sm font-semibold focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-2 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-tertiary" /> Email Address</label>
              <input type="email" value="admin@cityboy.com" readOnly className="w-full px-4 py-2.5 bg-subtle border border-soft rounded-lg text-secondary text-sm font-semibold focus:outline-none" />
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-soft">
            <Button variant="outline" onClick={() => toast.success('Password reset email sent to your inbox')} className="gap-2 text-brand-600 border-brand-200 hover:bg-brand-50"><Lock className="w-4 h-4" /> Change Password</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export function Notifications() {
  return (
    <PageContainer title="Notifications" description="View all system notifications.">
      <div className="bg-white rounded-2xl shadow-sm border border-soft max-w-4xl">
        <div className="p-5 border-b border-soft flex items-center justify-between bg-subtle/50">
          <h3 className="font-bold text-primary flex items-center gap-2"><Bell className="w-5 h-5 text-tertiary" /> Recent Alerts</h3>
          <button onClick={() => toast.success('All notifications marked as read')} className="text-xs text-brand-600 font-bold hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors">Mark all as read</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { title: 'New Reward Request', desc: 'User123 requested 500 points.', time: '10 mins ago', unread: true },
            { title: 'System Update', desc: 'Server maintenance scheduled for tomorrow.', time: '2 hours ago', unread: true },
            { title: 'Gift Card Stock Low', desc: 'Amazon $10 cards are running low (5 left).', time: '1 day ago', unread: false },
            { title: 'Weekly Report Ready', desc: 'Your weekly analytics report is available to download.', time: '2 days ago', unread: false },
          ].map((notif, i) => (
            <div key={i} className={`p-5 flex gap-4 hover:bg-subtle/80 transition-colors ${notif.unread ? 'bg-brand-50/20' : ''}`}>
              <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 shadow-sm ${notif.unread ? 'bg-brand-500' : 'bg-slate-200'}`}></div>
              <div>
                <p className={`text-sm font-bold ${notif.unread ? 'text-primary' : 'text-secondary'}`}>{notif.title}</p>
                <p className="text-sm text-secondary mt-0.5 font-medium">{notif.desc}</p>
                <p className="text-xs text-tertiary mt-2 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> {notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
