// Firebase API Wrapper
// Simplified API for Firebase Realtime Database operations

const firebaseAPI = {
    // Get configuration
    async getConfig() {
        try {
            const snapshot = await database.ref('config').once('value');
            return snapshot.val();
        } catch (error) {
            console.error('[Firebase API] Error getting config:', error);
            throw error;
        }
    },

    // Update configuration
    async updateConfig(configData) {
        try {
            await database.ref('config').update(configData);
            console.log('[Firebase API] Config updated');
        } catch (error) {
            console.error('[Firebase API] Error updating config:', error);
            throw error;
        }
    },

    // Get all responses
    async getResponses() {
        try {
            const snapshot = await database.ref('responses').once('value');
            const data = snapshot.val();
            if (!data) return [];
            
            return Object.entries(data).map(([id, response]) => ({
                id,
                ...response
            }));
        } catch (error) {
            console.error('[Firebase API] Error getting responses:', error);
            throw error;
        }
    },

    // Add new response
    async addResponse(responseData) {
        try {
            const newRef = database.ref('responses').push();
            await newRef.set({
                ...responseData,
                timestamp: Date.now()
            });
            console.log('[Firebase API] Response added');
            return newRef.key;
        } catch (error) {
            console.error('[Firebase API] Error adding response:', error);
            throw error;
        }
    },

    // Update response
    async updateResponse(responseId, updates) {
        try {
            await database.ref(`responses/${responseId}`).update(updates);
            console.log('[Firebase API] Response updated');
        } catch (error) {
            console.error('[Firebase API] Error updating response:', error);
            throw error;
        }
    },

    // Delete response
    async deleteResponse(responseId) {
        try {
            await database.ref(`responses/${responseId}`).remove();
            console.log('[Firebase API] Response deleted');
        } catch (error) {
            console.error('[Firebase API] Error deleting response:', error);
            throw error;
        }
    },

    // Clear all responses
    async clearResponses() {
        try {
            await database.ref('responses').remove();
            console.log('[Firebase API] All responses cleared');
        } catch (error) {
            console.error('[Firebase API] Error clearing responses:', error);
            throw error;
        }
    },

    // Get archives
    async getArchives() {
        try {
            const snapshot = await database.ref('archives').once('value');
            return snapshot.val();
        } catch (error) {
            console.error('[Firebase API] Error getting archives:', error);
            throw error;
        }
    },

    // Save archive
    async saveArchive(archiveName, archiveData) {
        try {
            const newRef = database.ref('archives').push();
            await newRef.set({
                archiveName,
                ...archiveData,
                createdDate: new Date().toISOString()
            });
            console.log('[Firebase API] Archive saved');
            return newRef.key;
        } catch (error) {
            console.error('[Firebase API] Error saving archive:', error);
            throw error;
        }
    },

    // Delete archive
    async deleteArchive(archiveId) {
        try {
            await database.ref(`archives/${archiveId}`).remove();
            console.log('[Firebase API] Archive deleted');
        } catch (error) {
            console.error('[Firebase API] Error deleting archive:', error);
            throw error;
        }
    }
};

console.log('[Firebase API] Wrapper loaded');
