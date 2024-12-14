const Customer = require('../models/Customer');  

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
