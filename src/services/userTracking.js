// services/userTracking.js

// User tracking service with improved device fingerprinting
class UserTracking {
  constructor() {
    this.storageKey = 'ivyInsightTracking';
    this.sessionId = this.generateSessionId();
    this.deviceId = this.getOrCreateDeviceId();
    
    // Track this session
    this.trackSession('app_visit');
  }

  // Generate a simpler but more stable device fingerprint
  generateDeviceFingerprint() {
    // Use more stable components that don't change
    const components = [
      navigator.userAgent,
      navigator.language,
      // Use screen properties that are more stable
      window.screen.width,
      window.screen.height,
      // Add timezone (stable)
      new Date().getTimezoneOffset(),
      // Hardware concurrency (stable)
      navigator.hardwareConcurrency || 'unknown',
      // Platform info
      navigator.platform || 'unknown',
      // Check if cookies enabled (stable)
      navigator.cookieEnabled,
      // Simple hash of user agent (more stable)
      this.hashString(navigator.userAgent)
    ];
    
    // Create a more stable fingerprint
    const fingerprint = components.join('|');
    return this.hashString(fingerprint).toString();
  }

  // Simple string hashing function
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // Get or create device ID with better persistence
  getOrCreateDeviceId() {
    // Try multiple storage methods for better persistence
    let deviceId = null;
    
    // Try localStorage first
    try {
      deviceId = localStorage.getItem('ivyInsightDeviceId');
    } catch (e) {
      console.log('localStorage not available');
    }
    
    // Try sessionStorage as backup
    if (!deviceId) {
      try {
        deviceId = sessionStorage.getItem('ivyInsightDeviceId');
      } catch (e) {
        console.log('sessionStorage not available');
      }
    }
    
    // Generate new if not found
    if (!deviceId) {
      deviceId = 'dev_' + this.generateDeviceFingerprint() + '_' + Date.now();
      
      // Save to both storages
      try {
        localStorage.setItem('ivyInsightDeviceId', deviceId);
        sessionStorage.setItem('ivyInsightDeviceId', deviceId);
      } catch (e) {
        console.log('Could not save device ID');
      }
      
      // Track as new device
      this.trackNewDevice(deviceId);
    }
    
    return deviceId;
  }

  // Track new unique device
  trackNewDevice(deviceId) {
    try {
      const devices = JSON.parse(localStorage.getItem('ivyInsightDevices') || '[]');
      if (!devices.includes(deviceId)) {
        devices.push(deviceId);
        localStorage.setItem('ivyInsightDevices', JSON.stringify(devices));
        console.log('✅ New device tracked:', deviceId);
      }
    } catch (e) {
      console.error('Error tracking new device:', e);
    }
  }

  // Generate a unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track user sign-up/onboarding
  async trackUserSignup(userData) {
    const userId = userData.userId || this.generateUserId();
    
    // Save user data
    try {
      localStorage.setItem('ivyInsightUserId', userId);
    } catch (e) {
      console.log('Could not save user ID');
    }
    
    const trackingData = {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      userId: userId,
      name: userData.name,
      age: userData.age,
      personality: userData.personality?.name || 'Not selected',
      timestamp: new Date().toISOString(),
      action: 'signup'
    };

    this.saveToLocalStorage(trackingData);
    console.log('📝 User signup tracked:', userId);
    
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
    let userId = null;
    try {
      userId = localStorage.getItem('ivyInsightUserId');
    } catch (e) {
      console.log('Could not get user ID');
    }
    
    if (!userId) {
      userId = this.generateUserId();
      try {
        localStorage.setItem('ivyInsightUserId', userId);
      } catch (e) {
        console.log('Could not save user ID');
      }
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
      return devices.length;
    } catch (e) {
      return 1; // At least this device
    }
  }

  // Get sign-ups count
  getSignupsCount() {
    const data = this.getAllTrackingData();
    const signups = data.filter(item => item.action === 'signup');
    
    // Get unique user IDs from signups
    const uniqueUsers = new Set(signups.map(s => s.userId));
    return uniqueUsers.size;
  }

  // Get user statistics
  getUserStats() {
    const data = this.getAllTrackingData();
    
    return {
      uniqueDevices: this.getUniqueDevicesCount(),
      totalSignups: this.getSignupsCount(),
      totalActivities: data.filter(item => item.activityName).length,
      totalSessions: new Set(data.filter(item => item.sessionId).map(s => s.sessionId)).size,
      lastUpdated: new Date().toISOString()
    };
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

// For debugging - expose to window in development
if (process.env.NODE_ENV === 'development') {
  window.userTracking = userTracking;
}