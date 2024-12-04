const Customer = require('../models/Customer');  

exports.createCustomer = async (req, res) => {
  try {
    const { location, phoneNumber, description, paidStatus, visitStatus, email } = req.body;

    // Create a new customer
    const newCustomer = await Customer.create({ 
      location, 
      phoneNumber, 
      description, 
      paidStatus, 
      visitStatus, 
      email 
    });

    // Respond with the new customer data
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
    const customers = await Customer.find();
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
