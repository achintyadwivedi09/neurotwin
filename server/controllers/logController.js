const LogModel = require('../models/logModel');

// @desc    Create a daily log
// @route   POST /api/logs
// @access  Private
const createLog = async (req, res) => {
  try {
    const { studyHours, sleepHours, screenTime, physicalActivity, logDate } = req.body;

    // Validate positive numbers
    if (studyHours < 0 || sleepHours < 0 || screenTime < 0 || physicalActivity < 0) {
      return res.status(400).json({ message: 'All numeric values must be positive' });
    }

    // Ensure all required fields are provided
    if (studyHours === undefined || sleepHours === undefined || screenTime === undefined || physicalActivity === undefined) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Create log object
    const logData = {
      studyHours,
      sleepHours,
      screenTime,
      physicalActivity,
      logDate
    };

    // Save log
    const result = await LogModel.createLog(req.user.id, logData);

    if (result) {
      res.status(201).json({ message: 'Log created successfully', id: result.insertId });
    } else {
      res.status(400).json({ message: 'Invalid log data' });
    }
  } catch (error) {
    console.error('Create Log Error:', error);
    res.status(500).json({ message: 'Server error while creating log' });
  }
};

// @desc    Get all logs for a user
// @route   GET /api/logs/:userId
// @access  Private
const getLogs = async (req, res) => {
  try {
    // Ensure the requested logs belong to the authenticated user
    // or you could just use req.user.id directly
    if (req.user.id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to access these logs' });
    }

    const logs = await LogModel.getLogsByUser(req.params.userId);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Get Logs Error:', error);
    res.status(500).json({ message: 'Server error while fetching logs' });
  }
};

module.exports = {
  createLog,
  getLogs
};
