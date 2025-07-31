import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endOfMonth, endOfQuarter, endOfYear, format, isAfter, isBefore, isPast, isToday, startOfMonth, startOfQuarter, startOfYear, subMonths } from "date-fns";
import ReactApexChart from "react-apexcharts";
import contactService from "@/services/api/contactService";
import taskService from "@/services/api/taskService";
import dealService from "@/services/api/dealService";
import { leadService } from "@/services/api/leadService";
import activityService from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    tasks: [],
    activities: [],
    leads: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("thisMonth");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contacts, deals, tasks, activities, leads] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll(),
        leadService.getAll()
      ]);

      setData({ contacts, deals, tasks, activities, leads });
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

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "quarter":
        return { start: startOfQuarter(now), end: endOfQuarter(now) };
      case "year":
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const getFilteredDeals = () => {
    const { start, end } = getDateRangeFilter();
    return data.deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      return isAfter(dealDate, start) && isBefore(dealDate, end);
    });
  };

  const getPreviousRangeDeals = () => {
    const now = new Date();
    let start, end;
    
    switch (dateRange) {
      case "thisMonth":
        const lastMonth = subMonths(now, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      case "lastMonth":
        const twoMonthsAgo = subMonths(now, 2);
        start = startOfMonth(twoMonthsAgo);
        end = endOfMonth(twoMonthsAgo);
        break;
      case "quarter":
        const lastQuarter = subMonths(now, 3);
        start = startOfQuarter(lastQuarter);
        end = endOfQuarter(lastQuarter);
        break;
      case "year":
        const lastYear = new Date(now.getFullYear() - 1, 0, 1);
        start = startOfYear(lastYear);
        end = endOfYear(lastYear);
        break;
      default:
        const prevMonth = subMonths(now, 1);
        start = startOfMonth(prevMonth);
        end = endOfMonth(prevMonth);
    }

    return data.deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      return isAfter(dealDate, start) && isBefore(dealDate, end);
    });
  };

  const getAnalytics = () => {
    const currentDeals = getFilteredDeals();
    const previousDeals = getPreviousRangeDeals();
    
    // Revenue calculations
    const currentRevenue = currentDeals
      .filter(deal => deal.stage === "Closed" || deal.stage === "Won")
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const previousRevenue = previousDeals
      .filter(deal => deal.stage === "Closed" || deal.stage === "Won")
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue * 100)
      : currentRevenue > 0 ? 100 : 0;

    // Active deals
    const activeDeals = data.deals.filter(deal => 
      deal.stage !== "Closed" && deal.stage !== "Won" && deal.stage !== "Lost"
    );
    const activeDealValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);

    // Conversion rate
    const totalLeads = data.leads.length;
    const convertedLeads = currentDeals.length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100) : 0;

    // Tasks due today
    const today = new Date();
    const tasksDueToday = data.tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isToday(dueDate) && task.status === "pending";
    });
    
    const overdueTasks = data.tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isPast(dueDate) && !isToday(dueDate) && task.status === "pending";
    });

    return {
      currentRevenue,
      revenueChange,
      activeDeals: activeDeals.length,
      activeDealValue,
      conversionRate,
      tasksDueToday: tasksDueToday.length,
      overdueTasks: overdueTasks.length
    };
  };

  const getRevenueChartData = () => {
    const months = [];
    const revenues = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthRevenue = data.deals
        .filter(deal => {
          const dealDate = new Date(deal.createdAt);
          return (deal.stage === "Closed" || deal.stage === "Won") &&
                 isAfter(dealDate, monthStart) && isBefore(dealDate, monthEnd);
        })
        .reduce((sum, deal) => sum + deal.value, 0);
      
      months.push(format(date, "MMM"));
      revenues.push(monthRevenue);
    }
    
    return { months, revenues };
  };

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case "activeDeals":
        navigate("/deals");
        break;
      case "tasks":
        navigate("/tasks");
        break;
      case "leads":
        navigate("/leads");
        break;
      case "contacts":
        navigate("/contacts");
        break;
      default:
        break;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const analytics = getAnalytics();
  const { months, revenues } = getRevenueChartData();

return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Sales Analytics Dashboard
            </h1>
            <p className="text-primary-100 text-lg">
              Track your sales performance and key business metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 rounded-lg p-1">
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-0 text-white focus:ring-white/20 min-w-[140px]"
              >
                <option value="thisMonth" className="text-gray-900">This Month</option>
                <option value="lastMonth" className="text-gray-900">Last Month</option>
                <option value="quarter" className="text-gray-900">Quarter</option>
                <option value="year" className="text-gray-900">Year</option>
              </Select>
            </div>
            <div className="hidden md:block">
              <ApperIcon name="TrendingUp" size={64} className="text-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="cursor-pointer transform hover:scale-105 transition-transform">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(analytics.currentRevenue)}
            icon="DollarSign"
            trend={analytics.revenueChange >= 0 ? "up" : "down"}
            trendValue={`${analytics.revenueChange >= 0 ? '+' : ''}${analytics.revenueChange.toFixed(1)}%`}
          />
        </div>
        
        <div 
          className="cursor-pointer transform hover:scale-105 transition-transform"
          onClick={() => handleCardClick("activeDeals")}
        >
          <StatCard
            title="Active Deals"
            value={`${analytics.activeDeals} (${formatCurrency(analytics.activeDealValue)})`}
            icon="Target"
            trend="up"
            description="Click to view pipeline"
          />
        </div>
        
        <div className="cursor-pointer transform hover:scale-105 transition-transform">
          <StatCard
            title="Conversion Rate"
            value={`${analytics.conversionRate.toFixed(1)}%`}
            icon="TrendingUp"
            trend={analytics.conversionRate > 20 ? "up" : "down"}
            description="Leads to deals"
          />
        </div>
        
        <div 
          className="cursor-pointer transform hover:scale-105 transition-transform"
          onClick={() => handleCardClick("tasks")}
        >
          <StatCard
            title="Tasks Due Today"
            value={analytics.tasksDueToday}
            icon="Clock"
            trend={analytics.overdueTasks > 0 ? "down" : "up"}
            trendValue={analytics.overdueTasks > 0 ? `${analytics.overdueTasks} overdue` : "On track"}
            description="Click to manage tasks"
          />
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              <span>Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenues.some(r => r > 0) ? (
              <ReactApexChart
                options={{
                  chart: {
                    type: 'area',
                    toolbar: { show: false },
                    sparkline: { enabled: false }
                  },
                  dataLabels: { enabled: false },
                  stroke: {
                    curve: 'smooth',
                    colors: ['#0369a1']
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 1,
                      colorStops: [
                        { offset: 0, color: '#0369a1', opacity: 0.4 },
                        { offset: 100, color: '#0891b2', opacity: 0.1 }
                      ]
                    }
                  },
                  xaxis: {
                    categories: months,
                    labels: { style: { colors: '#6b7280' } }
                  },
                  yaxis: {
                    labels: {
                      style: { colors: '#6b7280' },
                      formatter: (value) => formatCurrency(value)
                    }
                  },
                  grid: { borderColor: '#e5e7eb' },
                  tooltip: {
                    y: { formatter: (value) => formatCurrency(value) }
                  }
                }}
                series={[{ name: 'Revenue', data: revenues }]}
                type="area"
                height={300}
              />
            ) : (
              <Empty
                title="No revenue data"
                description="Start closing deals to see revenue trends."
                icon="TrendingUp"
              />
            )}
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="PieChart" size={20} className="text-primary" />
              <span>Pipeline Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.deals.length === 0 ? (
              <Empty
                title="No deals found"
                description="Start by creating your first deal to see pipeline analytics."
                icon="Target"
              />
            ) : (
              <ReactApexChart
                options={{
                  chart: { type: 'donut' },
                  labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'],
                  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                  legend: { position: 'bottom' },
                  dataLabels: {
                    formatter: (val) => `${val.toFixed(1)}%`
                  },
                  tooltip: {
                    y: { formatter: (value, { seriesIndex }) => `${value} deals` }
                  }
                }}
                series={[
                  data.deals.filter(d => d.stage === 'Prospecting').length,
                  data.deals.filter(d => d.stage === 'Qualification').length,
                  data.deals.filter(d => d.stage === 'Proposal').length,
                  data.deals.filter(d => d.stage === 'Negotiation').length,
                  data.deals.filter(d => d.stage === 'Closed Won' || d.stage === 'Closed').length
                ]}
                type="donut"
                height={300}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Zap" size={20} className="text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/leads")}
              >
                <ApperIcon name="UserPlus" size={16} className="mr-2" />
                Add New Lead
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/deals")}
              >
                <ApperIcon name="Target" size={16} className="mr-2" />
                Create Deal
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/tasks")}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Task
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/contacts")}
              >
                <ApperIcon name="Users" size={16} className="mr-2" />
                Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Activity" size={20} className="text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.activities.length === 0 ? (
              <Empty
                title="No recent activity"
                description="Activity will appear here as you use the CRM."
                icon="Activity"
              />
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {data.activities
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .slice(0, 8)
                  .map((activity) => (
                    <div key={activity.Id} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-surface/30 to-gray-50/30 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Activity" size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">{activity.description}</p>
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
  );
};

export default Dashboard;