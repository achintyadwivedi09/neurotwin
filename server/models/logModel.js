const db = require('../config/db');

class LogModel {
  // Creates a new daily log entry
  static async createLog(userId, logData) {
    const { studyHours, sleepHours, screenTime, physicalActivity, logDate } = logData;
    
    const query = `
      INSERT INTO daily_logs 
      (user_id, study_hours, sleep_hours, screen_time, physical_activity, log_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      userId, 
      studyHours || 0, 
      sleepHours || 0, 
      screenTime || 0, 
      physicalActivity || 0, 
      logDate || new Date().toISOString().split('T')[0]
    ];

    const [result] = await db.execute(query, values);
    return result;
  }

  // Gets all logs for a specific user, ordered by date
  static async getLogsByUser(userId) {
    const query = 'SELECT * FROM daily_logs WHERE user_id = ? ORDER BY log_date DESC';
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
}

module.exports = LogModel;
