import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 280));
    return [...this.tasks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.tasks.filter(t => t.contactId === parseInt(contactId));
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.tasks.map(t => t.Id)) + 1;
    const newTask = {
      Id: newId,
      ...taskData,
      contactId: taskData.contactId ? parseInt(taskData.contactId) : null,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...updateData,
      Id: parseInt(id),
      contactId: updateData.contactId ? parseInt(updateData.contactId) : this.tasks[index].contactId
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return true;
  }
}

export default new TaskService();