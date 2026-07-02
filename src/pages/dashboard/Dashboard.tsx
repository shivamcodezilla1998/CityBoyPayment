import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import { PageContainer } from '../../components/layout/PageContainer';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Clock, CheckCircle, XCircle,
  Gift, Activity,
  TrendingUp, TrendingDown, Star, Award,
  Plus, List, FileText, Eye, Check, X,
  Download, RefreshCw, Filter, MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

// --- Chart Configurations ---
const lineChartOptions: ApexCharts.ApexOptions = {
  chart: { type: 'area', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  stroke: { curve: 'smooth', width: 2 },
  colors: ['#4C5BE0'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], axisBorder: { show: false }, axisTicks: { show: false } },
  dataLabels: { enabled: false },
  grid: { strokeDashArray: 4, borderColor: '#f1f5f9' },
  tooltip: { theme: 'light' },
};
const lineChartSeries = [{ name: 'Requests', data: [120, 180, 150, 240, 210, 320, 290] }];

const pieChartOptions: ApexCharts.ApexOptions = {
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
  labels: ['Approved', 'Rejected', 'Pending'],
  colors: ['#4C5BE0', '#f43f5e', '#f59e0b'],
  plotOptions: { pie: { donut: { size: '75%' } } },
  dataLabels: { enabled: false },
  legend: { position: 'bottom', markers: { strokeWidth: 0 } },
  tooltip: { theme: 'light' }
};



// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [formData, setFormData] = useState({ userId: '', amount: '', email: '', brand: '' });
  const [filterPending, setFilterPending] = useState(false);
  const navigate = useNavigate();
  const { users, requests, updateRequestStatus, issueReward, inviteMember, addGiftCard } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Calculate Metrics from global state
  const totalMembers = users.length.toLocaleString();
  const activeMembers = users.filter(u => u.status === 'Active').length.toLocaleString();
  const pendingReqs = requests.filter(r => r.status === 'Pending').length.toLocaleString();
  const approvedReqs = requests.filter(r => r.status === 'Approved').length.toLocaleString();
  const rejectedReqs = requests.filter(r => r.status === 'Rejected').length.toLocaleString();



  const stats = [
    { title: 'Total Members', value: totalMembers, growth: '+12%', icon: Users, color: 'text-brand-600', bg: 'bg-brand-100', trend: 'up' },
    { title: 'Active Members', value: activeMembers, growth: '+5%', icon: UserCheck, color: 'text-brand-600', bg: 'bg-brand-100', trend: 'up' },
    { title: 'Pending Requests', value: pendingReqs, growth: '+2%', icon: Clock, color: 'text-amber-600', bg: 'bg-warning-50', trend: 'up' },
    { title: 'Approved Requests', value: approvedReqs, growth: '+18%', icon: CheckCircle, color: 'text-brand-500', bg: 'bg-brand-50', trend: 'up' },
    { title: 'Rejected Requests', value: rejectedReqs, growth: '-4%', icon: XCircle, color: 'text-red-600', bg: 'bg-danger-50', trend: 'down' },
    { title: 'Points Redeemed', value: '1.2M', growth: '+24%', icon: Star, color: 'text-brand-600', bg: 'bg-brand-100', trend: 'up' },
    { title: 'Gift Cards Issued', value: '8,900', growth: '+15%', icon: Gift, color: 'text-purple-600', bg: 'bg-purple-100', trend: 'up' },
    { title: "Today's Requests", value: '45', growth: '+8%', icon: Activity, color: 'text-pink-600', bg: 'bg-pink-100', trend: 'up' },
  ];

  const topMembers = [...users].sort((a, b) => b.points - a.points).slice(0, 4);
  const recentRequests = filterPending
    ? requests.filter((r: any) => r.status === 'Pending').slice(0, 5)
    : requests.slice(0, 5);

  const quickActions = [
    { name: 'Issue Reward', desc: 'Manually issue points to a user', icon: Plus, color: 'bg-brand-500', action: () => setActiveAction({ name: 'Issue Reward', desc: 'Manually issue points' }) },
    { name: 'Pending Requests', desc: 'Review unapproved items', icon: List, color: 'bg-amber-500', action: () => navigate('/reward-requests') },
    { name: 'Invite Member', desc: 'Send an email invitation', icon: Users, color: 'bg-purple-500', action: () => setActiveAction({ name: 'Invite Member', desc: 'Send an email invitation' }) },
    { name: 'Add Gift Card', desc: 'Create a new card type', icon: Gift, color: 'bg-brand-500', action: () => setActiveAction({ name: 'Add Gift Card', desc: 'Create a new card type' }) },
    { name: 'Export Report', desc: 'Download CSV of this month', icon: FileText, color: 'bg-brand-500', action: () => toast.success('Exporting report...') },
  ];



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-secondary font-medium animate-pulse">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer
      title="Overview Dashboard"
      description={`Welcome back to the Payment Potal. Today is ${currentDate}.`}
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      <div className="space-y-6">

        {/* Statistics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-soft group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`flex items-center text-xs font-bold ${stat.trend === 'up' ? 'text-brand-600 bg-brand-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.growth}
                  </span>
                  <span className="text-[10px] text-tertiary mt-1 font-medium">vs last month</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-secondary text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                onClick={action.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${action.color} text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-2 relative overflow-hidden group text-left`}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold block">{action.name}</span>
                  <span className="text-[10px] text-white/80 font-medium block mt-0.5">{action.desc}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-soft lg:col-span-2 relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-primary">Reward Requests Trend</h2>
                <p className="text-xs text-secondary font-medium">Volume of requests over time</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success('Refreshing data...')} className="p-1.5 text-tertiary hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><RefreshCw className="w-4 h-4" /></button>
                <button onClick={() => toast.success('Downloading chart...')} className="p-1.5 text-tertiary hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
                <select className="bg-subtle border border-soft text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>Last 7 Months</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
            <div className="h-[280px]">
              <ReactApexChart options={lineChartOptions} series={lineChartSeries} type="area" height="100%" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-soft relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-primary">Status Distribution</h2>
                <p className="text-xs text-secondary font-medium">Breakdown by status</p>
              </div>
              <button onClick={() => toast.success('Viewing more pie chart options')} className="p-1.5 text-tertiary hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="h-[220px] flex items-center justify-center">
              <ReactApexChart options={pieChartOptions} series={[{ name: 'Count', data: [requests.filter(r => r.status === 'Approved').length, requests.filter(r => r.status === 'Rejected').length, requests.filter(r => r.status === 'Pending').length] }]} type="donut" height="100%" />
            </div>
          </motion.div>
        </motion.div>

        {/* Lower Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Reward Requests Table (Takes 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-soft overflow-hidden lg:col-span-2 flex flex-col"
          >
            <div className="p-5 border-b border-soft flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <div>
                <h2 className="text-lg font-bold text-primary">Recent Reward Requests</h2>
                <p className="text-xs text-secondary font-medium">Latest submissions from members</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterPending ? "primary" : "outline"}
                  onClick={() => setFilterPending(!filterPending)}
                  className={`text-xs h-8 px-3 border-soft gap-2 ${filterPending ? 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100' : ''}`}
                >
                  <Filter className="w-3.5 h-3.5" /> {filterPending ? 'Clear Filter' : 'Filter Pending'}
                </Button>
                <Button variant="outline" onClick={() => navigate('/reward-requests')} className="text-xs h-8 px-3 border-soft">View All</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-subtle/50 text-secondary text-xs border-b border-soft">
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Member</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Request ID</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Gift Card</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Points</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.map((req, idx) => (
                    <motion.tr
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.05) }}
                      className="hover:bg-subtle/80 transition-colors group"
                    >
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
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border
                          ${req.status === 'Approved' ? 'bg-brand-50 text-brand-700 border-brand-200' :
                            req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedRequest(req)} className="p-1.5 rounded-md text-tertiary hover:text-brand-600 hover:bg-brand-50 transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => { updateRequestStatus(req.id, 'Approved'); toast.success('Approved!') }} className="p-1.5 rounded-md text-tertiary hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => { updateRequestStatus(req.id, 'Rejected'); toast.error('Rejected!') }} className="p-1.5 rounded-md text-tertiary hover:text-red-600 hover:bg-red-50 transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Third Column */}
          <div className="space-y-6 lg:col-span-1">
            {/* Top Members Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-soft"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Award className="w-5 h-5 text-warning-500" /> Top Members
                  </h2>
                  <p className="text-xs text-secondary font-medium">Highest point earners</p>
                </div>
              </div>
              <div className="space-y-3">
                {topMembers.map((member, idx) => (
                  <div key={member.id} onClick={() => navigate('/members')} className="cursor-pointer flex items-center justify-between p-3 rounded-xl hover:bg-subtle transition-colors border border-transparent hover:border-soft">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-soft" />
                        {idx < 3 && (
                          <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm
                            ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">{member.name}</h4>
                        <p className="text-xs font-semibold text-brand-600">{member.points.toLocaleString()} pts</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- Modals --- */}
        <Modal isOpen={!!activeAction} onClose={() => setActiveAction(null)} title={activeAction?.name || ''}>
          <div className="space-y-4">
            <p className="text-secondary text-sm">{activeAction?.desc}</p>
            <div className="bg-subtle p-4 rounded-xl border border-soft flex flex-col items-center justify-center py-6">
              {activeAction?.name === 'Issue Reward' && (
                <div className="w-full space-y-3">
                  <select
                    className="w-full border-soft rounded-lg p-2 text-sm"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  >
                    <option value="">Select User</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="Amount (Points)"
                    className="w-full border-soft rounded-lg p-2 text-sm"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              )}
              {activeAction?.name === 'Invite Member' && (
                <div className="w-full space-y-3">
                  <input
                    type="email"
                    placeholder="User Email"
                    className="w-full border-soft rounded-lg p-2 text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              )}
              {activeAction?.name === 'Add Gift Card' && (
                <div className="w-full space-y-3">
                  <input
                    type="text"
                    placeholder="Brand Name (e.g., Netflix)"
                    className="w-full border-soft rounded-lg p-2 text-sm"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-soft">
              <Button variant="outline" onClick={() => setActiveAction(null)}>Cancel</Button>
              <Button onClick={() => {
                if (activeAction?.name === 'Issue Reward' && formData.userId && formData.amount) {
                  issueReward(formData.userId, parseInt(formData.amount));
                  toast.success(`Issued ${formData.amount} points!`);
                } else if (activeAction?.name === 'Invite Member' && formData.email) {
                  inviteMember(formData.email);
                  toast.success(`Invited ${formData.email}!`);
                } else if (activeAction?.name === 'Add Gift Card' && formData.brand) {
                  addGiftCard(formData.brand);
                  toast.success(`Added ${formData.brand} gift card!`);
                } else {
                  toast.error('Please fill all fields');
                  return;
                }
                setFormData({ userId: '', amount: '', email: '', brand: '' });
                setActiveAction(null);
              }}>Confirm Action</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="Manage Request">
          {selectedRequest && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-subtle rounded-xl border border-soft">
                <img src={selectedRequest.user.avatar} alt="User" className="w-12 h-12 rounded-full border border-soft" />
                <div>
                  <h4 className="font-bold text-primary">{selectedRequest.user.name}</h4>
                  <p className="text-xs text-secondary">{selectedRequest.user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-soft">
                  <p className="text-xs text-secondary font-medium mb-1">Requested Item</p>
                  <p className="font-bold text-primary">{selectedRequest.giftCard}</p>
                </div>
                <div className="p-4 rounded-xl border border-soft">
                  <p className="text-xs text-secondary font-medium mb-1">Points Cost</p>
                  <p className="font-bold text-brand-600">{selectedRequest.points.toLocaleString()} pts</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-soft">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                <Button
                  variant="outline"
                  className="bg-red-50 text-red-600 hover:bg-danger-50 border-red-200"
                  onClick={() => {
                    updateRequestStatus(selectedRequest.id, 'Rejected');
                    toast.error('Request rejected.');
                    setSelectedRequest(null);
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                  onClick={() => {
                    updateRequestStatus(selectedRequest.id, 'Approved');
                    toast.success('Request approved successfully!');
                    setSelectedRequest(null);
                  }}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </PageContainer>
  );
}

