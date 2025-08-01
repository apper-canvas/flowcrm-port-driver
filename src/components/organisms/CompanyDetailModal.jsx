import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { format } from "date-fns";
import companyService from "@/services/api/companyService";
import dealService from "@/services/api/dealService";
import taskService from "@/services/api/taskService";
import activityService from "@/services/api/activityService";

const CompanyDetailModal = ({ isOpen, onClose, companyId, onEdit }) => {
  const [company, setCompany] = useState(null);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && companyId) {
      loadCompanyDetails();
    }
  }, [isOpen, companyId]);

  const loadCompanyDetails = async () => {
    setLoading(true);
    try {
      const [companyData, dealsData, tasksData, activitiesData] = await Promise.all([
        companyService.getById(companyId),
        dealService.getByContactId ? dealService.getByContactId(companyId) : [],
        taskService.getByContactId ? taskService.getByContactId(companyId) : [],
        activityService.getByContactId ? activityService.getByContactId(companyId) : []
      ]);

      setCompany(companyData);
      setDeals(dealsData || []);
      setTasks(tasksData || []);
      setActivities(activitiesData || []);
    } catch (error) {
      console.error("Error loading company details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTypeVariant = (type) => {
    return type === "customer" ? "success" : "primary";
  };

  const getStageVariant = (stage) => {
    const variants = {
      "Prospecting": "lead",
      "Qualification": "qualified", 
      "Proposal": "proposal",
      "Negotiation": "negotiation",
      "Closed Won": "success",
      "Closed Lost": "error"
    };
    return variants[stage] || "default";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative bg-gradient-to-br from-surface/50 to-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {loading ? (
            <div className="p-8">
              <Loading />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="Building2" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-gray-900">
                      {company?.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getTypeVariant(company?.type)}>
                        {company?.type}
                      </Badge>
                      {company?.website && (
                        <>
                          <span className="text-gray-500">•</span>
                          <a
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
                          >
                            <ApperIcon name="ExternalLink" size={12} />
                            <span>{company.website}</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(company)}>
                    <ApperIcon name="Edit" size={16} className="mr-2" />
                    Edit
                  </Button>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ApperIcon name="X" size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "info", label: "Information", icon: "Info" },
                    { id: "deals", label: "Deals", icon: "Target", count: deals.length },
                    { id: "tasks", label: "Tasks", icon: "CheckSquare", count: tasks.length },
                    { id: "activities", label: "Activities", icon: "Activity", count: activities.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ApperIcon name={tab.icon} size={16} />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                            {tab.count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {activeTab === "info" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{company?.email || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{company?.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Website</label>
                          {company?.website ? (
                            <a
                              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 flex items-center space-x-1"
                            >
                              <ApperIcon name="ExternalLink" size={14} />
                              <span>{company.website}</span>
                            </a>
                          ) : (
                            <p className="text-gray-900">Not provided</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Address</label>
                          <p className="text-gray-900">{company?.address || "Not provided"}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Activity Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created</label>
                          <p className="text-gray-900">
                            {company?.createdAt ? format(new Date(company.createdAt), "MMM d, yyyy") : "Unknown"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Activity</label>
                          <p className="text-gray-900">
                            {company?.lastActivity ? format(new Date(company.lastActivity), "MMM d, yyyy") : "No activity"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Total Deals</label>
                          <p className="text-gray-900">{deals.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "deals" && (
                  <div className="space-y-4">
                    {deals.length === 0 ? (
                      <Empty
                        title="No deals found"
                        description="This company doesn't have any deals yet."
                        icon="Target"
                      />
                    ) : (
                      deals.map((deal) => (
                        <Card key={deal.Id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{deal.title || deal.Name}</h4>
                                <div className="flex items-center space-x-4 mt-2">
                                  <Badge variant={getStageVariant(deal.stage)}>
                                    {deal.stage}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    Created {format(new Date(deal.createdAt), "MMM d, yyyy")}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                  {formatCurrency(deal.value)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "tasks" && (
                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <Empty
                        title="No tasks found"
                        description="This company doesn't have any tasks yet."
                        icon="CheckSquare"
                      />
                    ) : (
                      tasks.map((task) => (
                        <Card key={task.Id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`font-medium ${
                                  task.status === "completed" ? "text-gray-500 line-through" : "text-gray-900"
                                }`}>
                                  {task.title || task.Name}
                                </h4>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-2">
                                  <Badge variant={task.status === "completed" ? "success" : "default"}>
                                    {task.status}
                                  </Badge>
                                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <ApperIcon name="Calendar" size={14} />
                                    <span>Due {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "activities" && (
                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <Empty
                        title="No activities found"
                        description="No activities have been recorded for this company yet."
                        icon="Activity"
                      />
                    ) : (
                      activities.map((activity) => (
                        <Card key={activity.Id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <ApperIcon name="Activity" size={16} className="text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900">{activity.description}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;