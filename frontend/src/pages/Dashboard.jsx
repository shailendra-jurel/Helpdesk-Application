import React, { useState, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ticketService from "../services/ticketService";
import {
  LucideTicket,
  LucidePlus,
  LucideClipboardList,
  LucideBarChart3,
  LucideAlertTriangle,
  LucideSearch,
  LucideChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Card = ({ children, className = "", title, ...props }) => {
  Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string
  };

  return (
  <div
    className={`
      bg-white dark:bg-gray-800 rounded-2xl shadow-lg
      hover:shadow-xl transition-all duration-300
      border border-gray-200 dark:border-gray-700
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
  );
};
      
const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) => {
  Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
    className: PropTypes.string,
    icon: PropTypes.elementType,
  };
  
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary:
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600",
    outline:
      "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-lg flex items-center justify-center
        space-x-2 font-medium transition-all duration-300
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};
const Badge = ({ children, status = "default", className = "" }) => {
  const statusColors = {
    default:
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-progress":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    closed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    critical: "bg-red-500 text-white",
  };

  return (
    <span
      className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${statusColors[status]} ${className}
      `}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  status: PropTypes.oneOf(['default', 'open', 'in-progress', 'closed', 'critical']),
  className: PropTypes.string,
};


const Dashboard = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [dashboardData, setDashboardData] = useState({
    ticketStats: {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      critical: 0,
    },
    recentTickets: [],
    priorityDistribution: [
      { name: 'Low', value: 0 },
      { name: 'Medium', value: 0 },
      { name: 'High', value: 0 }
    ],
    ticketTrends: [],
    userPerformance: [],
    missedSLATickets: [],
    isLoading: true,
    error: null,
  });


  const [uiState, setUiState] = useState({
    filterStatus: "all",
    searchQuery: "",
  });

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [
        tickets,
        priorityData,
        performanceData,
        missedSLATickets,
      ] = await Promise.all([
        ticketService.getTickets(),
        ticketService.getPriorityDistribution(),
        ticketService.getUserPerformance(),
        ticketService.getMissedSLATickets(),
      ]);

      // Set default values if data is undefined
      setDashboardData({
        ticketStats: {
          total: tickets?.length || 0,
          open: tickets?.filter(t => t.status === 'open').length || 0,
          inProgress: tickets?.filter(t => t.status === 'in-progress').length || 0,
          closed: tickets?.filter(t => t.status === 'closed').length || 0,
          critical: tickets?.filter(t => t.priority === 'critical').length || 0,
        },
        recentTickets: tickets || [],
        priorityDistribution: priorityData || [],
        userPerformance: performanceData || [],
        missedSLATickets: missedSLATickets || [],
      });
    } catch (error) {
      console.error('Dashboard Data Fetch Error:', error);
    }
  };

  if (user) fetchDashboardData();
}, [user]);

  const filteredTickets = useMemo(
      () =>
        dashboardData.recentTickets.filter(
          (ticket) =>
            (uiState.filterStatus === "all" || ticket.status === uiState.filterStatus) &&
            ticket.title.toLowerCase().includes(uiState.searchQuery.toLowerCase())
        ),
      [dashboardData.recentTickets, uiState.filterStatus, uiState.searchQuery]
    );
  
    const PriorityDistributionChart = () => {
      const COLORS = ["#10B981", "#F59E0B", "#EF4444"];
      return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={dashboardData.priorityDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
            >
              {dashboardData.priorityDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    };
  
    // Render loading state
    if (dashboardData.isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      );
    }
  
    // Render error state
    if (dashboardData.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <p className="text-red-500 mb-4">{dashboardData.error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry Loading
            </Button>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Dashboard
          </h1>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              icon={LucideSearch}
              onClick={() => navigate("/search")}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6" title="Ticket Overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{
                  label: "Total Tickets",
                  value: dashboardData.ticketStats.total,
                  icon: LucideTicket,
                  color: "text-blue-500",
                },
                {
                  label: "Open",
                  value: dashboardData.ticketStats.open,
                  icon: LucideClipboardList,
                  color: "text-green-500",
                },
                {
                  label: "In Progress",
                  value: dashboardData.ticketStats.inProgress,
                  icon: LucideBarChart3,
                  color: "text-yellow-500",
                },
                {
                  label: "Critical",
                  value: dashboardData.ticketStats.critical,
                  icon: LucideAlertTriangle,
                  color: "text-red-500",
                },].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`mx-auto w-12 h-12 ${stat.color} mb-2`}>
                    <stat.icon className="w-full h-full" />
                  </div>
                  <h3 className="font-bold text-lg">{stat.value}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6" title="Quick Actions">
              <div className="space-y-4">
                <Button
                  className="w-full"
                  icon={LucidePlus}
                  onClick={() => navigate("/tickets/create")}
                >
                  Create New Ticket
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={LucideTicket}
                  onClick={() => navigate("/tickets")}
                >
                  View All Tickets
                </Button>
              </div>
            </Card>

            <Card className="p-6" title="Priority Distribution">
              <PriorityDistributionChart />
            </Card>
          </div>
        </div>

        {dashboardData.missedSLATickets.length > 0 && (
          <Card className="mt-6 p-6" title="Missed SLA Tickets">
            <div className="divide-y">
              {dashboardData.missedSLATickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {ticket.title}
                    </h3>
                    <Badge status="critical" className="mt-1">
                      Missed SLA
                    </Badge>
                  </div>
                  <LucideChevronRight
                    className="text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="mt-6 p-6" title="Recent Tickets">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="
                    pl-10 pr-3 py-2 border rounded-lg w-64
                    dark:bg-gray-800 dark:border-gray-700
                    dark:text-white
                  "
                  value={uiState.searchQuery}
                  onChange={(e) =>
                    setUiState((prev) => ({
                      ...prev,
                      searchQuery: e.target.value,
                    }))
                  }
                />
              </div>
              <select
                className="
                  px-3 py-2 border
                  rounded-lg
                  dark:bg-gray-800 dark:border-gray-700
                  dark:text-white
                "
                value={uiState.filterStatus}
                onChange={(e) =>
                  setUiState((prev) => ({
                    ...prev,
                    filterStatus: e.target.value,
                  }))
                }
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No tickets found
            </p>
          ) : (
            <div className="divide-y">
              {filteredTickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/tickets/${ticket._id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex justify-between items-center py-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {ticket.title}
                      </h3>
                            <Badge status={
                            ticket.status === 'Active' ? 'open' : 
                            ticket.status === 'In Progress' ? 'in-progress' : 
                            ticket.status.toLowerCase()
                            } className="mt-1">
                            {ticket.status}
                            </Badge>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

const generateTicketTrends = (stats) => [
  { name: "Week 1", tickets: stats.total },
  { name: "Week 2", tickets: stats.total * 1.2 },
  { name: "Week 3", tickets: stats.total * 0.9 },
  { name: "Week 4", tickets: stats.total * 1.1 },
];

export default Dashboard;
