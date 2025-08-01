import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CompanyModal from "@/components/organisms/CompanyModal";
import CompanyDetailModal from "@/components/organisms/CompanyDetailModal";
import companyService from "@/services/api/companyService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveCompany = async (formData) => {
    try {
      let updatedCompany;
      if (isEditing && selectedCompany) {
        updatedCompany = await companyService.update(selectedCompany.Id, formData);
        if (updatedCompany) {
          setCompanies(prev =>
            prev.map(company =>
              company.Id === selectedCompany.Id ? updatedCompany : company
            )
          );
          toast.success("Company updated successfully!");
        }
      } else {
        const newCompany = await companyService.create(formData);
        if (newCompany) {
          setCompanies(prev => [newCompany, ...prev]);
          toast.success("Company created successfully!");
        }
      }
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save company. Please try again.");
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        const success = await companyService.delete(companyId);
        if (success) {
          setCompanies(prev => prev.filter(company => company.Id !== companyId));
          toast.success("Company deleted successfully!");
        }
      } catch (error) {
        toast.error("Failed to delete company. Please try again.");
      }
    }
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowDetailModal(true);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.website?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || company.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage your company database</p>
        </div>
        <Button
          onClick={handleAddCompany}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search companies..."
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="customer">Customer</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </div>

      {/* Companies List */}
      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description={searchTerm || filterType !== "all" 
            ? "Try adjusting your search or filter criteria." 
            : "Get started by adding your first company."
          }
          icon="Building2"
          action={
            <Button onClick={handleAddCompany}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Company
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-surface to-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.Id} className="hover:bg-gradient-to-r hover:from-surface/30 hover:to-transparent transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Building2" size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{company.name}</div>
                          {company.email && (
                            <div className="text-sm text-gray-500">{company.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {company.website ? (
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
                        >
                          <ApperIcon name="ExternalLink" size={14} />
                          <span>{company.website}</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No website</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {company.address ? (
                          <div className="max-w-xs truncate" title={company.address}>
                            {company.address}
                          </div>
                        ) : (
                          <span className="text-gray-400">No address</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.type === "customer"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {company.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {company.createdAt ? format(new Date(company.createdAt), "MMM d, yyyy") : "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(company)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit Company"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.Id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Company"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CompanyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        company={selectedCompany}
        onSave={handleSaveCompany}
      />

      <CompanyDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        companyId={selectedCompany?.Id}
        onEdit={handleEditCompany}
      />
    </div>
  );
};

export default Companies;