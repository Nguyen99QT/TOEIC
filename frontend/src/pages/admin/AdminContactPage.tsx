import React, { useState, useEffect } from 'react';
import { contactService, ContactDto } from '../../services/contact';
import ContactList from '../../components/contact/ContactList';
import { toast } from 'react-hot-toast';

const AdminContactPage: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await contactService.getContactStatistics();
      setStatistics(stats);
    } catch (error) {
      toast.error('Không thể tải thống kê contact');
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: number; color: string; icon: string }> = ({ title, value, color, icon }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-full bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
      </div>
    </div>
  );

  const TabButton: React.FC<{ id: string; label: string; count?: number }> = ({ id, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label} {count !== undefined && <span className="ml-1 text-sm">({count})</span>}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Management</h1>
        <p className="text-gray-600">
          View and manage all contacts from users
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={statistics.totalActive || 0}
            color="blue"
            icon="📧"
          />
          <StatCard
            title="Đang chờ xử lý"
            value={statistics.pending || 0}
            color="yellow"
            icon="⏳"
          />
          <StatCard
            title="Đang xử lý"
            value={statistics.inProgress || 0}
            color="orange"
            icon="🔄"
          />
          <StatCard
            title="Đã giải quyết"
            value={statistics.resolved || 0}
            color="green"
            icon="✅"
          />
        </div>
      )}

      {/* Priority Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Urgent Contacts"
            value={statistics.urgent || 0}
            color="red"
            icon="🚨"
          />
          <StatCard
            title="Cần phản hồi"
            value={statistics.needingResponse || 0}
            color="purple"
            icon="💬"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton
            id="all"
            label="Tất cả"
            count={statistics?.totalActive}
          />
          <TabButton
            id="pending"
            label="Đang chờ"
            count={statistics?.pending}
          />
          <TabButton
            id="urgent"
            label="Khẩn cấp"
            count={statistics?.urgent}
          />
          <TabButton
            id="needing-response"
            label="Cần phản hồi"
            count={statistics?.needingResponse}
          />
        </div>

        {/* Contact List */}
        <ContactList isAdmin={true} key={activeTab} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hành động nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('urgent')}
            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="text-red-600 text-2xl mb-2">🚨</div>
            <h3 className="font-semibold text-red-800">Xử lý khẩn cấp</h3>
            <p className="text-sm text-red-600">View high priority contacts</p>
          </button>

          <button
            onClick={() => setActiveTab('needing-response')}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="text-purple-600 text-2xl mb-2">💬</div>
            <h3 className="font-semibold text-purple-800">Cần phản hồi</h3>
            <p className="text-sm text-purple-600">View contacts needing response</p>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-gray-600 text-2xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-800">Làm mới</h3>
            <p className="text-sm text-gray-600">Cập nhật dữ liệu mới nhất</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminContactPage; 