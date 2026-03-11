// components/AdminCSVExport.js - NEW FILE
import React from 'react';

function AdminCSVExport({ data }) {
  const { stats, reflections, goals } = data;

  const generateCSV = () => {
    // Create CSV content
    let csv = 'Admin Dashboard Export\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // Stats
    csv += 'STATISTICS\n';
    csv += `Unique Users,${stats?.uniqueUsers || 0}\n`;
    csv += `Total Activities,${stats?.activitiesCompleted || 0}\n`;
    csv += `Total Sessions,${stats?.totalSessions || 0}\n`;
    csv += `Signups (This Week),${stats?.signups || 0}\n`;
    csv += `Active Today,${stats?.activeToday || 0}\n`;
    csv += `Activities Today,${stats?.activitiesToday || 0}\n\n`;
    
    // Reflections
    csv += 'RECENT REFLECTIONS\n';
    csv += 'Question,Answer,Date,User ID\n';
    reflections.forEach(r => {
      csv += `"${r.question}","${r.answer}",${r.date},${r.user_id}\n`;
    });
    csv += '\n';
    
    // Goals
    csv += 'LEARNING GOALS\n';
    csv += 'Goal,Completed\n';
    goals.forEach(g => {
      csv += `"${g.text}",${g.completed}\n`;
    });
    
    return csv;
  };

  const downloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button onClick={downloadCSV} className="export-btn">
      📥 Export CSV
    </button>
  );
}

export default AdminCSVExport;