import { toast } from "react-toastify";
import contactService from "./contactService";
import React from "react";
import Error from "@/components/ui/Error";

class LeadService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'lead_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignedTo_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } }
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

      return response.data.map(lead => ({
        ...lead,
        name: lead.Name,
        company: lead.company_c,
        email: lead.email_c,
        phone: lead.phone_c,
        source: lead.source_c,
        status: lead.status_c,
        priority: lead.priority_c,
        assignedTo: lead.assignedTo_c,
        notes: lead.notes_c,
        createdAt: lead.createdAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leads:", error?.response?.data?.message);
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
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignedTo_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const lead = response.data;
      return {
        ...lead,
        name: lead.Name,
        company: lead.company_c,
        email: lead.email_c,
        phone: lead.phone_c,
        source: lead.source_c,
        status: lead.status_c,
        priority: lead.priority_c,
        assignedTo: lead.assignedTo_c,
        notes: lead.notes_c,
        createdAt: lead.createdAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching lead with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(leadData) {
    try {
      const params = {
        records: [
          {
            Name: leadData.name,
            company_c: leadData.company,
            email_c: leadData.email,
            phone_c: leadData.phone,
            source_c: leadData.source,
            status_c: leadData.status,
            priority_c: leadData.priority,
            assignedTo_c: leadData.assignedTo,
            notes_c: leadData.notes,
            createdAt_c: new Date().toISOString()
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
          console.error(`Failed to create leads ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const lead = successfulRecords[0].data;
          return {
            ...lead,
            name: lead.Name,
            company: lead.company_c,
            email: lead.email_c,
            phone: lead.phone_c,
            source: lead.source_c,
            status: lead.status_c,
            priority: lead.priority_c,
            assignedTo: lead.assignedTo_c,
            notes: lead.notes_c,
            createdAt: lead.createdAt_c
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating lead:", error?.response?.data?.message);
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
            company_c: updateData.company,
            email_c: updateData.email,
            phone_c: updateData.phone,
            source_c: updateData.source,
            status_c: updateData.status,
            priority_c: updateData.priority,
            assignedTo_c: updateData.assignedTo,
            notes_c: updateData.notes
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
          console.error(`Failed to update leads ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const lead = successfulUpdates[0].data;
          return {
            ...lead,
            name: lead.Name,
            company: lead.company_c,
            email: lead.email_c,
            phone: lead.phone_c,
            source: lead.source_c,
            status: lead.status_c,
            priority: lead.priority_c,
            assignedTo: lead.assignedTo_c,
            notes: lead.notes_c,
            createdAt: lead.createdAt_c
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating lead:", error?.response?.data?.message);
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
        return null;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete leads ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          return successfulDeletions[0];
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting lead:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async convertToContact(id) {
    try {
      // First get the lead data
      const lead = await this.getById(id);
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      // Create contact data from lead
      const contactData = {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        type: 'customer',
        notes: `Converted from lead. Original notes: ${lead.notes || 'No notes'}`
      };

      // Create the contact
      const newContact = await contactService.create(contactData);
      if (!newContact) {
        throw new Error('Failed to create contact from lead');
      }

      // Delete the lead
      await this.delete(id);
      
      return {
        contact: newContact,
        originalLead: lead
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error converting lead to contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignedTo_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data.map(lead => ({
        ...lead,
        name: lead.Name,
        company: lead.company_c,
        email: lead.email_c,
        phone: lead.phone_c,
        source: lead.source_c,
        status: lead.status_c,
        priority: lead.priority_c,
        assignedTo: lead.assignedTo_c,
        notes: lead.notes_c,
        createdAt: lead.createdAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leads by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getBySource(source) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignedTo_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } }
        ],
        where: [
          {
            FieldName: "source_c",
            Operator: "EqualTo",
            Values: [source]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data.map(lead => ({
        ...lead,
        name: lead.Name,
        company: lead.company_c,
        email: lead.email_c,
        phone: lead.phone_c,
        source: lead.source_c,
        status: lead.status_c,
        priority: lead.priority_c,
        assignedTo: lead.assignedTo_c,
        notes: lead.notes_c,
        createdAt: lead.createdAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leads by source:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const leadService = new LeadService();