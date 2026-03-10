// components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { forestCabinTheme as theme } from '../styles/forestCabinTheme';
import { userTracking } from '../services/userTracking';
import { Download, Users, Activity, Calendar, TrendingUp } from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allData = userTracking.getAllTrackingData();
    setEvents(allData);
    setStats(userTracking.getUserStats());
  };

  const handleDownload = () => {
    userTracking.downloadCSV();
  };

  const getFilteredEvents = () => {
    if (timeRange === 'all') return events;
    
    const now = new Date();
    const cutoff = new Date();
    
    if (timeRange === 'today') {
      cutoff.setHours(0, 0, 0, 0);
    } else if (timeRange === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    }
    
    return events.filter(event => new Date(event.timestamp) >= cutoff);
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: theme.colors.background.paper,
        borderRadius: theme.borderRadius['2xl'],
        padding: theme.spacing.xl,
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <h1 style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.xl }}>
        📊 Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        <div style={statCardStyle}>
          <Users size={24} color={theme.colors.secondary.main} />
          <div style={{ fontSize: theme.typography.h2, fontWeight: 700 }}>
            {stats.uniqueUsers}
          </div>
          <div style={{ color: theme.colors.text.secondary }}>Unique Users</div>
        </div>

        <div style={statCardStyle}>
          <Activity size={24} color={theme.colors.primary.main} />
          <div style={{ fontSize: theme.typography.h2, fontWeight: 700 }}>
            {stats.totalActivities}
          </div>
          <div style={{ color: theme.colors.text.secondary }}>Activities Completed</div>
        </div>

        <div style={statCardStyle}>
          <Calendar size={24} color={theme.colors.accent.honey} />
          <div style={{ fontSize: theme.typography.h2, fontWeight: 700 }}>
            {stats.totalSessions}
          </div>
          <div style={{ color: theme.colors.text.secondary }}>Total Sessions</div>
        </div>

        <div style={statCardStyle}>
          <TrendingUp size={24} color={theme.colors.accent.lavender} />
          <div style={{ fontSize: theme.typography.h2, fontWeight: 700 }}>
            {stats.totalSignups}
          </div>
          <div style={{ color: theme.colors.text.secondary }}>Sign-ups</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg
      }}>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          {['all', 'today', 'week', 'month'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
                background: timeRange === range ? theme.colors.primary.main : 'transparent',
                border: `1px solid ${theme.colors.neutral[400]}`,
                borderRadius: theme.borderRadius.full,
                color: timeRange === range ? '#FFFFFF' : theme.colors.text.primary,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {range}
            </button>
          ))}
        </div>

        <button
          onClick={handleDownload}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            background: theme.colors.secondary.main,
            border: 'none',
            borderRadius: theme.borderRadius.full,
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}
        >
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* Events Table */}
      <div style={{
        background: theme.colors.background.warm,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        overflowX: 'auto'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.colors.neutral[400]}` }}>
              <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>Time</th>
              <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>User</th>
              <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>Action</th>
              <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredEvents().reverse().map((event, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${theme.colors.neutral[300]}` }}>
                <td style={{ padding: theme.spacing.sm }}>
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: theme.spacing.sm }}>
                  {event.name || event.userId?.substring(0, 8)}...
                </td>
                <td style={{ padding: theme.spacing.sm }}>
                  {event.action || (event.activityName ? 'activity' : 'event')}
                </td>
                <td style={{ padding: theme.spacing.sm }}>
                  {event.activityName || event.personality || JSON.stringify(event.details)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Last Updated */}
      <div style={{
        marginTop: theme.spacing.lg,
        textAlign: 'right',
        color: theme.colors.text.muted,
        fontSize: theme.typography.tiny
      }}>
        Last updated: {new Date(stats.lastUpdated).toLocaleString()}
      </div>
    </motion.div>
  );
}

const statCardStyle = {
  background: theme.colors.background.warm,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  textAlign: 'center',
  border: `1px solid ${theme.colors.neutral[400]}`
};

export default AdminDashboard;