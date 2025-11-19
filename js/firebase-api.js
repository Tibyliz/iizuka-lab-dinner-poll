// Firebase API Wrapper Class
class FirebaseAPI {
    constructor() {
        this.db = firebase.database();
        this.configRef = this.db.ref('config');
        this.responsesRef = this.db.ref('responses');
        this.archivesRef = this.db.ref('archives');
    }

    // ==================== CONFIG OPERATIONS ====================
    
    async getConfig() {
        try {
            const snapshot = await this.configRef.once('value');
            return snapshot.val() || this.getDefaultConfig();
        } catch (error) {
            console.error('[Firebase API] Error getting config:', error);
            throw error;
        }
    }

    getDefaultConfig() {
        return {
            pollTitle: 'Iizuka Lab Dinner Poll',
            startDate: '',
            endDate: '',
            availableDates: '',
            basePrice: 10000,
            pricing: {
                bachelor: 15,
                master: 20,
                phd: 30,
                faculty: 35
            }
        };
    }

    async updateConfig(configData) {
        try {
            await this.configRef.update(configData);
            console.log('[Firebase API] Config updated successfully');
            return { success: true };
        } catch (error) {
            console.error('[Firebase API] Error updating config:', error);
            throw error;
        }
    }

    async initializeConfig() {
        try {
            const snapshot = await this.configRef.once('value');
            if (!snapshot.exists()) {
                await this.configRef.set(this.getDefaultConfig());
                console.log('[Firebase API] Config initialized with defaults');
            }
        } catch (error) {
            console.error('[Firebase API] Error initializing config:', error);
            throw error;
        }
    }

    // ==================== RESPONSE OPERATIONS ====================
    
    async addResponse(responseData) {
        try {
            const newRef = this.responsesRef.push();
            const response = {
                ...responseData,
                timestamp: Date.now(),
                paymentStatus: false,
                customAmount: null,
                isEdited: false
            };
            await newRef.set(response);
            console.log('[Firebase API] Response added successfully');
            return { success: true, id: newRef.key };
        } catch (error) {
            console.error('[Firebase API] Error adding response:', error);
            throw error;
        }
    }

    async getAllResponses() {
        try {
            const snapshot = await this.responsesRef.once('value');
            const responses = [];
            snapshot.forEach((child) => {
                responses.push({
                    id: child.key,
                    ...child.val()
                });
            });
            return responses;
        } catch (error) {
            console.error('[Firebase API] Error getting responses:', error);
            throw error;
        }
    }

    async updateResponse(responseId, data) {
        try {
            await this.responsesRef.child(responseId).update(data);
            console.log('[Firebase API] Response updated successfully');
            return { success: true };
        } catch (error) {
            console.error('[Firebase API] Error updating response:', error);
            throw error;
        }
    }

    async deleteResponse(responseId) {
        try {
            await this.responsesRef.child(responseId).remove();
            console.log('[Firebase API] Response deleted successfully');
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

    // ==================== ARCHIVE OPERATIONS ====================
    
    async saveArchive(archiveName, archiveData) {
        try {
            const newRef = this.archivesRef.push();
            const archive = {
                archiveName: archiveName,
                createdDate: Date.now(),
                archiveData: JSON.stringify(archiveData)
            };
            await newRef.set(archive);
            console.log('[Firebase API] Archive saved successfully');
            return { success: true, id: newRef.key };
        } catch (error) {
            console.error('[Firebase API] Error saving archive:', error);
            throw error;
        }
    }

    async getAllArchives() {
        try {
            const snapshot = await this.archivesRef.once('value');
            const archives = [];
            snapshot.forEach((child) => {
                const data = child.val();
                archives.push({
                    id: child.key,
                    archiveName: data.archiveName,
                    createdDate: data.createdDate,
                    archiveData: JSON.parse(data.archiveData)
                });
            });
            return archives.sort((a, b) => b.createdDate - a.createdDate);
        } catch (error) {
            console.error('[Firebase API] Error getting archives:', error);
            throw error;
        }
    }

    async deleteArchive(archiveId) {
        try {
            await this.archivesRef.child(archiveId).remove();
            console.log('[Firebase API] Archive deleted successfully');
            return { success: true };
        } catch (error) {
            console.error('[Firebase API] Error deleting archive:', error);
            throw error;
        }
    }

    // ==================== REAL-TIME LISTENERS ====================
    
    onResponsesChange(callback) {
        this.responsesRef.on('value', (snapshot) => {
            const responses = [];
            snapshot.forEach((child) => {
                responses.push({
                    id: child.key,
                    ...child.val()
                });
            });
            callback(responses);
        });
    }

    offResponsesChange() {
        this.responsesRef.off('value');
    }

    onConfigChange(callback) {
        this.configRef.on('value', (snapshot) => {
            const config = snapshot.val() || this.getDefaultConfig();
            callback(config);
        });
    }

    offConfigChange() {
        this.configRef.off('value');
    }
}

// Create global instance
const firebaseAPI = new FirebaseAPI();
console.log('[Firebase API] Wrapper loaded successfully');
