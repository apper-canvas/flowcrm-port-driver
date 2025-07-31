import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.contacts];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = this.contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.contacts.map(c => c.Id)) + 1;
    const newContact = {
      Id: newId,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || "",
      company: contactData.company,
      jobTitle: contactData.jobTitle || "",
      address: contactData.address || "",
      notes: contactData.notes || "",
      type: contactData.type || "lead",
      createdAt: new Date().toISOString(),
      lastActivity: null
    };
    
    this.contacts.push(newContact);
    return { ...newContact };
  }

async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone || "",
      company: updateData.company,
      jobTitle: updateData.jobTitle || "",
      address: updateData.address || "",
      notes: updateData.notes || "",
      type: updateData.type || this.contacts[index].type,
      Id: parseInt(id)
    };
    
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts.splice(index, 1);
    return true;
  }
}

export default new ContactService();