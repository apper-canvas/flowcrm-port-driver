import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 320));
    return [...this.activities];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.activities.filter(a => a.contactId === parseInt(contactId));
  }

  async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newId = Math.max(...this.activities.map(a => a.Id)) + 1;
    const newActivity = {
      Id: newId,
      ...activityData,
      contactId: parseInt(activityData.contactId),
      timestamp: new Date().toISOString()
    };
    
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return true;
  }
}

export default new ActivityService();