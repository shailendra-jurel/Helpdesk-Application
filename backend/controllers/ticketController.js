// backend/controllers/ticketController.js
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const ticket = new Ticket({
      title,
      description,
      customer: req.user._id,
      status: 'open',
      priority: priority || 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    const createdTicket = await ticket.save();
    res.status(201).json(createdTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate('customer', 'name')
      .sort({ updatedAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name')
      .populate('notes.user', 'name');

    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      ticket.status = req.body.status || ticket.status;

      const updatedTicket = await ticket.save();
      res.json(updatedTicket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addTicketNote = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      const note = {
        user: req.user._id,
        text: req.body.text,
        attachment: req.body.attachment || null
      };

      ticket.notes.push(note);
      await ticket.save();

      const updatedTicket = await Ticket.findById(req.params.id)
        .populate('notes.user', 'name');

      res.status(201).json(updatedTicket);
    } else {
      res.status(404).json({ message: 'Ticket not found , ticket Controller' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      await ticket.deleteOne();
      res.json({ message: 'Ticket removed , ticket Controller' });
    } else {
      res.status(404).json({ message: 'Ticket not found  ticket Controller' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMissedSLATickets = async (req, res) => {
  try {
    const now = new Date();
    const missedSLATickets = await Ticket.find({
      status: { $ne: 'closed' },
      slaBreachDate: { $lt: now }
    })
    .populate('customer', 'name')
    .populate('assignedAgent', 'name')
    .limit(10)
    .sort({ slaBreachDate: 1 });
    console.log('Missed SLA tickets:', missedSLATickets);

    res.json(missedSLATickets);
  } catch (error) {
    console.error('Error in getMissedSLATickets:', error);

    res.status(500).json({ message: 'Failed to fetch missed SLA tickets' });
  }
};


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
          averageResolutionTime: { $divide: ['$averageResolutionTime', 86400000] } // Convert to days
        }
      }
    ]);
     // Add fallback for empty results
     if (userPerformance.length === 0) {
      return res.json([]);
    }
    console.log('getUserPerformance:', userPerformance);


    res.json(userPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user performance' });
  }
};
export const getPriorityDistribution = async (req, res) => {
  try {
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
    console.log('Priority Distribution:', priorityDistribution);

    res.json(priorityDistribution);
  } catch (error) {
    console.error('Error in getPriorityDistribution:', error);

    res.status(500).json({ message: 'Failed to fetch priority distribution' });
  }
};

export const getTicketStats = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { 
              $group: { 
                _id: '$status', 
                count: { $sum: 1 } 
              } 
            }
          ],
          byPriority: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 }
              }
            }
          ]
        }
      },
      {
        $project: {
          total: { $arrayElemAt: ['$total.count', 0] },
          statuses: {
            $arrayToObject: {
              $map: {
                input: '$byStatus',
                as: 'status',
                in: { k: '$$status._id', v: '$$status.count' }
              }
            }
          },
          priorities: {
            $arrayToObject: {
              $map: {
                input: '$byPriority',
                as: 'priority',
                in: { k: '$$priority._id', v: '$$priority.count' }
              }
            }
          }
        }
      }
    ]);

    console.log('Get stats:', stats);


    const result = stats[0] || {
      total: 0,
      statuses: { open: 0, 'in-progress': 0, closed: 0 },
      priorities: { low: 0, medium: 0, high: 0, critical: 0 }
    };

    res.json(result);
  } catch (error) {
    console.error('Error in getTicketStats:', error);

    res.status(500).json({ message: 'Failed to fetch ticket stats' });
  }
};