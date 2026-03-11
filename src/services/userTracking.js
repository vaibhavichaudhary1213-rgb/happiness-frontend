// services/userTracking.js

// User tracking service with proper device fingerprinting
class UserTracking {
  constructor() {
    this.storageKey = 'ivyInsightTracking';
    this.sessionId = this.generateSessionId();
    this.deviceId = this.getOrCreateDeviceId();
  }

  // Generate a truly unique device fingerprint
  generateDeviceFingerprint() {
    // Use multiple components to create a unique fingerprint
    const components = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      window.screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.deviceMemory || 'unknown',
      navigator.platform || 'unknown',
      // Add random component to ensure uniqueness
      Math.random().toString(36).substring(2, 15)
    ];
    
    // Create a hash
    const fingerprint = components.join('|');
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
      hash |= 0;
    }
    return 'dev_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
  }

  // Get or create device ID
  getOrCreateDeviceId() {
    // Try to get existing device ID
    let deviceId = localStorage.getItem('ivyInsightDeviceId');
    
    if (!deviceId) {
      // Generate new unique device ID
      deviceId = this.generateDeviceFingerprint();
      localStorage.setItem('ivyInsightDeviceId', deviceId);
      
      // Track as new device
      this.trackNewDevice(deviceId);
      console.log('✅ New device created:', deviceId);
    }
    
    return deviceId;
  }

  // Track new unique device
  trackNewDevice(deviceId) {
    const devices = JSON.parse(localStorage.getItem('ivyInsightDevices') || '[]');
    if (!devices.includes(deviceId)) {
      devices.push(deviceId);
      localStorage.setItem('ivyInsightDevices', JSON.stringify(devices));
      console.log('📱 Devices now:', devices);
    }
  }

  // Generate a unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track user sign-up/onboarding
  async trackUserSignup(userData) {
    const userId = this.generateUserId();
    
    const trackingData = {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      userId: userId,
      name: userData.name,
      age: userData.age,
      personality: userData.personality || 'Not selected',
      timestamp: new Date().toISOString(),
      action: 'signup'
    };

    this.saveToLocalStorage(trackingData);
    console.log('📝 Signup tracked:', { name: userData.name, deviceId: this.deviceId });
    
    return trackingData;
  }

  // Track app session
  async trackSession(action, details = {}) {
    const trackingData = {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      userId: this.getUserId(),
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    };

    this.saveToLocalStorage(trackingData);
    return trackingData;
  }

  // Track activity completion
  async trackActivity(userId, activityName, duration, completed) {
    const trackingData = {
      userId: userId,
      deviceId: this.deviceId,
      activityName: activityName,
      duration: duration,
      completed: completed,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.saveToLocalStorage(trackingData);
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

  // Get all tracking data
  getAllTrackingData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // Get unique devices count
  getUniqueDevicesCount() {
    try {
      const devices = JSON.parse(localStorage.getItem('ivyInsightDevices') || '[]');
      console.log('📊 Unique devices:', devices.length, devices);
      return devices.length;
    } catch (e) {
      return 1;
    }
  }

  // Get sign-ups count
  getSignupsCount() {
    const data = this.getAllTrackingData();
    const signups = data.filter(item => item.action === 'signup');
    
    // Get unique user IDs from signups
    const uniqueUsers = new Set(signups.map(s => s.userId));
    console.log('📊 Signups:', signups.length, 'Unique users:', uniqueUsers.size);
    return uniqueUsers.size;
  }

  // Get activities count
  getActivitiesCount() {
    const data = this.getAllTrackingData();
    const activities = data.filter(item => item.activityName);
    console.log('📊 Activities:', activities.length);
    return activities.length;
  }

  // Get sessions count
  getSessionsCount() {
    const data = this.getAllTrackingData();
    const sessions = new Set(data.map(item => item.sessionId));
    console.log('📊 Sessions:', sessions.size);
    return sessions.size;
  }

  // Get user statistics
  getUserStats() {
    console.log('📊 Calculating stats...');
    
    const stats = {
      uniqueDevices: this.getUniqueDevicesCount(),
      totalSignups: this.getSignupsCount(),
      totalActivities: this.getActivitiesCount(),
      totalSessions: this.getSessionsCount(),
      lastUpdated: new Date().toISOString()
    };
    
    console.log('📊 Final stats:', stats);
    return stats;
  }

  // Clear all data (for testing)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('ivyInsightDevices');
    localStorage.removeItem('ivyInsightDeviceId');
    localStorage.removeItem('ivyInsightUserId');
    console.log('🧹 All tracking data cleared');
  }
}

// Create singleton instance
export const userTracking = new UserTracking();

// For debugging
if (process.env.NODE_ENV === 'development') {
  window.userTracking = userTracking;
}