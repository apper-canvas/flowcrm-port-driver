import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const ContactModal = ({ isOpen, onClose, contact, onSave }) => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    address: "",
    notes: "",
    type: "lead"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        jobTitle: contact.jobTitle || "",
        address: contact.address || "",
        notes: contact.notes || "",
        type: contact.type || "lead"
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        address: "",
        notes: "",
        type: "lead"
      });
    }
    setErrors({});
  }, [contact, isOpen]);

const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
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
      await onSave(formData);
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative bg-gradient-to-br from-surface/50 to-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              {contact ? "Edit Contact" : "Add New Contact"}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

<form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Name"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              placeholder="Enter full name"
            />

            <FormField
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="Enter email address"
            />

            <FormField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="Enter phone number"
            />

            <FormField
              label="Company"
              required
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              error={errors.company}
              placeholder="Enter company name"
            />

            <FormField
              label="Job Title"
              required
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              error={errors.jobTitle}
              placeholder="Enter job title"
            />

            <FormField
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
              placeholder="Enter address"
            />

            <FormField
              label="Notes"
              type="textarea"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              error={errors.notes}
              placeholder="Enter notes or additional information"
            />

            <FormField
              label="Type"
              type="select"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              options={[
                { value: "lead", label: "Lead" },
                { value: "customer", label: "Customer" }
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
                    {contact ? "Update" : "Create"}
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

export default ContactModal;