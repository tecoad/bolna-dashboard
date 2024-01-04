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
import RunDetails from './pages/assistant-details/RunDetails';


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

  const redirectUrl = (process.env.REACT_APP_REDIRECT_URL == null || process.env.REACT_APP_REDIRECT_URL == undefined) ? "https://app.bolna.dev" : process.env.REACT_APP_REDIRECT_URL
  console.log(`process.env.REACT_APP_REDIRECT_URL ${process.env.REACT_APP_REDIRECT_URL} redirectUrl ${redirectUrl}`)

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

            <Route path="/dashboard" element={<Dashboard supabase={supabase} />}>
              <Route path="my-agents" element={<MyAgents userId={session?.user?.id} />} />
              <Route path="create-agents" element={<CreateAgents userId={session?.user?.id} />} />
              <Route path="models" element={<Models userId={session?.user?.id} />} />
              <Route path="datasets" element={<Datasets session={session} />} />
              <Route path="integrations" element={<Integrations session={session} />} />
              <Route path="account" element={<Account session={session} />} />
              <Route path="agent-details" element={<AgentDetails session={session} />} />

              <Route path="agent/run-details" element={<RunDetails session={session} />} />
            </Route>

          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
