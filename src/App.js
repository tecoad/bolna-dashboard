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
import Dashboard from './components/Dashboard';
import AgentDetails from './pages/AgentDetails';


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


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])


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
                      redirectTo="https://dashboard.bolna.dev/dashboard"
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

            <Route path="/dashboard" element={<Dashboard supabase={supabase} />}>
              <Route path="my-agents" element={<MyAgents session={session} />} />
              <Route path="create-agents" element={<CreateAgents session={session} />} />
              <Route path="models" element={<Models session={session} />} />
              <Route path="datasets" element={<Datasets session={session} />} />
              <Route path="integrations" element={<Integrations session={session} />} />
              <Route path="account" element={<Account session={session} />} />
              <Route path="agent-details" element={<AgentDetails session={session} />} />
            </Route>

          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;