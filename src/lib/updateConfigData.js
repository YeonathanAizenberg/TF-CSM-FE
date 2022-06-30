import axios from'axios'

const configLambdaURL = "https://vxuprbsteidguxpsvpg4xizfhy0ssedc.lambda-url.eu-west-3.on.aws/"

const updateConfigData = async (data,station) => {
    const response = await axios.put(configLambdaURL, {pageData: data}, { params: { key: `${station}` } })
    return response
}

export default updateConfigData