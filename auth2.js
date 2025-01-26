useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          tickets,
          ticketStats,
          priorityData,
          performanceData,
          missedSLATickets,
        ] = await Promise.all([
          ticketService.getTickets(),
          ticketService.getTicketStats(),
          ticketService.getPriorityDistribution(),
          ticketService.getUserPerformance(),
          ticketService.getMissedSLATickets(),
        ]);
  console.log("Fetched tickets:", tickets);  
        const relevantTickets = user?.role === "customer"
          ? tickets.filter((ticket) => ticket.userId === user._id)
          : tickets;

          const processResult = (result) => 
            result.status === 'fulfilled' ? result.value : [];
    
          const processedTickets = processResult(tickets);
          const processedPriorityData = processResult(priorityData);
          const processedPerformanceData = processResult(performanceData);
          const processedMissedSLATickets = processResult(missedSLATickets);
    
  
        const stats = {
          total: relevantTickets.length,
          open: relevantTickets.filter((t) => t.status.toLowerCase() === "open").length,
          inProgress: relevantTickets.filter((t) => t.status.toLowerCase() === "in-progress").length,
          closed: relevantTickets.filter((t) => t.status.toLowerCase() === "closed").length,
          critical: relevantTickets.filter((t) => t.priority === "critical").length,
        };
  
        setDashboardData({
          ticketStats: stats, // Use the calculated stats
          recentTickets: relevantTickets
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5),
          ticketTrends: generateTicketTrends(stats),
          priorityDistribution: priorityData,
          userPerformance: performanceData,
          missedSLATickets: missedSLATickets,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setDashboardData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to fetch dashboard data",
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
          missedSLATickets: [],
        }));
      }
    };
  
    fetchDashboardData();
  }, [user]);