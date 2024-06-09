import React, { useState, useEffect } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import GuestActions from './GuestActions';
import EmployeeActions from './EmployeeActions';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const LOGIN_QUERY = gql`
  query LoginStatus {
    loginStatus
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

interface LoginProps {
  onLoginSuccess: () => void;
  onLogoutSuccess: () => void;
}

const Dashboard: React.FC<LoginProps> = ({ onLoginSuccess, onLogoutSuccess }) => {

  const loginStatusQuery = useQuery(LOGIN_QUERY);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loginStatusQuery.data) {
      setLoggedIn(loginStatusQuery.data.loginStatus);
    }
  }, [loginStatusQuery.data]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const [logout] = useMutation(LOGOUT_MUTATION);

  const handleLogout = () => {
    logout({}).then(() => {
      onLogoutSuccess();
      setLoggedIn(false);
      window.location.reload();
    });
  }

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login({ variables: { username, password } }).then(response => {
      if (response.data.login) {
        onLoginSuccess();
        setLoggedIn(true);
        window.location.reload();
      } else {
        alert('Failed to login');
      }
    });
  };


  return (
    <div>
      { loggedIn ? (
        <div>
        <button onClick={handleLogout}>Logout</button>
        <EmployeeActions />
        </div>
      ) : (
        <div>
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading}>Login</button>
        </form>
        <GuestActions />
        </div>
      )}
    </div>
  );
};
export default Dashboard;