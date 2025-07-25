import React from 'react';

const AuthDebugMonitor: React.FC = () => {
  const [authData, setAuthData] = React.useState<any>({});

  React.useEffect(() => {
    const updateAuthData = () => {
      const data = {
        accessToken: localStorage.getItem('toeic_access_token')?.substring(0, 20) + '...',
        refreshToken: localStorage.getItem('toeic_refresh_token')?.substring(0, 20) + '...',
        user: localStorage.getItem('toeic_current_user')?.substring(0, 50) + '...',
        loginTimestamp: localStorage.getItem('auth_login_timestamp'),
        justLoggedIn: localStorage.getItem('auth_just_logged_in'),
        loginSuccess: localStorage.getItem('toeic_login_success'),
        timeSinceLogin: localStorage.getItem('auth_login_timestamp') 
          ? Math.floor((Date.now() - parseInt(localStorage.getItem('auth_login_timestamp')!)) / 1000) + 's'
          : 'N/A'
      };
      setAuthData(data);
    };

    updateAuthData();
    const interval = setInterval(updateAuthData, 1000);

    return () => clearInterval(interval);
  }, []);

  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    return null; // Only show in development
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🔐 Auth Debug Monitor</div>
      <div>Access Token: {authData.accessToken || 'None'}</div>
      <div>Refresh Token: {authData.refreshToken || 'None'}</div>
      <div>User: {authData.user || 'None'}</div>
      <div>Login Time: {authData.loginTimestamp || 'N/A'}</div>
      <div>Time Since Login: {authData.timeSinceLogin}</div>
      <div>Just Logged In: {authData.justLoggedIn || 'false'}</div>
      <div>Login Success: {authData.loginSuccess || 'false'}</div>
    </div>
  );
};

export default AuthDebugMonitor;
