import API from './api';

class AdminService {
  // Track user session
  trackUserSession() {
    const userId = this.getUserId();
    const sessions = this.getSessions();
    
    // Update sessions in localStorage
    localStorage.setItem('userSessions', JSON.stringify({
      ...sessions,
      [userId]: (sessions[userId] || 0) + 1
    }));
  }

  // Get or create user ID
  getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
      
      // Track new signup
      this.trackSignup(userId);
    }
    return userId;
  }

  // Track new signup
  trackSignup(userId) {
    const signups = JSON.parse(localStorage.getItem('signups') || '[]');
    if (!signups.includes(userId)) {
      signups.push(userId);
      localStorage.setItem('signups', JSON.stringify(signups));
    }
  }

  // Get all sessions
  getSessions() {
    return JSON.parse(localStorage.getItem('userSessions') || '{}');
  }

  // Get stats from localStorage (fallback)
  getLocalStats() {
    const users = JSON.parse(localStorage.getItem('signups') || '[]');
    const sessions = this.getSessions();
    const totalSessions = Object.values(sessions).reduce((a, b) => a + b, 0);
    
    return {
      uniqueUsers: users.length,
      totalSessions: totalSessions,
      signups: users.length
    };
  }
}

export default new AdminService();