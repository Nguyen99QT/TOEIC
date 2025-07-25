import React, { useState, useEffect } from 'react';
import { contactService, ContactDto, PaginatedResponse } from '../../services/contact';
import { contactUtils } from '../../services/contact';
import { toast } from 'react-hot-toast';
import ContactResponseModal from './ContactResponseModal';

interface ContactListProps {
  isAdmin?: boolean;
  showUserContacts?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({ isAdmin = false, showUserContacts = false }) => {
  const [contacts, setContacts] = useState<ContactDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [selectedContact, setSelectedContact] = useState<ContactDto | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Filter states for admin
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadContacts();
  }, [currentPage, statusFilter, priorityFilter, typeFilter, searchTerm]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      let response: PaginatedResponse<ContactDto>;

      if (isAdmin) {
        if (searchTerm) {
          response = await contactService.searchContacts(searchTerm, currentPage, pageSize);
        } else if (statusFilter || priorityFilter || typeFilter) {
          response = await contactService.filterContacts(statusFilter, priorityFilter, typeFilter, currentPage, pageSize);
        } else {
          response = await contactService.getAllContacts(currentPage, pageSize);
        }
      } else {
        response = await contactService.getMyContacts(currentPage, pageSize);
      }

      setContacts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error('Không thể tải danh sách contact');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (contactId: number, newStatus: string) => {
    try {
      const response = await contactService.updateContactStatus(contactId, newStatus);
      if (response.success) {
        toast.success('Cập nhật trạng thái thành công');
        loadContacts();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (contactId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa contact này?')) {
      return;
    }

    try {
      const response = await contactService.deleteContact(contactId);
      if (response.success) {
        toast.success('Xóa contact thành công');
        loadContacts();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
              toast.error('Không thể xóa contact');
    }
  };

  const handleRespond = (contact: ContactDto) => {
    setSelectedContact(contact);
    setShowResponseModal(true);
  };

  const handleResponseSuccess = () => {
    setShowResponseModal(false);
    setSelectedContact(null);
    loadContacts();
  };

  const getStatusBadge = (status: string) => {
    const color = contactUtils.getStatusColor(status);
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}>
        {contactUtils.formatStatus(status)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const color = contactUtils.getPriorityColor(priority);
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}>
        {contactUtils.formatPriority(priority)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters for Admin */}
      {isAdmin && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Filter Contacts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Đang chờ</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="CLOSED">Đã đóng</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả mức độ</option>
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
                <option value="URGENT">Khẩn cấp</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả loại</option>
                <option value="GENERAL">Chung</option>
                <option value="BUG_REPORT">Báo cáo lỗi</option>
                <option value="FEATURE_REQUEST">Yêu cầu tính năng</option>
                <option value="TECHNICAL_ISSUE">Vấn đề kỹ thuật</option>
                <option value="ACCOUNT_ISSUE">Vấn đề tài khoản</option>
                <option value="PAYMENT_ISSUE">Vấn đề thanh toán</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contact List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No contacts found
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {contact.subject}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>Từ: {contact.isAnonymous ? 'Ẩn danh' : contact.userName}</span>
                    <span>•</span>
                    <span>{new Date(contact.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span>•</span>
                    <span>{contactUtils.formatContactType(contact.contactType)}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {contact.content}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(contact.status)}
                  {getPriorityBadge(contact.priority)}
                </div>
              </div>

              {/* Admin Response */}
              {contact.adminResponse && (
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Phản hồi từ admin</span>
                    {contact.respondedAt && (
                      <span className="text-xs text-blue-600">
                        {new Date(contact.respondedAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                  <p className="text-blue-700">{contact.adminResponse}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {isAdmin && (
                    <>
                      {contact.canRespond && (
                        <button
                          onClick={() => handleRespond(contact)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Phản hồi
                        </button>
                      )}
                      
                      {/* Status Update Buttons */}
                      {contact.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleStatusUpdate(contact.id, 'RESOLVED')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Đánh dấu đã giải quyết
                        </button>
                      )}
                      
                      {contact.status !== 'CLOSED' && (
                        <button
                          onClick={() => handleStatusUpdate(contact.id, 'CLOSED')}
                          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                          Đóng
                        </button>
                      )}
                    </>
                  )}

                  {/* User Actions */}
                  {!isAdmin && contact.canEdit && (
                    <button
                      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  )}

                  {!isAdmin && contact.canDelete && (
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Contact Info */}
                {!contact.isAnonymous && (contact.contactEmail || contact.contactPhone) && (
                  <div className="text-xs text-gray-500">
                    {contact.contactEmail && <div>Email: {contact.contactEmail}</div>}
                    {contact.contactPhone && <div>SĐT: {contact.contactPhone}</div>}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Trước
          </button>
          
          <span className="text-sm text-gray-600">
            Trang {currentPage + 1} / {totalPages} (Tổng: {totalElements})
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Sau
          </button>
        </div>
      )}

      {/* Response Modal */}
      {selectedContact && (
        <ContactResponseModal
          contact={selectedContact}
          isOpen={showResponseModal}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedContact(null);
          }}
          onSuccess={handleResponseSuccess}
        />
      )}
    </div>
  );
};

export default ContactList; 