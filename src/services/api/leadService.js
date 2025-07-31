import mockLeads from '@/services/mockData/leads.json';
import contactService from './contactService';

let leads = [...mockLeads];
let nextId = Math.max(...leads.map(lead => lead.Id)) + 1;

export const leadService = {
  // Get all leads
  getAll() {
    return Promise.resolve([...leads]);
  },

  // Get lead by ID
  getById(id) {
    const leadId = parseInt(id);
    if (isNaN(leadId)) {
      return Promise.reject(new Error('Invalid lead ID'));
    }
    
    const lead = leads.find(lead => lead.Id === leadId);
    if (!lead) {
      return Promise.reject(new Error('Lead not found'));
    }
    
    return Promise.resolve({ ...lead });
  },

  // Create new lead
  create(leadData) {
    const newLead = {
      ...leadData,
      Id: nextId++,
      createdAt: new Date().toISOString()
    };
    
    leads.push(newLead);
    return Promise.resolve({ ...newLead });
  },

  // Update lead
  update(id, updates) {
    const leadId = parseInt(id);
    if (isNaN(leadId)) {
      return Promise.reject(new Error('Invalid lead ID'));
    }

    const index = leads.findIndex(lead => lead.Id === leadId);
    if (index === -1) {
      return Promise.reject(new Error('Lead not found'));
    }

    leads[index] = { ...leads[index], ...updates };
    return Promise.resolve({ ...leads[index] });
  },

  // Delete lead
  delete(id) {
    const leadId = parseInt(id);
    if (isNaN(leadId)) {
      return Promise.reject(new Error('Invalid lead ID'));
    }

    const index = leads.findIndex(lead => lead.Id === leadId);
    if (index === -1) {
      return Promise.reject(new Error('Lead not found'));
    }

    const deletedLead = leads[index];
    leads.splice(index, 1);
    return Promise.resolve({ ...deletedLead });
  },

  // Convert lead to contact
  convertToContact(id) {
    const leadId = parseInt(id);
    if (isNaN(leadId)) {
      return Promise.reject(new Error('Invalid lead ID'));
    }

    const leadIndex = leads.findIndex(lead => lead.Id === leadId);
    if (leadIndex === -1) {
      return Promise.reject(new Error('Lead not found'));
    }

    const lead = leads[leadIndex];
    
    // Create contact data from lead
    const contactData = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: 'Contact', // Default position
      tags: ['Converted Lead'],
      notes: `Converted from lead. Original notes: ${lead.notes || 'No notes'}`
    };

    // Add to contacts and remove from leads
    return contactService.create(contactData)
      .then(newContact => {
        leads.splice(leadIndex, 1);
        return Promise.resolve({ 
          contact: newContact, 
          originalLead: { ...lead } 
        });
      });
  },

  // Get leads by status
  getByStatus(status) {
    const filteredLeads = leads.filter(lead => 
      lead.status.toLowerCase() === status.toLowerCase()
    );
    return Promise.resolve([...filteredLeads]);
  },

  // Get leads by source
  getBySource(source) {
    const filteredLeads = leads.filter(lead => 
      lead.source.toLowerCase() === source.toLowerCase()
    );
    return Promise.resolve([...filteredLeads]);
  }
};