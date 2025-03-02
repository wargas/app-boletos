import axios from "axios";

const ApiClient = axios.create({
    baseURL: 'https://boletos-api.deltex.com.br/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

ApiClient.interceptors.request.use(async (config) => {
    const session = await axios.get('api/me');

    console.log(session.data)

    if(session?.data.api_token) {
        config.headers.set('Authorization', `Bearer ${session?.data.api_token}`)
    }

    return config;
}, null)

export default ApiClient