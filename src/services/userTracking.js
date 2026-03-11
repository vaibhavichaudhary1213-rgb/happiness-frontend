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
      source: userData.source || 'direct', // Track where user came from
      timestamp: new Date().toISOString(),
      action: 'signup'
    };

    this.saveToLocalStorage(trackingData);
    console.log('📝 Signup tracked:', { 
      name: userData.name, 
      deviceId: this.deviceId,
      source: trackingData.source 
    });
    
    return trackingData;
  }

  // Track QR code scan
  async trackQRScan(scanData = {}) {
    const userId = this.getUserId();
    
    const trackingData = {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      userId: userId,
      action: 'qr_scan',
      source: 'qr_code',
      timestamp: new Date().toISOString(),
      details: {
        ...scanData,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };

    this.saveToLocalStorage(trackingData);
    console.log('📱 QR Scan tracked from device:', this.deviceId);
    
    // Also track as a special event for analytics
    this.trackActivity(userId, 'qr_code_scan', 0, true, { source: 'qr_code' });
    
    return trackingData;
  }

  // Track app session
  async trackSession(action, details = {}) {
    const trackingData = {
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      userId: this.getUserId(),
      action: action,
      details: {
        ...details,
        source: details.source || this.getEntrySource() // Track if came from QR
      },
      timestamp: new Date().toISOString()
    };

    this.saveToLocalStorage(trackingData);
    return trackingData;
  }

  // Get entry source (QR, direct, etc.)
  getEntrySource() {
    // Check if user came from QR code
    const cameFromQR = localStorage.getItem('cameFromQR');
    if (cameFromQR === 'true') {
      // Clear it after reading so it doesn't persist forever
      localStorage.removeItem('cameFromQR');
      return 'qr_code';
    }
    return 'direct';
  }

  // Track activity completion (updated with source tracking)
  async trackActivity(userId, activityName, duration, completed, metadata = {}) {
    const trackingData = {
      userId: userId,
      deviceId: this.deviceId,
      activityName: activityName,
      duration: duration,
      completed: completed,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      source: metadata.source || this.getEntrySource()
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

  // Get sign-ups count (with source breakdown)
  getSignupsCount() {
    const data = this.getAllTrackingData();
    const signups = data.filter(item => item.action === 'signup');
    
    // Get unique user IDs from signups
    const uniqueUsers = new Set(signups.map(s => s.userId));
    
    // Get source breakdown
    const sourceBreakdown = {};
    signups.forEach(s => {
      const source = s.source || 'direct';
      sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
    });
    
    console.log('📊 Signups:', signups.length, 'Unique users:', uniqueUsers.size);
    console.log('📊 Signup sources:', sourceBreakdown);
    
    return uniqueUsers.size;
  }

  // Get QR scan count
  getQRScanCount() {
    const data = this.getAllTrackingData();
    const qrScans = data.filter(item => 
      item.action === 'qr_scan' || 
      (item.activityName === 'qr_code_scan')
    );
    console.log('📊 QR Scans:', qrScans.length);
    return qrScans.length;
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

  // Get user statistics (updated with QR stats)
  getUserStats() {
    console.log('📊 Calculating stats...');
    
    const stats = {
      uniqueDevices: this.getUniqueDevicesCount(),
      totalSignups: this.getSignupsCount(),
      totalActivities: this.getActivitiesCount(),
      totalSessions: this.getSessionsCount(),
      qrScans: this.getQRScanCount(),
      lastUpdated: new Date().toISOString()
    };
    
    console.log('📊 Final stats:', stats);
    return stats;
  }

  // Get QR-specific analytics
  getQRAnalytics() {
    const data = this.getAllTrackingData();
    
    // Get all QR-related events
    const qrEvents = data.filter(item => 
      item.action === 'qr_scan' || 
      item.source === 'qr_code' ||
      item.activityName === 'qr_code_scan'
    );
    
    // Get unique devices from QR
    const uniqueDevicesFromQR = new Set(
      qrEvents.map(e => e.deviceId)
    );
    
    // Get signups that came from QR
    const qrSignups = data.filter(item => 
      item.action === 'signup' && item.source === 'qr_code'
    );
    
    return {
      totalQRScans: qrEvents.length,
      uniqueDevicesFromQR: uniqueDevicesFromQR.size,
      qrSignups: qrSignups.length,
      qrConversionRate: qrEvents.length > 0 
        ? Math.round((qrSignups.length / qrEvents.length) * 100) 
        : 0
    };
  }

  // Clear all data (for testing)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('ivyInsightDevices');
    localStorage.removeItem('ivyInsightDeviceId');
    localStorage.removeItem('ivyInsightUserId');
    localStorage.removeItem('cameFromQR');
    console.log('🧹 All tracking data cleared');
  }
}

// Create singleton instance
export const userTracking = new UserTracking();

// For debugging
if (process.env.NODE_ENV === 'development') {
  window.userTracking = userTracking;
}