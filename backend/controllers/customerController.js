const Customer = require('../models/Customer');  
const mongoose = require('mongoose'); 


// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, location, phoneNumber, description, paidStatus, visitStatus, email } = req.body;
    const createdBy = req.user.id; 

    const newCustomer = await Customer.create({ 
      name, 
      location, 
      phoneNumber, 
      description, 
      paidStatus, 
      visitStatus, 
      email,
      createdBy 
    });

    res.status(201).json({
      success: true,
      data: newCustomer,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// Controller to get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    // If the user is a SalesUser, filter by createdBy
    const query = req.user.role === 'SalesUser' ? { createdBy: req.user.id } : {};
    
    const customers = await Customer.find(query)
      .populate('createdBy', 'name email') 
      .exec();

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// Controller to get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// Controller to update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      data: updatedCustomer,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// Controller to delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};
exports.pending = async (req, res) => {
  try {
      const { paidStatus, visitStatus } = req.body;
      const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
          paidStatus,
          visitStatus,
          isPendingApproval: true, // Mark as pending
      }, { new: true });
      
      if (!updatedCustomer) {
          return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      res.status(200).json({
          success: true,
          data: updatedCustomer,
          message: 'Status updated and awaiting approval',
      });
  } catch (err) {
      res.status(400).json({ success: false, error: err.message });
  }
};

exports.aprovePending = async (req, res) => {
  try {
      const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
          isPendingApproval: false, // Approve changes
      }, { new: true });

      if (!updatedCustomer) {
          return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      res.status(200).json({
          success: true,
          data: updatedCustomer,
          message: 'Status approved',
      });
  } catch (err) {
      res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to get visit and payment statuses by period


exports.getStatusCounts = async (req, res) => {
  try {
    const { period = "daily" } = req.query;
    let groupByFormat;
    let startDate = new Date();
    let endDate = new Date();

    // Determine the date range based on the period
    switch (period) {
      case "daily":
        groupByFormat = "%Y-%m-%d";
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999); // End of the day
        break;
      case "weekly":
        groupByFormat = "%Y-%U";
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "monthly":
        groupByFormat = "%Y-%m";
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "yearly":
        groupByFormat = "%Y";
        startDate.setFullYear(startDate.getFullYear() - 1); // Set to one year ago
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid period specified. Use 'daily', 'weekly', 'monthly', or 'yearly'."
        });
    }

    const matchQuery = (period === "daily") 
      ? { createdAt: { $gte: startDate, $lte: endDate } } 
      : { createdAt: { $gte: startDate } };

    if (req.user.role === "SalesUser") {
      matchQuery.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    const statusCounts = await Customer.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: groupByFormat, date: "$createdAt" } },
          visitCount: { $sum: { $cond: ["$visitStatus", 1, 0] } },
          paidCount: { $sum: { $cond: ["$paidStatus", 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // If the period is daily, ensure to fill in the missing days of the week
if (period === "daily") {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    
    // Format to MM-DD
    const formattedDate = `${day.getMonth() + 1}-${day.getDate()}`; // MM-DD format
    const existingData = statusCounts.find(item => {
      // Format the existing data to MM-DD for comparison
      const itemDate = new Date(item._id);
      return `${itemDate.getMonth() + 1}-${itemDate.getDate()}` === formattedDate;
    });

    daysOfWeek.push({
      _id: formattedDate, // Use formattedDate for display
      visitCount: existingData ? existingData.visitCount : 0,
      paidCount: existingData ? existingData.paidCount : 0,
    });
  }
  return res.status(200).json({
    success: true,
    data: daysOfWeek,
  });
}

    res.status(200).json({
      success: true,
      data: statusCounts,
    });
  } catch (err) {
    console.error("Error fetching status counts:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching status counts",
      error: err.message,
    });
  }
};