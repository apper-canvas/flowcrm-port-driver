import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";
import { format } from "date-fns";

const TaskModal = ({ isOpen, onClose, task, contacts, onSave }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    contactId: "",
    status: "to do"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        contactId: task.contactId?.toString() || "",
        status: task.status || "pending"
      });
} else {
      setFormData({
        title: "",
        description: "",
        dueDate: format(new Date(), "yyyy-MM-dd"),
        contactId: "",
        status: "to do"
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        contactId: formData.contactId ? parseInt(formData.contactId) : null
      };
      await onSave(taskData);
      toast.success(task ? "Task updated successfully!" : "Task created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  const contactOptions = contacts?.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.name} (${contact.company})`
  })) || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative bg-gradient-to-br from-surface/50 to-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              {task ? "Edit Task" : "Add New Task"}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Task Title"
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              placeholder="Enter task title"
            />

            <FormField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter task description (optional)"
            />

            <FormField
              label="Due Date"
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              error={errors.dueDate}
            />

            <FormField
              label="Contact"
              type="select"
              value={formData.contactId}
              onChange={(e) => handleChange("contactId", e.target.value)}
              options={[
                { value: "", label: "No contact associated" },
                ...contactOptions
              ]}
            />

            <FormField
label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={[
                { value: "to do", label: "To Do" },
                { value: "in progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
                { value: "on hold", label: "On Hold" }
              ]}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    {task ? "Update" : "Create"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;