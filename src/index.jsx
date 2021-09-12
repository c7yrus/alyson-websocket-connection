import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import getApiConfig from './get-api-config'
import { ReactKeycloakProvider } from '@react-keycloak/web'

const initialiseApp = async () => {
  try {
    const { keyCloak } = await getApiConfig()
    ReactDOM.render(
      <React.StrictMode>
        <ReactKeycloakProvider authClient={keyCloak} LoadingComponent={<div />}>
          <App />
        </ReactKeycloakProvider>
      </React.StrictMode>,
      document.getElementById('root'),
    )
  } catch (error) {
    console.error('There was an error trying to initialise the app', error)
  }
}

initialiseApp()
