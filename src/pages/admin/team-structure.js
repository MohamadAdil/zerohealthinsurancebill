import React, { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import withAuth from '../../components/auth/withAuth';
import { OrgChart } from 'd3-org-chart';
import { getImageUrl } from '@/utils/helpers';
import {
  FiMaximize,
  FiMinimize,
  FiZoomIn,
  FiZoomOut,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiSearch
} from 'react-icons/fi';
import { api } from '@/lib/api';
import { useUI } from '@/context/UIContext';

function TeamStructure() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useUI();

  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/get-team');
      if (response?.data) {
        const transformedData = response.data.map(member => ({
          id: member.id.toString(),
          affiliate_code: member.affiliate_code,
          name: member.name,
          position: member.position,
          image: member.image
            ? getImageUrl(`uploads/picture/${member.image}`)
            : `https://placehold.co/40x40/d1d5db/000000?text=${member.name.charAt(0)}`,
          parentId: member.parentId ? member.parentId.toString() : null
        }));
        setData(transformedData);
      } else {
        throw new Error('Failed to fetch team data');
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || error?.message || 'An error occurred while fetching team data',
        'error'
      );
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  useEffect(() => {
    if (chartRef.current && data) {
      if (!chartInstance.current) {
        chartInstance.current = new OrgChart()
          .container(chartRef.current)
          .data(data)
          .nodeHeight(() => 110)
          .nodeWidth(() => 220)
          .childrenMargin(() => 50)
          .compactMarginBetween(() => 35)
          .compactMarginPair(() => 30)
          .neighbourMargin(() => 20)
          .buttonContent(({ node }) => {
            return `
              <div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#716E7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  ${node.children ? '<polyline points="18 15 12 9 6 15"></polyline>' : '<polyline points="6 9 12 15 18 9"></polyline>'}
                </svg>
              </div>
            `;
          })
          .nodeContent(function (d) {
            const color = '#FFFFFF';
            const imageDiffVert = 25;
            return `
              <div style='width:${d.width}px;height:${d.height}px;padding-top:${imageDiffVert - 2}px;padding-left:1px;padding-right:1px'>
                <div style="font-family: 'Inter', sans-serif;background-color:${color};margin-left:-1px;width:${d.width - 2}px;height:${d.height - imageDiffVert}px;border-radius:10px;border: 1px solid #E4E2E9">
                  <div style="display:flex;justify-content:flex-end;margin-top:5px;margin-right:8px">#${d.data.affiliate_code}</div>
                  <div style="background-color:${color};margin-top:${-imageDiffVert - 20}px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;overflow:hidden;">
                    <img 
                      src="${d.data.image}" 
                      alt="${d.data.name}" 
                      width="40" 
                      height="40"
                      style="margin-left:5px;border-radius:100px;object-fit:cover;" 
                      onerror="this.src='https://placehold.co/40x40/d1d5db/000000?text=NA'" 
                    />
                  </div>
                  <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:10px">${d.data.name}</div>
                  <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;">${d.data.position}</div>
                </div>
              </div>
            `;
          })
          .onNodeClick((d) => {
            if (d.children && d.children.length > 0) {
              d._expanded = !d._expanded;
              chartInstance.current.data(data).render();
            }
          })
          .render();
      } else {
        chartInstance.current.data(data).render();
      }
    }
  }, [data]);

  const filterChart = useCallback(() => {
    if (!chartInstance.current || !data) return;
    chartInstance.current.clearHighlighting();
    data.forEach(d => (d._expanded = false));
    data.forEach(d => {
      if (searchValue !== '' && d.name.toLowerCase().includes(searchValue.toLowerCase())) {
        d._highlighted = true;
        d._expanded = true;
      }
    });
    chartInstance.current.data(data).render().fit();
  }, [searchValue, data]);

  useEffect(() => {
    filterChart();
  }, [searchValue, filterChart]);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Action handlers
  const handleFitScreen = () => chartInstance.current?.fit();
  const handleHighlightNode = () => searchValue && filterChart();
  const handleZoomIn = () => chartInstance.current?.zoomIn();
  const handleZoomOut = () => chartInstance.current?.zoomOut();
  const toggleFullscreen = () => {
    if (!isFullscreen) chartRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  const expandAll = () => {
    if (chartInstance.current && data) {
      data.forEach(d => (d._expanded = true));
      chartInstance.current.data(data).render();
    }
  };
  const collapseAll = () => {
    if (chartInstance.current && data) {
      data.forEach(d => (d._expanded = false));
      chartInstance.current.data(data).render();
    }
  };
  const resetChart = () => {
    if (chartInstance.current) {
      setSearchValue('');
      chartInstance.current.clearHighlighting().fit();
    }
  };

  return (
    <>
      <Head>
        <title>Team Structure | Admin Panel</title>
        <meta name="description" content="View and manage the organization's team structure." />
      </Head>

      <div className="bg-white p-2 md:p-8 rounded-xl shadow-lg">
        {/* Action Toolbar */}
        <div className="action-toolbar mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search by name"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button
              onClick={handleHighlightNode}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
              title="Highlight Node"
            >
              <FiFilter size={18} />
              <span className="hidden sm:inline">Highlight</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleFitScreen} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1" title="Fit Screen">
              <FiMinimize size={18} />
              <span className="hidden sm:inline">Fit</span>
            </button>
            <button onClick={handleZoomIn} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1" title="Zoom In">
              <FiZoomIn size={18} />
              <span className="hidden sm:inline">Zoom In</span>
            </button>
            <button onClick={handleZoomOut} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1" title="Zoom Out">
              <FiZoomOut size={18} />
              <span className="hidden sm:inline">Zoom Out</span>
            </button>
            <button onClick={toggleFullscreen} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
              <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
            </button>
            <button onClick={expandAll} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1" title="Expand All">
              <FiChevronDown size={18} />
              <span className="hidden sm:inline">Expand</span>
            </button>
            <button onClick={collapseAll} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1" title="Collapse All">
              <FiChevronUp size={18} />
              <span className="hidden sm:inline">Collapse</span>
            </button>
            <button onClick={resetChart} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1" title="Reset">
              <FiX size={18} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* D3 Chart container */}
        <div
          ref={chartRef}
          className="chart-container border rounded-lg"
          style={{
            height: 'calc(100vh - 250px)',
            width: '100%',
            minHeight: '600px',
            overflow: 'hidden'
          }}
        >
          {loading && (
            <div className="flex justify-center items-center h-full text-gray-500">
              <span className="animate-pulse">Loading team data...</span>
            </div>
          )}
          {!loading && !data && (
            <div className="flex justify-center items-center h-full text-gray-500">
              <span>No team data available</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default withAuth(TeamStructure);
