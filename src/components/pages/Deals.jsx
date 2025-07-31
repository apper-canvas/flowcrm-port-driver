import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [viewMode, setViewMode] = useState("pipeline"); // pipeline or list

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      // Add contact names to deals
      const dealsWithContacts = dealsData.map(deal => {
        const contact = contactsData.find(c => c.Id === deal.contactId);
        return {
          ...deal,
          contactName: contact ? contact.name : "Unknown Contact"
        };
      });
      
      setDeals(dealsWithContacts);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load deals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowModal(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };

  const handleSaveDeal = async (formData) => {
    try {
      let savedDeal;
      if (selectedDeal) {
        savedDeal = await dealService.update(selectedDeal.Id, formData);
      } else {
        savedDeal = await dealService.create(formData);
      }
      
      // Add contact name to the saved deal
      const contact = contacts.find(c => c.Id === savedDeal.contactId);
      savedDeal.contactName = contact ? contact.name : "Unknown Contact";
      
      if (selectedDeal) {
        setDeals(prev => prev.map(d => d.Id === selectedDeal.Id ? savedDeal : d));
      } else {
        setDeals(prev => [...prev, savedDeal]);
      }
    } catch (error) {
      throw new Error("Failed to save deal");
    }
  };

  const handleUpdateDeal = async (dealId, updatedData) => {
    try {
      const updatedDeal = await dealService.update(dealId, updatedData);
      const contact = contacts.find(c => c.Id === updatedDeal.contactId);
      updatedDeal.contactName = contact ? contact.name : "Unknown Contact";
      
      setDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d));
      toast.success("Deal updated successfully");
    } catch (error) {
      toast.error("Failed to update deal");
    }
  };

  const filteredDeals = deals.filter(deal => {
    return deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           deal.contactName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTotalPipelineValue = () => {
    return filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your deals • Total Pipeline: <span className="font-semibold text-primary">{formatCurrency(getTotalPipelineValue())}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "pipeline" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("pipeline")}
              className="px-3 py-1.5"
            >
              <ApperIcon name="Kanban" size={16} className="mr-1" />
              Pipeline
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3 py-1.5"
            >
              <ApperIcon name="List" size={16} className="mr-1" />
              List
            </Button>
          </div>
          <Button onClick={handleAddDeal} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search deals..."
        className="max-w-md"
      />

      {/* Content */}
      {filteredDeals.length === 0 ? (
        <Empty
          title="No deals found"
          description={searchQuery 
            ? "Try adjusting your search criteria." 
            : "Get started by creating your first deal."
          }
          actionLabel="Add Deal"
          onAction={handleAddDeal}
          icon="Target"
        />
      ) : viewMode === "pipeline" ? (
        <PipelineBoard
          deals={filteredDeals}
          onUpdateDeal={handleUpdateDeal}
          onAddDeal={handleAddDeal}
        />
      ) : (
        <div className="bg-gradient-to-br from-surface/50 to-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-surface to-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeals.map((deal) => (
                  <tr key={deal.Id} className="hover:bg-gradient-to-r hover:from-surface/30 hover:to-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{deal.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {deal.contactName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(deal.value)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDeal(deal)}
                        className="hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10"
                      >
                        <ApperIcon name="Edit" size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal Modal */}
      <DealModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        deal={selectedDeal}
        contacts={contacts}
        onSave={handleSaveDeal}
      />
    </div>
  );
};

export default Deals;