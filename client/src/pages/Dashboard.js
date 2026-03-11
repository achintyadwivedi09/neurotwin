import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const res = await axios.get(`http://localhost:5000/api/logs/${user.id}`, config);
        setLogs(res.data);
      } catch (err) {
        setError('Failed to fetch logs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  // Calculate averages
  const avgStudy = logs.length ? (logs.reduce((acc, log) => acc + parseFloat(log.study_hours), 0) / logs.length).toFixed(1) : 0;
  const avgSleep = logs.length ? (logs.reduce((acc, log) => acc + parseFloat(log.sleep_hours), 0) / logs.length).toFixed(1) : 0;
  const avgScreen = logs.length ? (logs.reduce((acc, log) => acc + parseFloat(log.screen_time), 0) / logs.length).toFixed(1) : 0;
  
  // Calculate a mock "Readiness Score" based on sleep and study balance
  const calculateScore = () => {
    if (!logs.length) return 0;
    const latestLog = logs[0]; // Assuming ordered by date desc
    let score = 50; // base score
    if (latestLog.sleep_hours >= 7 && latestLog.sleep_hours <= 9) score += 30;
    else if (latestLog.sleep_hours > 5) score += 15;
    
    if (latestLog.physical_activity >= 1) score += 20;
    
    return Math.min(100, score); // Max 100
  };

  const readinessScore = calculateScore();

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Your daily productivity overview, {user.name.split(' ')[0]}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-title">Readiness Score</div>
          <div className="stat-value">{readinessScore}%</div>
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
            {readinessScore > 70 ? 'Great condition for high focus tasks today.' : 'Take it easy today. Focus on recovery.'}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Avg Study Time</div>
          <div className="stat-value">{avgStudy}h</div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '15px' }}>
            <div style={{ width: `${Math.min(100, (avgStudy / 8) * 100)}%`, height: '100%', background: 'var(--accent-color)', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Avg Sleep Time</div>
          <div className="stat-value">{avgSleep}h</div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '15px' }}>
            <div style={{ width: `${Math.min(100, (avgSleep / 8) * 100)}%`, height: '100%', background: 'var(--accent-purple)', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Avg Screen Time</div>
          <div className="stat-value">{avgScreen}h</div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '15px' }}>
            <div style={{ width: `${Math.min(100, (avgScreen / 10) * 100)}%`, height: '100%', background: 'var(--accent-orange)', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>

      <div className="log-form-container" style={{maxWidth: '100%'}}>
        <h3 style={{marginBottom: '1.5rem'}}>Recent Activity Log</h3>
        {logs.length === 0 ? (
          <p style={{color: 'var(--text-secondary)'}}>No logs recorded yet. Head to 'Daily Input' to start tracking.</p>
        ) : (
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <th style={{padding: '12px 0', color: 'var(--text-secondary)', fontWeight: 500}}>Date</th>
                <th style={{padding: '12px 0', color: 'var(--text-secondary)', fontWeight: 500}}>Study (hrs)</th>
                <th style={{padding: '12px 0', color: 'var(--text-secondary)', fontWeight: 500}}>Sleep (hrs)</th>
                <th style={{padding: '12px 0', color: 'var(--text-secondary)', fontWeight: 500}}>Screen (hrs)</th>
                <th style={{padding: '12px 0', color: 'var(--text-secondary)', fontWeight: 500}}>Activity (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding: '15px 0'}}>{new Date(log.log_date).toLocaleDateString()}</td>
                  <td style={{padding: '15px 0'}}>{log.study_hours}</td>
                  <td style={{padding: '15px 0'}}>{log.sleep_hours}</td>
                  <td style={{padding: '15px 0'}}>{log.screen_time}</td>
                  <td style={{padding: '15px 0'}}>{log.physical_activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
