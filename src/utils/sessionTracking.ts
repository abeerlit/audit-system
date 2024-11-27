import axios from 'axios';
import Cookies from 'js-cookie';

let sessionId: number | null = null;
let activityTimer: NodeJS.Timeout;
let lastApiCall: number = 0;
const API_CALL_INTERVAL = 60000; // 1 minute in milliseconds

export const startSessionTracking = async (token: string) => {
  try {
    console.log("starting session tracking");
    // Start new session
    const session_Id = localStorage.getItem('sessionId');
    if (session_Id) {
      sessionId = parseInt(session_Id);
    }
    else {
      const response = await axios.post('/api/sessions', null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      localStorage.setItem('sessionId', response.data.id.toString());
      sessionId = response.data.id;
    }

    // Set up activity tracking
    setupActivityTracking(token);
  } catch (error) {
    console.error('Failed to start session tracking:', error);
  }
};

const setupActivityTracking = (token: string) => {
  // Reset timer on user activity
  const resetTimer = () => {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(handleIdle, 5 * 60 * 1000); // 5 minutes

    // Update lastActive timestamp with rate limiting
    if (sessionId) {
      const now = Date.now();
      console.log(now, lastApiCall, "now - lastApiCall", now - lastApiCall >= API_CALL_INTERVAL);

      if (now - lastApiCall >= API_CALL_INTERVAL) {
        lastApiCall = now;
        axios.put('/api/sessions',
          { sessionId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
      }
    }
  };

  // Handle user becoming idle
  const handleIdle = () => {
    Cookies.remove('auditToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Track user activity
  ['mousedown', 'keydown', 'touchstart', 'mousemove'].forEach(event => {
    document.addEventListener(event, resetTimer);
  });

  // Initial timer setup
  resetTimer();
}; 
