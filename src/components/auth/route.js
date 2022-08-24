import { useAuthState } from './firebase'
import { Route, Redirect } from 'react-router-dom'; 

export const AuthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState()
  console.log(`AuthenticatedRoute: ${isAuthenticated}`)
  return (
    <Route
      {...props}
      render={routeProps =>
        isAuthenticated ? <C {...routeProps} /> : <Redirect to="/finalproject/login" />
      }
    />
  )
}

export const UnauthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState()
  return (
    <Route
      {...props}
      render={routeProps =>
        !isAuthenticated ? <C {...routeProps} /> : <Redirect to="/finalproject/" />
      }
    />
  )
}