import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import taskService from "@/services/api/taskService";
import activityService from "@/services/api/activityService";
import { format } from "date-fns";

const Dashboard = () => {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    tasks: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contacts, deals, tasks, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ]);

      setData({ contacts, deals, tasks, activities });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStats = () => {
    const totalPipelineValue = data.deals.reduce((sum, deal) => sum + deal.value, 0);
    const openDeals = data.deals.filter(deal => deal.stage !== "Closed").length;
    const pendingTasks = data.tasks.filter(task => task.status === "pending").length;
    const recentActivities = data.activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return activityDate >= sevenDaysAgo;
    }).length;

    return {
      totalPipelineValue,
      openDeals,
      totalContacts: data.contacts.length,
      pendingTasks,
      recentActivities
    };
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return data.tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return task.status === "pending" && dueDate >= today && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getRecentActivities = () => {
    return data.activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  const getDealsByStage = () => {
    const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];
    return stages.map(stage => ({
      stage,
      count: data.deals.filter(deal => deal.stage === stage).length,
      value: data.deals.filter(deal => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0)
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = getStats();
  const upcomingTasks = getUpcomingTasks();
  const recentActivities = getRecentActivities();
  const dealsByStage = getDealsByStage();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Welcome to FlowCRM
            </h1>
            <p className="text-primary-100 text-lg">
              Manage your customer relationships and track your sales pipeline
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="Waves" size={64} className="text-white/30" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pipeline Value"
          value={formatCurrency(stats.totalPipelineValue)}
          icon="DollarSign"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Open Deals"
          value={stats.openDeals}
          icon="Target"
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="Users"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="CheckSquare"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Overview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="BarChart3" size={20} className="text-primary" />
                <span>Sales Pipeline Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dealsByStage.length === 0 ? (
                <Empty
                  title="No deals found"
                  description="Start by creating your first deal to see pipeline analytics."
                  icon="Target"
                />
              ) : (
                <div className="space-y-4">
                  {dealsByStage.map((stage) => (
                    <div key={stage.stage} className="flex items-center justify-between p-4 bg-gradient-to-r from-surface/30 to-gray-50/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{stage.count} deals</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(stage.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={20} className="text-primary" />
                  <span>Upcoming Tasks</span>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Plus" size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No upcoming tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.Id} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-surface/20 to-gray-50/20 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due {format(new Date(task.dueDate), "MMM d")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Activity" size={20} className="text-primary" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No recent activities</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentActivities.map((activity) => (
                    <div key={activity.Id} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-surface/20 to-gray-50/20 rounded-lg">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Activity" size={12} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(activity.timestamp), "MMM d 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;