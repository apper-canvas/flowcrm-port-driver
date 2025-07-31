import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      
      // Add contact names to activities
      const activitiesWithContacts = activitiesData.map(activity => {
        const contact = contactsData.find(c => c.Id === activity.contactId);
        return {
          ...activity,
          contactName: contact ? contact.name : "Unknown Contact"
        };
      });
      
      setActivities(activitiesWithContacts);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" || activity.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getActivityIcon = (type) => {
    const icons = {
      "contact_created": "UserPlus",
      "contact_updated": "UserCheck",
      "deal_created": "Target",
      "deal_updated": "TrendingUp",
      "deal_stage_changed": "ArrowRight",
      "task_created": "CheckSquare",
      "task_completed": "CheckCircle",
      "email_sent": "Mail",
      "call_made": "Phone",
      "meeting_scheduled": "Calendar",
      "note_added": "FileText"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      "contact_created": "success",
      "contact_updated": "primary",
      "deal_created": "success",
      "deal_updated": "secondary",
      "deal_stage_changed": "warning",
      "task_created": "primary",
      "task_completed": "success",
      "email_sent": "info",
      "call_made": "secondary",
      "meeting_scheduled": "warning",
      "note_added": "default"
    };
    return colors[type] || "default";
  };

  const formatActivityDate = (timestamp) => {
    const date = parseISO(timestamp);
    
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d 'at' h:mm a");
    }
  };

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    
    activities.forEach(activity => {
      const date = parseISO(activity.timestamp);
      let groupKey;
      
      if (isToday(date)) {
        groupKey = "Today";
      } else if (isYesterday(date)) {
        groupKey = "Yesterday";
      } else {
        groupKey = format(date, "MMMM d, yyyy");
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });
    
    return groups;
  };

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "contact_created", label: "Contact Created" },
    { value: "contact_updated", label: "Contact Updated" },
    { value: "deal_created", label: "Deal Created" },
    { value: "deal_updated", label: "Deal Updated" },
    { value: "deal_stage_changed", label: "Deal Stage Changed" },
    { value: "task_created", label: "Task Created" },
    { value: "task_completed", label: "Task Completed" },
    { value: "email_sent", label: "Email Sent" },
    { value: "call_made", label: "Call Made" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const groupedActivities = groupActivitiesByDate(
    filteredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">
            Track all interactions and system events
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-surface/50 to-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Activity" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-display font-bold text-gray-900 mt-1">{activities.length}</p>
        </div>
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={16} className="text-primary" />
            <span className="text-sm text-primary">Today</span>
          </div>
          <p className="text-2xl font-display font-bold text-primary mt-1">
            {activities.filter(a => isToday(parseISO(a.timestamp))).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-success/5 to-green-500/5 rounded-xl p-4 border border-success/20">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Target" size={16} className="text-success" />
            <span className="text-sm text-success">Deals</span>
          </div>
          <p className="text-2xl font-display font-bold text-success mt-1">
            {activities.filter(a => a.type.includes("deal")).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl p-4 border border-secondary/20">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" size={16} className="text-secondary" />
            <span className="text-sm text-secondary">Contacts</span>
          </div>
          <p className="text-2xl font-display font-bold text-secondary mt-1">
            {activities.filter(a => a.type.includes("contact")).length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search activities..."
          className="flex-1"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          {activityTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activities Feed */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          description={searchQuery || filterType !== "all" 
            ? "Try adjusting your search or filter criteria." 
            : "Activities will appear here as you use the system."
          }
          icon="Activity"
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
            <div key={dateGroup} className="space-y-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-display font-semibold text-gray-900">{dateGroup}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>
              
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <Card key={activity.Id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* Activity Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          getActivityColor(activity.type) === "success" ? "bg-gradient-to-br from-success/20 to-green-500/20" :
                          getActivityColor(activity.type) === "primary" ? "bg-gradient-to-br from-primary/20 to-secondary/20" :
                          getActivityColor(activity.type) === "warning" ? "bg-gradient-to-br from-warning/20 to-yellow-500/20" :
                          getActivityColor(activity.type) === "secondary" ? "bg-gradient-to-br from-secondary/20 to-accent/20" :
                          getActivityColor(activity.type) === "info" ? "bg-gradient-to-br from-info/20 to-blue-600/20" :
                          "bg-gradient-to-br from-gray-100 to-gray-200"
                        }`}>
                          <ApperIcon 
                            name={getActivityIcon(activity.type)} 
                            size={16} 
                            className={
                              getActivityColor(activity.type) === "success" ? "text-success" :
                              getActivityColor(activity.type) === "primary" ? "text-primary" :
                              getActivityColor(activity.type) === "warning" ? "text-warning" :
                              getActivityColor(activity.type) === "secondary" ? "text-secondary" :
                              getActivityColor(activity.type) === "info" ? "text-info" :
                              "text-gray-500"
                            }
                          />
                        </div>
                        
                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-900 text-sm">{activity.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                  <ApperIcon name="User" size={12} className="text-gray-400" />
                                  <span className="text-xs text-gray-500">{activity.contactName}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ApperIcon name="Clock" size={12} className="text-gray-400" />
                                  <span className="text-xs text-gray-500">{formatActivityDate(activity.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={getActivityColor(activity.type)} className="ml-4 flex-shrink-0">
                              {activity.type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;