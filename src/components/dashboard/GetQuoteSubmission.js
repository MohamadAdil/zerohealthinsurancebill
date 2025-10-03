'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import { FiEye, FiTrash2, FiSearch } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { api } from '@/lib/api';
import { useUI } from '@/context/UIContext';

export default function GetQuoteSubmission() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const { openModal, showToast } = useUI();
  
  const fetchQuotes = useCallback(async (page, size) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/get-quote?page=${page}&limit=${size}`);
      console.log("get quote::", response);
      if (response.response === "success" && response.data) {
        setData(response.data || []);
        setFilteredData(response.data || []);
        setTotalRows(response.data.totalRecords || 0);
      } else {
        setError(response.error || 'Failed to fetch quote submissions.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes(currentPage, perPage);
  }, [currentPage, perPage, fetchQuotes]);

  useEffect(() => {
    let filtered = [...data];
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchText.toLowerCase()) || 
        item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phone?.toLowerCase().includes(searchText.toLowerCase())
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

  const handleViewDetails = useCallback((quote) => {
    setSelectedQuote(quote);
    openModal(
      <div className="modal-box max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quote Submission Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-800">{`${quote.first_name} ${quote.last_name}` || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-800">{quote.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800">{quote.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Parent ID</p>
            <p className="text-gray-800">{quote.parent?._id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="text-gray-800">
              {quote.createdAt ? new Date(quote.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Message</p>
            <p className="text-gray-800">{quote.message || 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  }, [openModal]);

  const handleDelete = useCallback(async (id) => {
    if (confirm('Are you sure you want to delete this quote submission?')) {
      try {
        const response = await api.post(`/admin/delete-quote/${id}`);
        if (response.response === "success") {
          showToast('Quote submission deleted successfully', 'success');
          fetchQuotes(currentPage, perPage);
        } else {
          throw new Error(response.error || 'Failed to delete submission.');
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  }, [currentPage, fetchQuotes, perPage, showToast]);

  const updateLocalQuoteField = useCallback((id, field, value) => {
    setData(prev => prev.map(item => item._id === id ? { ...item, [field]: value } : item));
    setFilteredData(prev => prev.map(item => item._id === id ? { ...item, [field]: value } : item));
  }, []);

  const handleToggleField = useCallback(async (row, field) => {
    const id = row._id;
    const currentValue = Number(row?.[field] || 0);
    const nextValue = currentValue === 1 ? 0 : 1;

    // Optimistic update
    updateLocalQuoteField(id, field, nextValue);
    console.log("field::", field);
    const statusPath = field === 'submitted_quote_form' ? 'update-quote-form' : 'update-insurance-purchased';
    try {
      const response = await api.post(`/admin/${statusPath}/${id}`, { [field]: nextValue });
      if (response?.response !== 'success') {
        throw new Error(response?.error || 'Failed to update');
      }
      showToast('Updated successfully', 'success');
    } catch (err) {
      // Revert on failure
      updateLocalQuoteField(id, field, currentValue);
      showToast(err.message || 'Failed to update', 'error');
    }
  }, [showToast, updateLocalQuoteField]);

  const columns = useMemo(() => [
    {
      name: 'Name',
      selector: row => `${row.first_name} ${row.last_name}` || 'N/A',
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
      name: 'Parent ID',
      selector: row => row.parent?.affiliate_code || 'N/A',
      sortable: true,
    },
    {
      name: 'Monthly Quote',
      selector: row => row?.monthly_insurance_emi || 'N/A',
      sortable: true,
    },
    {
      name: 'Submitted quote Form',
      cell: row => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={Number(row?.submitted_quote_form || 0) === 1}
            onChange={() => handleToggleField(row, 'submitted_quote_form')}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
          <span className="ml-2 text-sm text-gray-700">{Number(row?.submitted_quote_form || 0) === 1 ? 'Yes' : 'No'}</span>
        </label>
      ),
      sortable: false,
    },
    {
      name: 'Insurance Purchased',
      cell: row => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={Number(row?.insurance_purchased || 0) === 1}
            onChange={() => handleToggleField(row, 'insurance_purchased')}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
          <span className="ml-2 text-sm text-gray-700">{Number(row?.insurance_purchased || 0) === 1 ? 'Yes' : 'No'}</span>
        </label>
      ),
      sortable: false,
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
  ], [handleDelete, handleViewDetails, handleToggleField]);

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
          <h2 className="text-2xl font-semibold text-gray-800">Quote Submissions</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or phone"
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