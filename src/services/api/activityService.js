import { toast } from "react-toastify";
import React from "react";

class ActivityService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'activity_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { 
            field: { Name: "contactId_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "dealId_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(activity => ({
        ...activity,
        type: activity.type_c,
        description: activity.description_c,
        contactId: activity.contactId_c?.Id || activity.contactId_c,
        dealId: activity.dealId_c?.Id || activity.dealId_c,
        timestamp: activity.timestamp_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { 
            field: { Name: "contactId_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "dealId_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const activity = response.data;
      return {
        ...activity,
        type: activity.type_c,
        description: activity.description_c,
        contactId: activity.contactId_c?.Id || activity.contactId_c,
        dealId: activity.dealId_c?.Id || activity.dealId_c,
        timestamp: activity.timestamp_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { 
            field: { Name: "contactId_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "dealId_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "contactId_c",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data.map(activity => ({
        ...activity,
        type: activity.type_c,
        description: activity.description_c,
        contactId: activity.contactId_c?.Id || activity.contactId_c,
        dealId: activity.dealId_c?.Id || activity.dealId_c,
        timestamp: activity.timestamp_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities by contact ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [
          {
            Name: activityData.description,
            type_c: activityData.type,
            description_c: activityData.description,
            contactId_c: activityData.contactId ? parseInt(activityData.contactId) : null,
            dealId_c: activityData.dealId ? parseInt(activityData.dealId) : null,
            timestamp_c: new Date().toISOString()
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activities ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const activity = successfulRecords[0].data;
          return {
            ...activity,
            type: activity.type_c,
            description: activity.description_c,
            contactId: activity.contactId_c?.Id || activity.contactId_c,
            dealId: activity.dealId_c?.Id || activity.dealId_c,
            timestamp: activity.timestamp_c
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activities ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new ActivityService();