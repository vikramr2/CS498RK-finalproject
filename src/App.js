import Login from './components/Login/login'
import Schedule from './components/Scheduler/schedule'
import { BrowserRouter as Router } from 'react-router-dom'; 
import { AuthContextProvider } from './components/auth/firebase'
import { UnauthenticatedRoute, AuthenticatedRoute } from './components/auth/route';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <AuthenticatedRoute exact path="/finalproject" component={Schedule}/>
        <UnauthenticatedRoute exact path="/finalproject/login" component={Login}/>
      </Router>

    </AuthContextProvider>
    
  );
}

export default App;
