// services/userTracking.js

// User tracking service with device fingerprinting
class UserTracking {
  constructor() {
    this.storageKey = 'ivyInsightTracking';
    this.sessionId = this.generateSessionId();
    this.deviceId = this.getOrCreateDeviceId();
  }

  // Generate a device fingerprint
  generateDeviceFingerprint() {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.deviceMemory || 'unknown',
      !!navigator.maxTouchPoints,
      !!window.indexedDB,
      !!window.openDatabase,
      // Add more fingerprinting components
    ];
    
    // Create a simple hash
    const fingerprint = components.join('|||');
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Get or create device ID (unique per browser/device)
  getOrCreateDeviceId() {
    // Try to get existing device ID
    let deviceId = localStorage.getItem('ivyInsightDeviceId');
    
    if (!deviceId) {
      // Generate new device fingerprint
      deviceId = this.generateDeviceFingerprint();
      localStorage.setItem('ivyInsightDeviceId', deviceId);
      
      // Track this as a new unique device
      this.trackNewDevice(deviceId);
    }
    
    return deviceId;
  }

  // Track new unique device
  trackNewDevice(deviceId) {
    const devices = JSON.parse(localStorage.getItem('ivyInsightDevices') || '[]');
    if (!devices.includes(deviceId)) {
      devices.push(deviceId);
      localStorage.setItem('ivyInsightDevices', JSON.stringify(devices));
    }
  }

  // Generate a unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track user sign-up/onboarding
  async trackUserSignup(userData) {
    const trackingData = {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      userId: userData.userId || this.generateUserId(),
      name: userData.name,
      age: userData.age,
      personality: userData.personality?.name || 'Not selected',
      timestamp: new Date().toISOString(),
      action: 'signup',
      source: window.location.href
    };

    this.saveToLocalStorage(trackingData);
    await this.sendToServer(trackingData);
    
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
      deviceId: this.deviceId,
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

  // Generate unique user ID (per sign-up, not per device)
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

  // Send to server
  async sendToServer(data) {
    try {
      console.log('📊 Tracking data:', data);
    } catch (error) {
      console.error('Error sending tracking data:', error);
    }
  }

  // Get all tracking data
  getAllTrackingData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Get unique devices count (different browsers/devices)
  getUniqueDevicesCount() {
    const devices = JSON.parse(localStorage.getItem('ivyInsightDevices') || '[]');
    return devices.length;
  }

  // Get sign-ups count (user accounts created)
  getSignupsCount() {
    const data = this.getAllTrackingData();
    const signups = data.filter(item => item.action === 'signup');
    return signups.length;
  }

  // Get user statistics
  getUserStats() {
    const data = this.getAllTrackingData();
    
    return {
      uniqueDevices: this.getUniqueDevicesCount(), // Real unique devices/browsers
      totalSignups: this.getSignupsCount(), // Total sign-ups
      totalActivities: data.filter(item => item.activityName).length,
      totalSessions: new Set(data.map(item => item.sessionId)).size,
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