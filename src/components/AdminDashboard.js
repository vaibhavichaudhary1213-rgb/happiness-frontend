import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Your configured axios instance

function AdminDashboard() {
  const [stats, setStats] = useState({
    uniqueUsers: 0,
    activitiesCompleted: 0,
    totalSessions: 0,
    signups: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Get all unique users from different endpoints
      const [
        moodData,
        wellnessData,
        growthData,
        healthData
      ] = await Promise.allSettled([
        API.get('/analytics/').catch(() => ({ value: { data: [] } })),
        API.get('/wellness/happiness/weekly/all').catch(() => ({ value: { data: [] } })),
        API.get('/growth/joy/triggers/all').catch(() => ({ value: { data: [] } })),
        API.get('/health').catch(() => ({ value: { data: {} } }))
      ]);

      // Collect all unique user IDs
      const userSet = new Set();

      // Add users from mood analytics
      if (moodData.status === 'fulfilled' && moodData.value.data) {
        moodData.value.data.forEach(entry => {
          if (entry.user_id) userSet.add(entry.user_id);
        });
      }

      // Add users from wellness data
      if (wellnessData.status === 'fulfilled' && wellnessData.value.data) {
        wellnessData.value.data.forEach(entry => {
          if (entry.user_id) userSet.add(entry.user_id);
        });
      }

      // Add users from growth data
      if (growthData.status === 'fulfilled' && growthData.value.data) {
        growthData.value.data.forEach(entry => {
          if (entry.user_id) userSet.add(entry.user_id);
        });
      }

      // Calculate activities count (mood entries + habit tracks + growth responses)
      const activitiesCount = await calculateActivitiesCount();

      // Get total sessions (from localStorage + API)
      const sessionsCount = await getTotalSessions();

      setStats({
        uniqueUsers: userSet.size,
        activitiesCompleted: activitiesCount,
        totalSessions: sessionsCount,
        signups: userSet.size, // Same as unique users for now
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load statistics'
      }));
    }
  };

  const calculateActivitiesCount = async () => {
    try {
      // Count various activities
      const [
        moodEntries,
        habitTracks,
        joyResponses,
        gratitudeEntries
      ] = await Promise.allSettled([
        API.get('/analytics/').catch(() => ({ value: { data: [] } })),
        API.get('/wellness/habits/streak/all').catch(() => ({ value: { data: [] } })),
        API.get('/growth/joy/answers/all').catch(() => ({ value: { data: [] } })),
        API.get('/growth/gratitude/recent/all').catch(() => ({ value: { data: [] } }))
      ]);

      let total = 0;

      if (moodEntries.status === 'fulfilled' && moodEntries.value.data) {
        total += moodEntries.value.data.length;
      }
      if (habitTracks.status === 'fulfilled' && habitTracks.value.data) {
        total += habitTracks.value.data.length;
      }
      if (joyResponses.status === 'fulfilled' && joyResponses.value.data) {
        total += joyResponses.value.data.length;
      }
      if (gratitudeEntries.status === 'fulfilled' && gratitudeEntries.value.data) {
        total += gratitudeEntries.value.data.length;
      }

      return total;
    } catch (error) {
      console.error('Error calculating activities:', error);
      return 0;
    }
  };

  const getTotalSessions = async () => {
    // Get sessions from localStorage (client-side tracking)
    const localSessions = parseInt(localStorage.getItem('totalSessions') || '0');
    
    // Try to get from analytics health endpoint
    try {
      const response = await API.get('/analytics/health');
      const apiSessions = response.data?.totalSessions || 0;
      return Math.max(localSessions, apiSessions);
    } catch {
      return localSessions;
    }
  };

  // Track new session on component mount
  useEffect(() => {
    const trackSession = () => {
      const sessions = parseInt(localStorage.getItem('totalSessions') || '0') + 1;
      localStorage.setItem('totalSessions', sessions.toString());
    };
    trackSession();
  }, []);

  if (stats.loading) {
    return (
      <div style={{
        padding: '2rem',
        color: '#8B5CF6',
        textAlign: 'center'
      }}>
        Loading dashboard...
      </div>
    );
  }

  if (stats.error) {
    return (
      <div style={{
        padding: '2rem',
        color: '#EF4444',
        textAlign: 'center'
      }}>
        {stats.error}
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{
      padding: '2rem',
      backgroundColor: '#1A1F2A',
      borderRadius: '16px',
      margin: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        color: '#8B5CF6',
        fontSize: '1.8rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #8B5CF6',
        paddingBottom: '0.5rem'
      }}>
        Admin Dashboard
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Unique Users Card */}
        <div style={cardStyle}>
          <div style={{ ...iconStyle, backgroundColor: '#8B5CF620' }}>
            👥
          </div>
          <div style={valueStyle}>{stats.uniqueUsers}</div>
          <div style={labelStyle}>Unique Users</div>
        </div>

        {/* Activities Card */}
        <div style={cardStyle}>
          <div style={{ ...iconStyle, backgroundColor: '#10B98120' }}>
            📊
          </div>
          <div style={valueStyle}>{stats.activitiesCompleted}</div>
          <div style={labelStyle}>Activities Completed</div>
        </div>

        {/* Total Sessions Card */}
        <div style={cardStyle}>
          <div style={{ ...iconStyle, backgroundColor: '#F59E0B20' }}>
            🔄
          </div>
          <div style={valueStyle}>{stats.totalSessions}</div>
          <div style={labelStyle}>Total Sessions</div>
        </div>

        {/* Sign-ups Card */}
        <div style={cardStyle}>
          <div style={{ ...iconStyle, backgroundColor: '#EC489920' }}>
            📝
          </div>
          <div style={valueStyle}>{stats.signups}</div>
          <div style={labelStyle}>Sign-ups</div>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchAdminStats}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#8B5CF6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginLeft: 'auto'
        }}
      >
        <span>🔄</span> Refresh Data
      </button>
    </div>
  );
}

// Styles
const cardStyle = {
  backgroundColor: '#2A2F3A',
  borderRadius: '12px',
  padding: '1.5rem',
  textAlign: 'center',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  ':hover': {
    transform: 'translateY(-4px)'
  }
};

const iconStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1rem',
  fontSize: '24px'
};

const valueStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#8B5CF6',
  marginBottom: '0.5rem'
};

const labelStyle = {
  fontSize: '0.9rem',
  color: '#A0A8B8',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

export default AdminDashboard;