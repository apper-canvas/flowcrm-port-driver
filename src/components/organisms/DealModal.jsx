import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const DealModal = ({ isOpen, onClose, deal, contacts, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "Lead",
    contactId: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stages = [
    { value: "Lead", label: "Lead" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal", label: "Proposal" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Closed", label: "Closed" }
  ];

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        contactId: deal.contactId || ""
      });
    } else {
      setFormData({
        title: "",
        value: "",
        stage: "Lead",
        contactId: ""
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }

    if (!formData.value) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(formData.value) || parseFloat(formData.value) < 0) {
      newErrors.value = "Please enter a valid positive number";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact";
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
      const dealData = {
        ...formData,
        value: parseFloat(formData.value)
      };
      await onSave(dealData);
      toast.success(deal ? "Deal updated successfully!" : "Deal created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
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
              {deal ? "Edit Deal" : "Add New Deal"}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Deal Title"
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              placeholder="Enter deal title"
            />

            <FormField
              label="Deal Value"
              type="number"
              required
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              error={errors.value}
              placeholder="0.00"
              step="0.01"
              min="0"
            />

            <FormField
              label="Contact"
              type="select"
              required
              value={formData.contactId}
              onChange={(e) => handleChange("contactId", e.target.value)}
              error={errors.contactId}
              options={[
                { value: "", label: "Select a contact" },
                ...contactOptions
              ]}
            />

            <FormField
              label="Stage"
              type="select"
              value={formData.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
              options={stages}
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
                    {deal ? "Update" : "Create"}
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

export default DealModal;