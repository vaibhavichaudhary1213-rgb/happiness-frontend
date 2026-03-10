// services/userTracking.js

// User tracking service
class UserTracking {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.storageKey = 'ivyInsightTracking';
    this.sessionId = this.generateSessionId();
  }

  // Generate a unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track user sign-up/onboarding
  async trackUserSignup(userData) {
    const trackingData = {
      sessionId: this.sessionId,
      userId: userData.userId || this.generateUserId(),
      name: userData.name,
      age: userData.age,
      personality: userData.personality?.name || 'Not selected',
      timestamp: new Date().toISOString(),
      action: 'signup',
      source: window.location.href
    };

    // Save to localStorage for backup
    this.saveToLocalStorage(trackingData);
    
    // Send to server (if you have one)
    await this.sendToServer(trackingData);
    
    return trackingData;
  }

  // Track app session
  async trackSession(action, details = {}) {
    const trackingData = {
      sessionId: this.sessionId,
      userId: this.getUserId(),
      action: action,
      details: details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.saveToLocalStorage(trackingData);
    await this.sendToServer(trackingData);
    
    return trackingData;
  }

  // Track activity completion
  async trackActivity(userId, activityName, duration, completed) {
    const trackingData = {
      userId: userId,
      activityName: activityName,
      duration: duration,
      completed: completed,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.saveToLocalStorage(trackingData);
    await this.sendToServer(trackingData);
    
    return trackingData;
  }

  // Generate unique user ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create user ID
  getUserId() {
    let userId = localStorage.getItem('ivyInsightUserId');
    if (!userId) {
      userId = this.generateUserId();
      localStorage.setItem('ivyInsightUserId', userId);
    }
    return userId;
  }

  // Save to localStorage
  saveToLocalStorage(data) {
    try {
      const existing = localStorage.getItem(this.storageKey);
      const tracking = existing ? JSON.parse(existing) : [];
      tracking.push(data);
      localStorage.setItem(this.storageKey, JSON.stringify(tracking));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Send to server (implement based on your backend)
  async sendToServer(data) {
    try {
      // If you have a backend, uncomment this:
      /*
      const response = await fetch(`${this.apiUrl}/api/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
      */
      
      // For now, just log to console
      console.log('📊 Tracking data:', data);
    } catch (error) {
      console.error('Error sending tracking data:', error);
    }
  }

  // Get all tracking data (for admin purposes)
  getAllTrackingData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Get user statistics
  getUserStats() {
    const data = this.getAllTrackingData();
    
    // Count unique users
    const uniqueUsers = new Set(data.map(item => item.userId)).size;
    
    // Count signups
    const signups = data.filter(item => item.action === 'signup').length;
    
    // Count activities
    const activities = data.filter(item => item.activityName).length;
    
    // Count sessions
    const sessions = new Set(data.map(item => item.sessionId)).size;
    
    return {
      totalEvents: data.length,
      uniqueUsers,
      totalSignups: signups,
      totalActivities: activities,
      totalSessions: sessions,
      lastUpdated: new Date().toISOString()
    };
  }

  // Export data as CSV
  exportAsCSV() {
    const data = this.getAllTrackingData();
    if (data.length === 0) return null;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(value => 
      typeof value === 'string' ? `"${value}"` : value
    ).join(','));
    
    return [headers, ...rows].join('\n');
  }

  // Download CSV
  downloadCSV() {
    const csv = this.exportAsCSV();
    if (!csv) return;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ivy-insight-tracking-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Create singleton instance
export const userTracking = new UserTracking();