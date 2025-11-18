/**
 * Firebase API Wrapper
 * Provides clean interface for all database operations
 */

class FirebaseAPI {
  constructor() {
    this.db = window.db;
    this.configRef = this.db.ref('config');
    this.responsesRef = this.db.ref('responses');
    this.archivesRef = this.db.ref('archives');
  }

  // ============================================
  // CONFIG OPERATIONS
  // ============================================

  async getConfig(key = null) {
    try {
      if (key) {
        const snapshot = await this.configRef.child(key).once('value');
        return snapshot.val();
      } else {
        const snapshot = await this.configRef.once('value');
        return snapshot.val() || {};
      }
    } catch (error) {
      console.error('[Firebase API] Error getting config:', error);
      throw error;
    }
  }

  async setConfig(key, value) {
    try {
      await this.configRef.child(key).set(value);
      console.log(`[Firebase API] Config updated: ${key} = ${value}`);
      return { success: true };
    } catch (error) {
      console.error('[Firebase API] Error setting config:', error);
      throw error;
    }
  }

  async updateConfig(updates) {
    try {
      await this.configRef.update(updates);
      console.log('[Firebase API] Config batch updated:', updates);
      return { success: true };
    } catch (error) {
      console.error('[Firebase API] Error updating config:', error);
      throw error;
    }
  }

  // ============================================
  // RESPONSE OPERATIONS
  // ============================================

  async getAllResponses() {
    try {
      const snapshot = await this.responsesRef.once('value');
      const data = snapshot.val();
      
      if (!data) return [];
      
      // Convert object to array with IDs
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      }));
    } catch (error) {
      console.error('[Firebase API] Error getting responses:', error);
      throw error;
    }
  }

  async addResponse(responseData) {
    try {
      // Add timestamp
      responseData.timestamp = Date.now();
      
      // Generate new ID and push
      const newRef = await this.responsesRef.push(responseData);
      
      console.log('[Firebase API] Response added:', newRef.key);
      return { 
        success: true, 
        id: newRef.key,
        data: responseData 
      };
    } catch (error) {
      console.error('[Firebase API] Error adding response:', error);
      throw error;
    }
  }

  async updateResponse(id, updates) {
    try {
      await this.responsesRef.child(id).update(updates);
      console.log(`[Firebase API] Response updated: ${id}`);
      return { success: true };
    } catch (error) {
      console.error('[Firebase API] Error updating response:', error);
      throw error;
    }
  }

  async deleteResponse(id) {
    try {
      await this.responsesRef.child(id).remove();
      console.log(`[Firebase API] Response deleted: ${id}`);
      return { success: true };
    } catch (error) {
      console.error('[Firebase API] Error deleting response:', error);
      throw error;
    }
  }

  async clearAllResponses() {
    try {
      await this.responsesRef.remove();
      console.log('[Firebase API] All responses cleared');
      return { success: true };
    } catch (error) {
      console.error('[Firebase API] Error clearing responses:', error);
      throw error;
    }
  }

  // ============================================
  // REAL-TIME LISTENERS
  // ============================================

  onResponsesChange(callback) {
    this.responsesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const responses = data ? Object.keys(data).map(id => ({
        id,
        ...data[id]
      })) : [];
      callback(responses);
    });
  }

  onConfigChange(callback) {
    this.configRef.on('value', (snapshot) => {
      callback(snapshot.val() || {});
    });
  }

  offResponsesChange() {
    this.responsesRef.off('value');
  }

  offConfigChange() {
    this.configRef.off('value');
  }

  // ============================================
  // ARCHIVE OPERATIONS
  // ============================================

  async getAllArchives() {
    try {
      const snapshot = await this.archivesRef.orderByChild('createdDate').once('value');
      const data = snapshot.val();
      
      if (!data) return [];
      
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      })).reverse(); // Most recent first
    } catch (error) {
      console.error('[Firebase API] Error getting archives:', error);
      throw error;
    }
  }

  async saveArchive(archiveName, archiveData) {
    try {
      const archive = {
        archiveName,
        createdDate: Date.now(),
        archiveData: JSON.stringify(archiveData)
      };
      
      const newRef = await this.archivesRef.push(archive);
      
      console.log('[Firebase API] Archive saved:', newRef.key);
      return { 
        success: true, 
        id: newRef.key 
      };
    } catch (error) {
      console.error('[Firebase API] Error saving archive:', error);
      throw error;
    }
  }

  async deleteArchive(id) {
    try {
      await this.archivesRef.child(id).remove();
      console.log(`[Firebase API] Archive deleted: ${id}`);
      return { success: true };
    } catch (error) {
      console.error('[Firebase API] Error deleting archive:', error);
      throw error;
    }
  }

  async restoreArchive(id) {
    try {
      const snapshot = await this.archivesRef.child(id).once('value');
      const archive = snapshot.val();
      
      if (!archive) {
        throw new Error('Archive not found');
      }
      
      const archiveData = JSON.parse(archive.archiveData);
      
      // Clear current responses
      await this.clearAllResponses();
      
      // Restore responses
      if (archiveData.responses && archiveData.responses.length > 0) {
        const updates = {};
        archiveData.responses.forEach(response => {
          const id = response.id || this.responsesRef.push().key;
          delete response.id;
          updates[id] = response;
        });
        await this.responsesRef.update(updates);
      }
      
      // Restore config
      if (archiveData.config) {
        await this.configRef.update(archiveData.config);
      }
      
      console.log('[Firebase API] Archive restored:', id);
      return { success: true };
    } catch (error) {
      console.error('[Firebase API] Error restoring archive:', error);
      throw error;
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  async initializeDefaultConfig() {
    try {
      const config = await this.getConfig();
      
      // Set defaults if not exist
      const defaults = {
        pollTitle: config.pollTitle || 'Iizuka Lab Dinner Poll',
        basePrice: config.basePrice || 10000,
        bachelorPercent: config.bachelorPercent || 15,
        masterPercent: config.masterPercent || 20,
        phdPercent: config.phdPercent || 30,
        facultyPercent: config.facultyPercent || 35,
        startDate: config.startDate || '',
        endDate: config.endDate || '',
        availableDates: config.availableDates || ''
      };
      
      await this.updateConfig(defaults);
      console.log('[Firebase API] Default config initialized');
      
      return defaults;
    } catch (error) {
      console.error('[Firebase API] Error initializing config:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.db.ref('.info/connected').once('value');
      console.log('[Firebase API] ✅ Connection test successful!');
      return { success: true, message: 'Connected to Firebase!' };
    } catch (error) {
      console.error('[Firebase API] ❌ Connection test failed:', error);
      return { success: false, message: error.message };
    }
  }
}

// Create global instance
window.api = new FirebaseAPI();

console.log('✅ Firebase API wrapper loaded');
