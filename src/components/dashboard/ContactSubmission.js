'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import { FiEye, FiTrash2, FiSearch } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { api } from '@/lib/api';
import { useUI } from '@/context/UIContext';

export default function ContactSubmission() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const { openModal, showToast } = useUI();

  const fetchContacts = useCallback(async (page, size) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/get-contact?page=${page}&limit=${size}`);
      console.log("Contact submissions data::", response);
      if (response.response === "success" && response.data) {
        setData(response.data || []);
        setFilteredData(response.data || []);
        setTotalRows(response.data.totalRecords || 0);
      } else {
        setError(response.error || 'Failed to fetch contact submissions.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(currentPage, perPage);
  }, [currentPage, perPage, fetchContacts]);

  useEffect(() => {
    let filtered = [...data];
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchText.toLowerCase()) || 
        item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (dateFilter) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
        return itemDate === dateFilter;
      });
    }
    
    setFilteredData(filtered);
  }, [searchText, dateFilter, data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // ✅ wrap in useCallback so ESLint is happy
  const handleViewDetails = useCallback((contact) => {
    setSelectedContact(contact);
    openModal(
      <div className="modal-box max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Submission Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-800">{`${contact.first_name} ${contact.last_name}` || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-800">{contact.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800">{contact.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="text-gray-800">{contact.subject || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="text-gray-800">
              {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Message</p>
            <p className="text-gray-800">{contact.message || 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  }, [openModal]);

  const handleDelete = useCallback(async (id) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      try {
        const response = await api.post(`/admin/delete-contact/${id}`);
        if (response.response === "success") {
          showToast('Contact submission deleted successfully', 'success');
          fetchContacts(currentPage, perPage);
        } else {
          throw new Error(response.error || 'Failed to delete submission.');
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  }, [currentPage, perPage, fetchContacts, showToast]);

  // ✅ include handlers in dependency array
  const columns = useMemo(() => [
    {
      name: 'Name',
      selector: row => row.full_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.phone || 'N/A',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email || 'N/A',
      sortable: true,
    },
    {
      name: 'Subject',
      selector: row => row.subject || 'N/A',
      sortable: true,
    },
    {
      name: 'Date & Time',
      selector: row => {
        if (!row.createdAt) return 'N/A';
        const date = new Date(row.createdAt);
        return date.toLocaleString();
      },
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            data-tooltip-id="view-tooltip"
            data-tooltip-content="View Details"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
          >
            <FiEye size={18} />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            data-tooltip-id="delete-tooltip"
            data-tooltip-content="Delete"
            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ], [handleViewDetails, handleDelete]); // ✅ fixed dependencies

  if (error) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-red-700 bg-red-100 rounded-md p-4">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Contact Submissions</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, phone or subject"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <DataTable
            columns={columns}
            data={filteredData}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            pointerOnHover
            responsive
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: '#f8fafc',
                  fontWeight: '600',
                  color: '#334155',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                },
              },
              rows: {
                style: {
                  '&:not(:last-of-type)': {
                    borderBottom: '1px solid #f1f5f9',
                  },
                },
              },
            }}
            className="rounded-lg"
          />
        </div>
      </div>
      <Tooltip id="view-tooltip" />
      <Tooltip id="delete-tooltip" />
    </section>
  );
}
