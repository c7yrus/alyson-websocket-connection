import axios from 'axios'
import Keycloak from 'keycloak-js'

const INIT_URL = `https://internmatch-staging2.gada.io/api/events/init?url=https://internmatch-staging2.gada.io/`

const getApiConfig = async () => {
  try {
    const response = await axios({
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
      url: INIT_URL,
    })
    const apiConfig = response.data
    const keyCloak = new Keycloak({
      realm: apiConfig.realm,
      url: apiConfig.ENV_KEYCLOAK_REDIRECTURI,
      clientId: 'alyson',
    })
    return { keyCloak }
  } catch (error) {
    console.error('There was an error trying to fetch the config', error)
  }
}

export default getApiConfig
