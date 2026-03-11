import React, { useState } from 'react';
import axios from 'axios';

const DailyLog = ({ user }) => {
  const [formData, setFormData] = useState({
    studyHours: 0,
    sleepHours: 0,
    screenTime: 0,
    physicalActivity: 0,
    logDate: new Date().toISOString().split('T')[0]
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { studyHours, sleepHours, screenTime, physicalActivity, logDate } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    setStatus({ type: '', message: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.post('http://localhost:5000/api/logs', formData, config);
      
      setStatus({ type: 'success', message: 'Daily log successfully recorded!' });
      
      // Reset form but keep the date
      setFormData({
        studyHours: 0,
        sleepHours: 0,
        screenTime: 0,
        physicalActivity: 0,
        logDate: formData.logDate
      });
      
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to save log. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Daily Input</h1>
        <p>Log your lifestyle metrics for today to update your NeuroTwin.</p>
      </div>

      <div className="log-form-container">
        {status.message && (
          <div className={status.type === 'success' ? 'success-message' : 'error-message'}>
            {status.message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group" style={{maxWidth: '250px'}}>
            <label>Log Date</label>
            <input 
              type="date" 
              className="form-control" 
              name="logDate" 
              value={logDate} 
              onChange={onChange}
              required
            />
          </div>

          <div className="log-grid">
            <div className="form-group" style={{backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{margin: 0}}>Study Hours</label>
                <span style={{fontWeight: 600, color: 'var(--accent-color)'}}>{studyHours}h</span>
              </div>
              <input 
                type="range" 
                min="0" max="16" step="0.5" 
                className="range-slider" 
                name="studyHours" 
                value={studyHours} 
                onChange={onChange} 
              />
            </div>

            <div className="form-group" style={{backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{margin: 0}}>Sleep Hours</label>
                <span style={{fontWeight: 600, color: 'var(--accent-purple)'}}>{sleepHours}h</span>
              </div>
              <input 
                type="range" 
                min="0" max="14" step="0.5" 
                className="range-slider" 
                name="sleepHours" 
                value={sleepHours} 
                onChange={onChange} 
              />
            </div>

            <div className="form-group" style={{backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{margin: 0}}>Screen Time</label>
                <span style={{fontWeight: 600, color: 'var(--accent-orange)'}}>{screenTime}h</span>
              </div>
              <input 
                type="range" 
                min="0" max="18" step="0.5" 
                className="range-slider" 
                name="screenTime" 
                value={screenTime} 
                onChange={onChange} 
              />
            </div>

            <div className="form-group" style={{backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label style={{margin: 0}}>Physical Activity</label>
                <span style={{fontWeight: 600, color: 'var(--success-color)'}}>{physicalActivity}h</span>
              </div>
              <input 
                type="range" 
                min="0" max="6" step="0.5" 
                className="range-slider" 
                name="physicalActivity" 
                value={physicalActivity} 
                onChange={onChange} 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{maxWidth: '250px'}}>
            {loading ? 'Saving...' : 'Save Daily Log'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyLog;
