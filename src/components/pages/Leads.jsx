import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import LeadModal from "@/components/organisms/LeadModal";
import LeadDetailModal from "@/components/organisms/LeadDetailModal";
import { leadService } from "@/services/api/leadService";
import { format } from "date-fns";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  
  // Modal states
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAll();
      setLeads(data);
      if (data.length > 0 && !selectedLead) {
        setSelectedLead(data[0]);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading leads:", err);
      setError("Failed to load leads. Please try again.");
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== "All") {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setShowLeadModal(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowLeadModal(true);
    setShowDetailModal(false);
  };

  const handleLeadSaved = (savedLead) => {
    if (editingLead) {
      // Update existing lead
      setLeads(prev => prev.map(lead => 
        lead.Id === savedLead.Id ? savedLead : lead
      ));
      if (selectedLead && selectedLead.Id === savedLead.Id) {
        setSelectedLead(savedLead);
      }
    } else {
      // Add new lead
      setLeads(prev => [savedLead, ...prev]);
      setSelectedLead(savedLead);
    }
  };

  const handleLeadDeleted = (leadId) => {
    setLeads(prev => prev.filter(lead => lead.Id !== leadId));
    if (selectedLead && selectedLead.Id === leadId) {
      const remaining = leads.filter(lead => lead.Id !== leadId);
      setSelectedLead(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleLeadConverted = (leadId, contact) => {
    setLeads(prev => prev.filter(lead => lead.Id !== leadId));
    if (selectedLead && selectedLead.Id === leadId) {
      const remaining = leads.filter(lead => lead.Id !== leadId);
      setSelectedLead(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
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

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-gray-500';
    }
  };

  const uniqueStatuses = [...new Set(leads.map(lead => lead.status))];
  const uniqueSources = [...new Set(leads.map(lead => lead.source))];

  if (loading) {
    return <Loading message="Loading leads..." />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadLeads}
      />
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row bg-surface">
      {/* Lead List - Left Column (40%) */}
      <div className="lg:w-2/5 flex flex-col border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="UserCheck" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  Leads
                </h1>
                <p className="text-sm text-gray-500">
                  {leads.length} total leads
                </p>
              </div>
            </div>
            <Button onClick={handleAddLead}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Lead
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <div className="flex space-x-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1"
              >
                <option value="All">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
              <Select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="flex-1"
              >
                <option value="All">All Sources</option>
                {uniqueSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto">
          {filteredLeads.length === 0 ? (
            <div className="p-6">
              <Empty
                icon="UserCheck"
                title="No leads found"
                description={
                  searchTerm || statusFilter !== "All" || sourceFilter !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first lead"
                }
                action={
                  <Button onClick={handleAddLead}>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Lead
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredLeads.map((lead) => (
                <Card
                  key={lead.Id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedLead && selectedLead.Id === lead.Id
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleLeadSelect(lead)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {lead.name}
                    </h3>
                    <Badge variant={getStatusVariant(lead.status)} size="sm">
                      {lead.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {lead.company}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <ApperIcon name="Globe" size={12} className="mr-1" />
                      {lead.source}
                    </span>
                    <span className={`flex items-center ${getPriorityColor(lead.priority)}`}>
                      <ApperIcon name="Flag" size={12} className="mr-1" />
                      {lead.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(lead);
                      }}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lead Details - Right Column (60%) */}
      <div className="lg:w-3/5 flex flex-col bg-surface">
        {selectedLead ? (
          <>
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <ApperIcon name="UserCheck" size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-semibold text-gray-900">
                      {selectedLead.name}
                    </h2>
                    <p className="text-gray-600">{selectedLead.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(selectedLead.status)}>
                    {selectedLead.status}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditLead(selectedLead)}
                  >
                    <ApperIcon name="Edit" size={14} className="mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Details Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="Contact" size={20} className="mr-2 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <a 
                      href={`mailto:${selectedLead.email}`}
                      className="flex items-center space-x-2 text-primary hover:underline"
                    >
                      <ApperIcon name="Mail" size={16} />
                      <span>{selectedLead.email}</span>
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone
                    </label>
                    <a 
                      href={`tel:${selectedLead.phone}`}
                      className="flex items-center space-x-2 text-primary hover:underline"
                    >
                      <ApperIcon name="Phone" size={16} />
                      <span>{selectedLead.phone}</span>
                    </a>
                  </div>
                </div>
              </Card>

              {/* Lead Details */}
              <Card className="p-6">
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
                      <span className="text-gray-900">{selectedLead.source}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Priority Level
                    </label>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Flag" size={16} className={getPriorityColor(selectedLead.priority)} />
                      <span className="text-gray-900">{selectedLead.priority}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Assigned To
                    </label>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="User" size={16} className="text-gray-400" />
                      <span className="text-gray-900">{selectedLead.assignedTo || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Created Date
                    </label>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                      <span className="text-gray-900">
                        {format(new Date(selectedLead.createdAt), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {selectedLead.notes && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ApperIcon name="FileText" size={20} className="mr-2 text-primary" />
                    Notes
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.notes}
                  </p>
                </Card>
              )}

              {/* Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="Zap" size={20} className="mr-2 text-primary" />
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleEditLead(selectedLead)}
                  >
                    <ApperIcon name="Edit" size={16} className="mr-2" />
                    Edit Lead
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(selectedLead)}
                  >
                    <ApperIcon name="UserPlus" size={16} className="mr-2" />
                    Convert to Contact
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.open(`mailto:${selectedLead.email}`, '_blank')}
                  >
                    <ApperIcon name="Mail" size={16} className="mr-2" />
                    Send Email
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.open(`tel:${selectedLead.phone}`, '_blank')}
                  >
                    <ApperIcon name="Phone" size={16} className="mr-2" />
                    Call
                  </Button>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Empty
              icon="UserCheck"
              title="No lead selected"
              description="Select a lead from the list to view details"
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        lead={editingLead}
        onSave={handleLeadSaved}
      />

      <LeadDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        lead={selectedLead}
        onEdit={handleEditLead}
        onDelete={handleLeadDeleted}
        onConvert={handleLeadConverted}
      />
    </div>
  );
};

export default Leads;