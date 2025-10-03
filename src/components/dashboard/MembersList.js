'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import { useRouter } from 'next/navigation'; // ✅ use next/navigation, not next/router
import { FiEdit, FiTrash2, FiStar, FiSearch, FiUsers } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { api } from '@/lib/api';
import { useUI } from '@/context/UIContext';
import Image from 'next/image';

// ✅ Wrapper component to handle Next.js Image fallback
const ProfileImageCell = ({ row, promotedAgentIds }) => {
  const [src, setSrc] = useState(row.profileImage);

  return (
    <div className="flex items-center">
      <div className="relative">
        {src ? (
          <Image
            src={src}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
            onError={() =>
              setSrc('https://placehold.co/40x40/d1d5db/000000?text=NA')
            }
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {row.first_name ? row.first_name.charAt(0).toUpperCase() : ''}
              {row.last_name ? row.last_name.charAt(0).toUpperCase() : ''}
            </span>
          </div>
        )}
        {promotedAgentIds.has(row._id) && (
          <span className="absolute -right-0 -bottom-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
    </div>
  );
};

export default function MembersList() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [promotedAgentIds, setPromotedAgentIds] = useState(new Set());
  const { showToast } = useUI();
  const router = useRouter();
  const [showRotationOnly, setShowRotationOnly] = useState(false);

  // ✅ Memoized function
  const getParentMemberId = useCallback(
    (parentId) => {
      if (!parentId) return 'N/A';
      const parentRow = data.find((item) => item._id === parentId);
      return parentRow?.affiliate_code || parentId;
    },
    [data]
  );

  // ✅ Fetch members
  const fetchMembers = useCallback(async (page, size) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/get-agent?page=${page}&limit=${size}`);
      if (response.response === 'success' && response.data) {
        setData(response.data || []);
        setFilteredData(response.data || []);
        setTotalRows(response.data.totalRecords || 0);
      } else {
        setError(response.error || 'Failed to fetch members.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers(currentPage, perPage);
  }, [currentPage, perPage, fetchMembers]);

  // ✅ Fetch promoted agents
  useEffect(() => {
    const fetchPromotedAgents = async () => {
      try {
        const res = await api.get('/admin/get-promote-agent');
        if (res?.response === 'success' && Array.isArray(res?.data?.agent)) {
          setPromotedAgentIds(new Set(res.data.agent));
        }
      } catch {
        // ignore silently
      }
    };
    fetchPromotedAgents();
  }, []);

  // ✅ Search & Rotation filter
  useEffect(() => {
    let base = data;
    if (showRotationOnly) {
      base = base.filter((item) => promotedAgentIds.has(item._id));
    }
    if (searchText) {
      const term = searchText.toLowerCase();
      base = base.filter(
        (item) =>
          `${item.first_name} ${item.last_name}`.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          (item.affiliate_code &&
            item.affiliate_code.toLowerCase().includes(term))
      );
    }
    setFilteredData(base);
  }, [searchText, data, showRotationOnly, promotedAgentIds]);

  // ✅ Action handlers
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
  const handleEditMember = useCallback(
    (id) => {
      router.push(`/admin/review/${id}`);
    },
    [router]
  );
  const handleDeleteMember = useCallback(
    async (id) => {
      if (confirm('Are you sure you want to delete this member?')) {
        try {
          const response = await api.post(`/delete-agent/${id}`);
          if (response.response === 'success') {
            showToast('Member deleted successfully', 'success');
            fetchMembers(currentPage, perPage);
          } else {
            throw new Error(response.error || 'Failed to delete member.');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    },
    [fetchMembers, currentPage, perPage, showToast]
  );

  // ✅ Rating classes
  const getRatingBadgeColor = (rating) => {
    if (!rating && rating !== 0) return 'gray';
    const numRating = Number(rating);
    if (numRating < 3) return 'red';
    if (numRating >= 3 && numRating <= 5) return 'yellow';
    if (numRating > 5 && numRating <= 7) return 'blue';
    if (numRating > 7) return 'green';
    return 'gray';
  };
  const getRatingBadgeClasses = useCallback((rating) => {
    const color = getRatingBadgeColor(rating);
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  // ✅ Columns (fixed dependencies)
  const columns = useMemo(
    () => [
      {
        name: 'Profile',
        cell: (row) => (
          <ProfileImageCell row={row} promotedAgentIds={promotedAgentIds} />
        ),
        width: '80px',
      },
      {
        name: 'Name',
        selector: (row) => `${row.first_name} ${row.last_name}`,
        sortable: true,
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: 'Member ID',
        selector: (row) => row.affiliate_code,
        sortable: true,
      },
      {
        name: 'Parent ID',
        selector: (row) => row.parent || 'N/A',
        cell: (row) => (
          <div className="flex items-center">
            {row.parent ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                <FiUsers className="mr-1" size={12} />
                {getParentMemberId(row.parent)}
              </span>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        ),
        sortable: true,
      },
      {
        name: 'Rating',
        selector: (row) => row.rating || 'N/A',
        cell: (row) => {
          const rating = row.rating;
          const displayRating = rating || rating === 0 ? rating : 'N/A';

          if (displayRating === 'N/A') {
            return <span className="text-gray-500">N/A</span>;
          }

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRatingBadgeClasses(
                rating
              )}`}
            >
              {rating}
              <FiStar className="ml-1" size={12} />
            </span>
          );
        },
        sortable: true,
      },
      {
        name: 'Quote Link',
        selector: (row) => row.affiliate_link || 'N/A',
        cell: (row) =>
          row.affiliate_link ? (
            <a
              href={row.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Quote Link
            </a>
          ) : (
            'N/A'
          ),
      },
      {
        name: 'Affiliate Link',
        selector: (row) => row.affiliate_link2 || 'N/A',
        cell: (row) =>
          row.affiliate_link2 ? (
            <a
              href={row.affiliate_link2}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Affiliate Link
            </a>
          ) : (
            'N/A'
          ),
      },
      {
        name: 'Actions',
        cell: (row) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditMember(row._id)}
              data-tooltip-id="edit-tooltip"
              data-tooltip-content="Edit"
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={() => handleDeleteMember(row._id)}
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
    ],
    [promotedAgentIds, getParentMemberId, handleEditMember, handleDeleteMember, getRatingBadgeClasses]
  );

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
          <h2 className="text-2xl font-semibold text-gray-800">Members List</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setShowRotationOnly((v) => !v)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showRotationOnly
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Rotation Agents
            </button>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or parent ID"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
            onRowClicked={(row) => router.push(`/admin/member-detail/${row._id}`)}
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
      <Tooltip id="edit-tooltip" />
      <Tooltip id="delete-tooltip" />
    </section>
  );
}
