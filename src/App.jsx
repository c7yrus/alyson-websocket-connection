import EventBus from '@vertx/eventbus-bridge-client.js'
import { useKeycloak } from '@react-keycloak/web'
import axios from 'axios'

const VERTX_URL = 'https://internmatch-staging2.gada.io/frontend'
const eventBus = new EventBus(VERTX_URL)

const App = () => {
  const { keycloak } = useKeycloak()

  const { login, sessionId, token } = keycloak

  if (!(token && sessionId)) login({ redirectUri: `${window.location.href}` })

  if (token && sessionId) {
    try {
      eventBus.registerHandler(sessionId, (err, { body }) => {
        console.log('body', body)
      })
    } catch (error) {
      console.error(error)
    }

    axios.post(
      `https://internmatch-staging2.gada.io/api/events/init?url=https://internmatch-staging2.gada.io/`,
      {
        method: 'POST',
        responseType: 'json',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    eventBus.send('address.inbound', {
      data: {
        event_type: 'AUTH_INIT',
        msg_type: 'EVT_MSG',
        token,
        data: {
          code: 'AUTH_INIT',
          platform: { type: 'web' },
          sessionId,
        },
      },
    })
  }

  return <div>{`Websocket`}</div>
}

export default App
