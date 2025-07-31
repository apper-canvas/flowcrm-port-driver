import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ContactRow from "@/components/molecules/ContactRow";
import ContactModal from "@/components/organisms/ContactModal";
import ContactDetailModal from "@/components/organisms/ContactDetailModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleSaveContact = async (formData) => {
    try {
      if (selectedContact) {
        const updatedContact = await contactService.update(selectedContact.Id, formData);
        setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? updatedContact : c));
      } else {
        const newContact = await contactService.create(formData);
        setContacts(prev => [...prev, newContact]);
      }
    } catch (error) {
      throw new Error("Failed to save contact");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(c => c.Id !== contactId));
      toast.success("Contact deleted successfully");
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleViewDetails = (contact) => {
    setSelectedContactId(contact.Id);
    setShowDetailModal(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" || contact.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and leads</p>
        </div>
        <Button onClick={handleAddContact} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search contacts..."
          className="flex-1"
        />
        <div className="flex space-x-2">
          <Button
            variant={filterType === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterType("all")}
          >
            All
          </Button>
          <Button
            variant={filterType === "lead" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterType("lead")}
          >
            Leads
          </Button>
          <Button
            variant={filterType === "customer" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterType("customer")}
          >
            Customers
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description={searchQuery || filterType !== "all" 
            ? "Try adjusting your search or filter criteria." 
            : "Get started by adding your first contact."
          }
          actionLabel="Add Contact"
          onAction={handleAddContact}
          icon="Users"
        />
      ) : (
        <div className="bg-gradient-to-br from-surface/50 to-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-surface to-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <ContactRow
                    key={contact.Id}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        contact={selectedContact}
        onSave={handleSaveContact}
      />

      {/* Contact Detail Modal */}
      <ContactDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        contactId={selectedContactId}
        onEdit={handleEditContact}
      />
    </div>
  );
};

export default Contacts;