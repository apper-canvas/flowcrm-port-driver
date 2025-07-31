import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";
import { leadService } from "@/services/api/leadService";
import { format } from "date-fns";

const LeadDetailModal = ({ 
  isOpen, 
  onClose, 
  lead, 
  onEdit, 
  onDelete, 
  onConvert 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !lead) return null;

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      await leadService.delete(lead.Id);
      toast.success("Lead deleted successfully!");
      onDelete(lead.Id);
      onClose();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleConvert = async () => {
    setLoading(true);
    
    try {
      const result = await leadService.convertToContact(lead.Id);
      toast.success(`Lead converted to contact successfully! ${result.contact.name} is now in your contacts.`);
      onConvert(lead.Id, result.contact);
      onClose();
    } catch (error) {
      console.error("Error converting lead:", error);
      toast.error("Failed to convert lead. Please try again.");
    } finally {
      setLoading(false);
      setShowConvertConfirm(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'new': return 'new';
      case 'contacted': return 'contacted';
      case 'qualified': return 'qualified';
      case 'unqualified': return 'unqualified';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                {lead.name}
              </h2>
              <p className="text-sm text-gray-500">{lead.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant={getStatusVariant(lead.status)}>
                {lead.status}
              </Badge>
              <Badge variant={getPriorityVariant(lead.priority)}>
                <ApperIcon 
                  name={getPriorityIcon(lead.priority)} 
                  size={12} 
                  className="mr-1" 
                />
                {lead.priority} Priority
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Created {format(new Date(lead.createdAt), 'MMM d, yyyy')}
            </p>
          </div>

          {/* Contact Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Contact" size={20} className="mr-2 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" size={16} className="text-gray-400" />
                  <a 
                    href={`mailto:${lead.email}`}
                    className="text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={16} className="text-gray-400" />
                  <a 
                    href={`tel:${lead.phone}`}
                    className="text-primary hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Lead Details */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Info" size={20} className="mr-2 text-primary" />
              Lead Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Lead Source
                </label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Globe" size={16} className="text-gray-400" />
                  <span className="text-gray-900">{lead.source}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Assigned To
                </label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="User" size={16} className="text-gray-400" />
                  <span className="text-gray-900">{lead.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes */}
          {lead.notes && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="FileText" size={20} className="mr-2 text-primary" />
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => onEdit(lead)}
              >
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Edit Lead
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConvertConfirm(true)}
                disabled={loading}
              >
                <ApperIcon name="UserPlus" size={16} className="mr-2" />
                Convert to Contact
              </Button>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <Card className="p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Lead</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{lead.name}</strong> from {lead.company}? 
              This will permanently remove the lead and all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Lead"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Convert Confirmation Modal */}
      {showConvertConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <Card className="p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="UserPlus" size={20} className="text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Convert to Contact</h3>
                <p className="text-sm text-gray-500">Move lead to contacts</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to convert <strong>{lead.name}</strong> to a contact? 
              This will move the lead to your contacts section and remove it from leads.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowConvertConfirm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConvert}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                    Converting...
                  </>
                ) : (
                  "Convert to Contact"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeadDetailModal;