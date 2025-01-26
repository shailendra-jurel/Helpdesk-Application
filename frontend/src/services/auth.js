export const getPriorityDistribution = async (req, res) => {
  try {
    // Ensure you have tickets in your database
    const priorityDistribution = await Ticket.aggregate([
      { 
        $group: { 
          _id: '$priority', 
          count: { $sum: 1 } 
        } 
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$count'
        }
      }
    ]);

    // Add fallback if no data
    if (priorityDistribution.length === 0) {
      return res.json([
        { name: 'Low', value: 0 },
        { name: 'Medium', value: 0 },
        { name: 'High', value: 0 }
      ]);
    }

    res.json(priorityDistribution);
  } catch (error) {
    console.error('Priority Distribution Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch priority distribution', 
      error: error.toString() 
    });
  }
};

// Apply similar pattern to other methods:
export const getUserPerformance = async (req, res) => {
  try {
    const userPerformance = await Ticket.aggregate([
      { $match: { status: 'closed' } },
      { 
        $group: { 
          _id: '$assignedAgent', 
          ticketsResolved: { $sum: 1 },
          averageResolutionTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } }
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agentDetails'
        }
      },
      {
        $unwind: '$agentDetails'
      },
      {
        $project: {
          user: '$agentDetails.name',
          ticketsResolved: 1,
          averageResolutionTime: { $divide: ['$averageResolutionTime', 86400000] }
        }
      }
    ]);

    // Add fallback for empty results
    if (userPerformance.length === 0) {
      return res.json([]);
    }

    res.json(userPerformance);
  } catch (error) {
    console.error('User Performance Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user performance', 
      error: error.toString() 
    });
  }
};

export const getMissedSLATickets = async (req, res) => {
  try {
    const now = new Date();
    const missedSLATickets = await Ticket.find({
      status: { $ne: 'closed' },
      // Ensure slaBreachDate field exists
      slaBreachDate: { $lt: now }
    })
    .populate('customer', 'name')
    .populate('assignedAgent', 'name')
    .limit(10)
    .sort({ slaBreachDate: 1 });

    res.json(missedSLATickets);
  } catch (error) {
    console.error('Missed SLA Tickets Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch missed SLA tickets', 
      error: error.toString() 
    });
  }
};