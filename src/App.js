import React, { useEffect, useState } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import MyAgents from './pages/MyAgents';
import CreateAgents from './pages/CreateAgents';
import Models from './pages/Models';
import Datasets from './pages/Datasets';
import Integrations from './pages/Integrations';
import Account from './pages/Account';
import Keys from './pages/Keys';
import Dashboard from './components/Dashboard';
import AgentDetails from './pages/AgentDetails';
import RunDetails from './pages/assistant-details/RunDetails';
import BatchDetails from './pages/assistant-details/BatchDetails';
import createApiInstance from './utils/api';
import { PaymentStatusPage } from './utils/payment';
import { Mixpanel } from './utils/mixpanel';
import { DialogContent, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';



// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#grey[900]', // primary color for your layout
    },
    secondary: {
      main: '#grey[500]', // secondary color
    },
    background: {
      default: '#fff', // default background color
      paper: '#f5f5f5', // background color for paper based components
    },
  },
  typography: {
    // Define any typography variants here
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    // ...other variants
  },
  // You can also customize other theme aspects like spacing, breakpoints, etc.
});

const options = {
  auth: {
    persistSession: true,
  },
}
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_SECRET;
const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

function App() {
  const [session, setSession] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isSessionLoaded, setSessionLoaded] = useState(false);
  const [isUserCalled, userCalled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  let sentUserRequest = false;

  useEffect(() => {
    if (sentUserRequest == true) {
      return;
    }
    sentUserRequest = true;

    const createUser = async (api) => {
      userCalled(true);
      try {
        const response = await api.post(`/user`);
        if (response.status === 200) {
          const userInfo = response.data.data;

          if (userInfo?.is_first_login) {
            setShowPopup(true);
            setTimeout(() => {
              window.location.reload();
            }, 6000);
          }

          Mixpanel.identify(userInfo.user_id);
          Mixpanel.track('login');
          Mixpanel.people.set({
            $email: userInfo.user_info.email,
          });

          setUserInfo(userInfo);
        } else {
          console.error('Failed to make user call');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    if (!session) {
      setSessionLoaded(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.access_token && !isUserCalled) {
          const api = createApiInstance(session?.access_token);
          createUser(api);
        }
      })
    }

  }, [session])

  const redirectUrl = (process.env.REACT_APP_REDIRECT_URL == null || process.env.REACT_APP_REDIRECT_URL == undefined) ? "https://app.bolna.dev" : process.env.REACT_APP_REDIRECT_URL

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/"
              element={
                !session ? (
                  <header className="App-header">
                    <Auth
                      redirectTo={redirectUrl}
                      supabaseClient={supabase}
                      providers={["github", "google"]}
                      appearance={{
                        theme: ThemeSupa,
                        variables: {
                          default: {
                            colors: {
                              brand: "#060d37",
                              brandAccent: "indigo",
                              messageText: "white",
                              anchorTextColor: "white",
                            },
                          },
                        },
                      }}
                      theme="dark"
                    />


                  </header>
                ) : (
                  <Navigate to="/dashboard/my-agents" />
                )
              }
            >
            </Route>

            <Route path="/dashboard" element={<Dashboard supabase={supabase} userInfo={userInfo} accessToken={session?.access_token} />}>
              <Route path="my-agents" element={<MyAgents user={userInfo} accessToken={session?.access_token} />} />
              <Route path="create-agents" element={<CreateAgents accessToken={session?.access_token} />} />
              <Route path="models" element={<Models accessToken={session?.access_token} />} />
              <Route path="datasets" element={<Datasets session={session} />} />
              <Route path="integrations" element={<Integrations session={session} />} />
              <Route path="account" element={<Account session={session} />} />
              <Route path="developer" element={<Keys accessToken={session?.access_token} />} />
              <Route path="agent-details" element={<AgentDetails accessToken={session?.access_token} />} />
              <Route path="agent/run-details" element={<RunDetails accessToken={session?.access_token} />} />
              <Route path="agent/batch-details" element={<BatchDetails session={session} accessToken={session?.access_token} />} />
              <Route path="user/payment" element={<PaymentStatusPage />} />
            </Route>

          </Routes>

        {showPopup && (
          <div>
            {/* Delete confirmation dialog */}
            <Dialog open={showPopup} maxWidth="xl">
              <DialogContent>
                Setting up your account ...
              </DialogContent>
            </Dialog>
          </div>
        )}

        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
