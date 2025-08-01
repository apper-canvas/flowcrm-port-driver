import { toast } from "react-toastify";

class CompanyService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "lastActivity_c" } },
          { field: { Name: "recordType_c" } }
        ],
        where: [
          {
            FieldName: "recordType_c",
            Operator: "EqualTo",
            Values: ["company"]
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

      return response.data.map(company => ({
        ...company,
        name: company.Name,
        email: company.email_c,
        phone: company.phone_c,
        website: company.website_c,
        address: company.address_c,
        type: company.type_c,
        createdAt: company.createdAt_c,
        lastActivity: company.lastActivity_c,
        recordType: company.recordType_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching companies:", error?.response?.data?.message);
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "lastActivity_c" } },
          { field: { Name: "recordType_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const company = response.data;
      
      // Verify this is actually a company record
      if (company.recordType_c !== "company") {
        return null;
      }
      
      return {
        ...company,
        name: company.Name,
        email: company.email_c,
        phone: company.phone_c,
        website: company.website_c,
        address: company.address_c,
        type: company.type_c,
        createdAt: company.createdAt_c,
        lastActivity: company.lastActivity_c,
        recordType: company.recordType_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching company with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(companyData) {
    try {
      const params = {
        records: [
          {
            Name: companyData.name,
            email_c: companyData.email || "",
            phone_c: companyData.phone || "",
            website_c: companyData.website || "",
            address_c: companyData.address || "",
            type_c: companyData.type || "customer",
            recordType_c: "company",
            createdAt_c: new Date().toISOString(),
            lastActivity_c: null
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
          console.error(`Failed to create companies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const company = successfulRecords[0].data;
          return {
            ...company,
            name: company.Name,
            email: company.email_c,
            phone: company.phone_c,
            website: company.website_c,
            address: company.address_c,
            type: company.type_c,
            createdAt: company.createdAt_c,
            lastActivity: company.lastActivity_c,
            recordType: company.recordType_c
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating company:", error?.response?.data?.message);
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
            Name: updateData.name,
            email_c: updateData.email || "",
            phone_c: updateData.phone || "",
            website_c: updateData.website || "",
            address_c: updateData.address || "",
            type_c: updateData.type,
            recordType_c: "company"
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
          console.error(`Failed to update companies ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const company = successfulUpdates[0].data;
          return {
            ...company,
            name: company.Name,
            email: company.email_c,
            phone: company.phone_c,
            website: company.website_c,
            address: company.address_c,
            type: company.type_c,
            createdAt: company.createdAt_c,
            lastActivity: company.lastActivity_c,
            recordType: company.recordType_c
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating company:", error?.response?.data?.message);
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
          console.error(`Failed to delete companies ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new CompanyService();