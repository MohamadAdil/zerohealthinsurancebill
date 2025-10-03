'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import DataTable from 'react-data-table-component';
import {
  FiArrowLeft,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiStar
} from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { api } from '../../lib/api';
import { useUI } from '@/context/UIContext';

export default function MemberDetail({ memberId }) {
  const [memberData, setMemberData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [promotedAgentIds, setPromotedAgentIds] = useState(new Set());
  const [showRotationOnly, setShowRotationOnly] = useState(false);
  const { showToast } = useUI();
  const router = useRouter();

  const getParentMemberId = useCallback((parentId) => {
    if (!parentId) return 'N/A';
    const parentRow = teamMembers.find(item => item._id === parentId);
    return parentRow?.affiliate_code || parentId;
  }, [teamMembers]);

  const getMembershipStatus = useCallback((earnings) => {
    const totalEarnings = parseFloat(earnings) || 0;
    if (totalEarnings >= 9) return { tier: 'Excellent', color: 'from-gray-700 to-gray-900', icon: '🥇' };
    if (totalEarnings >= 7) return { tier: 'Good', color: 'from-yellow-500 to-yellow-600', icon: '🥇' };
    if (totalEarnings >= 5) return { tier: 'Average', color: 'from-gray-400 to-gray-600', icon: '🥈' };
    if (totalEarnings >= 2) return { tier: 'Bronze', color: 'from-orange-500 to-orange-600', icon: '🥉' };
    return { tier: 'Lower', color: 'from-blue-500 to-blue-600', icon: '⭐' };
  }, []);

  const getRatingBadgeColor = useCallback((rating) => {
    if (!rating && rating !== 0) return 'gray';
    const numRating = Number(rating);
    if (numRating < 3) return 'red';
    if (numRating >= 3 && numRating <= 5) return 'yellow';
    if (numRating > 5 && numRating <= 7) return 'blue';
    if (numRating > 7) return 'green';
    return 'gray';
  }, []);

  const getRatingBadgeClasses = useCallback((rating) => {
    const color = getRatingBadgeColor(rating);
    switch (color) {
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, [getRatingBadgeColor]);

  const fetchMemberData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/get-agent-detail/${memberId}`);
      if (response.response === 'success' && response.data) {
        setMemberData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch member data.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  const fetchTeamMembers = useCallback(async (page = 1, size = 10) => {
    setTeamLoading(true);
    try {
      const response = await api.get(`/get-child/agent/${memberId}/?page=${page}&limit=${size}`);
      if (response.response === 'success' && response.data) {
        setTeamMembers(response.data || []);
        setFilteredTeamMembers(response.data || []);
        setTotalRows(response.data.totalRecords || 0);
      } else {
        setTeamMembers([]);
        setFilteredTeamMembers([]);
      }
    } catch (err) {
      console.error('Failed to fetch team members:', err);
      setTeamMembers([]);
      setFilteredTeamMembers([]);
    } finally {
      setTeamLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    if (memberId) {
      fetchMemberData();
      fetchTeamMembers(currentPage, perPage);
    }
  }, [memberId, fetchMemberData, fetchTeamMembers, currentPage, perPage]);

  useEffect(() => {
    const fetchPromotedAgents = async () => {
      try {
        const res = await api.get('/admin/get-promote-agent');
        if (res?.response === 'success' && Array.isArray(res?.data?.agent)) {
          setPromotedAgentIds(new Set(res.data.agent));
        }
      } catch (e) { }
    };
    fetchPromotedAgents();
  }, []);

  useEffect(() => {
    let base = teamMembers;
    if (showRotationOnly) base = base.filter(member => promotedAgentIds.has(member._id));
    if (searchText) {
      const term = searchText.toLowerCase();
      base = base.filter(member =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        (member.affiliate_code && member.affiliate_code.toLowerCase().includes(term)) ||
        (member.parent && getParentMemberId(member.parent).toLowerCase().includes(term))
      );
    }
    setFilteredTeamMembers(base);
  }, [searchText, teamMembers, showRotationOnly, promotedAgentIds, getParentMemberId]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage, page) => { setPerPage(newPerPage); setCurrentPage(page); };

  const handleEditMember = useCallback((id) => router.push(`/admin/review/${id}`), [router]);
  const handleDeleteMember = useCallback(async (id) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        const response = await api.post(`/delete-agent/${id}`);
        if (response.response === 'success') {
          showToast('Team member deleted successfully', 'success');
          fetchTeamMembers(currentPage, perPage);
        } else throw new Error(response.error || 'Failed to delete team member.');
      } catch (err) { showToast(err.message, 'error'); }
    }
  }, [showToast, fetchTeamMembers, currentPage, perPage]);

  const handleRowClick = (row) => router.push(`/admin/member-detail/${row._id}`);

  const teamColumns = useMemo(() => [
    {
      name: 'Profile',
      cell: row => (
        <div className="flex items-center">
          <div className="relative">
            {row.profileImage ? (
              <Image
                src={row.profileImage}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
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
      ),
      width: '80px',
    },
    { name: 'Name', selector: row => `${row.first_name} ${row.last_name}`, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Member ID', selector: row => row.affiliate_code, sortable: true },
    {
      name: 'Rating',
      selector: row => row.rating || 'N/A',
      cell: row => {
        const rating = row.rating;
        const displayRating = rating || rating === 0 ? rating : 'N/A';
        if (displayRating === 'N/A') return <span className="text-gray-500">N/A</span>;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRatingBadgeClasses(rating)}`}>
            {rating} <FiStar className="ml-1" size={12} />
          </span>
        );
      },
      sortable: true,
    },
    {
      name: 'Join Date',
      selector: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A',
      sortable: true,
    },
    {
      name: 'Affiliate Link',
      selector: row => row.affiliate_link || 'N/A',
      cell: row => row.affiliate_link ? (
        <a href={row.affiliate_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          View Quote Link
        </a>
      ) : 'N/A',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button onClick={() => handleEditMember(row._id)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit" className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
            <FiEdit size={18} />
          </button>
          <button onClick={() => handleDeleteMember(row._id)} data-tooltip-id="delete-tooltip" data-tooltip-content="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ], [promotedAgentIds, getRatingBadgeClasses, handleEditMember, handleDeleteMember]);

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="flex items-center text-blue-500 mb-4">
        <FiArrowLeft size={20} className="mr-2" /> Back
      </button>

      {loading ? (
        <div>Loading member details...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : memberData ? (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{memberData.first_name} {memberData.last_name}</h2>
          <p>Email: {memberData.email}</p>
          <p>Member ID: {memberData.affiliate_code}</p>
          <p>Rating: {memberData.rating || 'N/A'}</p>
        </div>
      ) : null}

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search team members..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="border p-2 rounded"
        />
        <label>
          <input
            type="checkbox"
            checked={showRotationOnly}
            onChange={e => setShowRotationOnly(e.target.checked)}
            className="mr-2"
          /> Show Rotation Only
        </label>
      </div>

      <DataTable
        columns={teamColumns}
        data={filteredTeamMembers}
        progressPending={teamLoading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onRowClicked={handleRowClick}
        highlightOnHover
        pointerOnHover
        responsive
      />

      <Tooltip id="edit-tooltip" />
      <Tooltip id="delete-tooltip" />
    </div>
  );
}
