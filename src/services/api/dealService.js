import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...this.deals];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = this.deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.deals.filter(d => d.contactId === parseInt(contactId));
  }

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 450));
    
    const newId = Math.max(...this.deals.map(d => d.Id)) + 1;
    const newDeal = {
      Id: newId,
      ...dealData,
      contactId: parseInt(dealData.contactId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...updateData,
      Id: parseInt(id),
      contactId: updateData.contactId ? parseInt(updateData.contactId) : this.deals[index].contactId,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.deals[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return true;
  }
}

export default new DealService();