import { toast } from "react-toastify";

class DealService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "salesRep_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { 
            field: { Name: "contactId_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
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

      return response.data.map(deal => ({
        ...deal,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        contactId: deal.contactId_c?.Id || deal.contactId_c,
        expectedCloseDate: deal.expectedCloseDate_c,
        probability: deal.probability_c,
        salesRep: deal.salesRep_c,
        description: deal.description_c,
        createdAt: deal.createdAt_c,
        updatedAt: deal.updatedAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "salesRep_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { 
            field: { Name: "contactId_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const deal = response.data;
      return {
        ...deal,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        contactId: deal.contactId_c?.Id || deal.contactId_c,
        expectedCloseDate: deal.expectedCloseDate_c,
        probability: deal.probability_c,
        salesRep: deal.salesRep_c,
        description: deal.description_c,
        createdAt: deal.createdAt_c,
        updatedAt: deal.updatedAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "salesRep_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } },
          { 
            field: { Name: "contactId_c" },
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

      return response.data.map(deal => ({
        ...deal,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        contactId: deal.contactId_c?.Id || deal.contactId_c,
        expectedCloseDate: deal.expectedCloseDate_c,
        probability: deal.probability_c,
        salesRep: deal.salesRep_c,
        description: deal.description_c,
        createdAt: deal.createdAt_c,
        updatedAt: deal.updatedAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals by contact ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [
          {
            Name: dealData.title,
            title_c: dealData.title,
            value_c: parseFloat(dealData.value),
            stage_c: dealData.stage,
            contactId_c: parseInt(dealData.contactId),
            expectedCloseDate_c: dealData.expectedCloseDate,
            probability_c: parseFloat(dealData.probability),
            salesRep_c: dealData.salesRep,
            description_c: dealData.description,
            createdAt_c: new Date().toISOString(),
            updatedAt_c: new Date().toISOString()
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
          console.error(`Failed to create deals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const deal = successfulRecords[0].data;
          return {
            ...deal,
            title: deal.title_c,
            value: deal.value_c,
            stage: deal.stage_c,
            contactId: deal.contactId_c?.Id || deal.contactId_c,
            expectedCloseDate: deal.expectedCloseDate_c,
            probability: deal.probability_c,
            salesRep: deal.salesRep_c,
            description: deal.description_c,
            createdAt: deal.createdAt_c,
            updatedAt: deal.updatedAt_c
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: updateData.title,
            title_c: updateData.title,
            value_c: updateData.value ? parseFloat(updateData.value) : undefined,
            stage_c: updateData.stage,
            contactId_c: updateData.contactId ? parseInt(updateData.contactId) : undefined,
            expectedCloseDate_c: updateData.expectedCloseDate,
            probability_c: updateData.probability !== undefined ? parseFloat(updateData.probability) : undefined,
            salesRep_c: updateData.salesRep,
            description_c: updateData.description,
            updatedAt_c: new Date().toISOString()
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update deals ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const deal = successfulUpdates[0].data;
          return {
            ...deal,
            title: deal.title_c,
            value: deal.value_c,
            stage: deal.stage_c,
            contactId: deal.contactId_c?.Id || deal.contactId_c,
            expectedCloseDate: deal.expectedCloseDate_c,
            probability: deal.probability_c,
            salesRep: deal.salesRep_c,
            description: deal.description_c,
            createdAt: deal.createdAt_c,
            updatedAt: deal.updatedAt_c
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
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
          console.error(`Failed to delete deals ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}
export default new DealService();