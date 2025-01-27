export const getMissedSLATickets = async (req, res) => {
  try {
    const now = new Date();
    const missedSLATickets = await Ticket.find({
      status: { $ne: 'closed' },
      slaBreachDate: { $exists: true, $ne: null, $lt: now }
    })
    // Rest of the query...
  } catch (error) {
    console.error('Error in getMissedSLATickets:', error);
    res.status(500).json({ 
      message: 'Failed to fetch missed SLA tickets',
      error: error.message 
    });
  }
};