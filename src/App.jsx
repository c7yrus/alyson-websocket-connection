import EventBus from '@vertx/eventbus-bridge-client.js'
import { useKeycloak } from '@react-keycloak/web'
import axios from 'axios'

const VERTX_URL = 'https://internmatch-dev.gada.io/frontend'
const eventBus = new EventBus(VERTX_URL)

const App = () => {
  const { keycloak } = useKeycloak()

  const { login, sessionId, token } = keycloak

  const makeAuthInitData = ({ token, sessionId }) => ({
    event_type: 'AUTH_INIT',
    msg_type: 'EVT_MSG',
    token,
    data: {
      code: 'AUTH_INIT',
      platform: { type: 'web' },
      sessionId,
    },
  })

  if (!(token && sessionId)) login({ redirectUri: `${window.location.href}` })

  if (token && sessionId) {
    try {
      eventBus.registerHandler(sessionId, (err, { body }) => {
        console.log('%c Data from Backend --->', 'color: tomato; font-size:20px', body)
      })
    } catch (error) {
      console.error(error)
    }

    axios.post(
      `https://internmatch-dev.gada.io/api/events/init?url=https://internmatch-dev.gada.io/`,
      {
        method: 'POST',
        responseType: 'json',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },

      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    eventBus.send(
      'address.inbound',
      {
        data: makeAuthInitData({ sessionId, token }),
      },
      { Authorization: `Bearer ${token}` },
    )
  }

  return <div>{`This is the main page! Open the console to see the data!`}</div>
}

export default App
