import axios from'axios'

const configLambdaURL = "https://vxuprbsteidguxpsvpg4xizfhy0ssedc.lambda-url.eu-west-3.on.aws/"

const getConfigData = async station => {
    const response = await axios.get(configLambdaURL, { params: { key: `${station}` } })
    const formatedResponse = response.data.Item.data
    const configData = JSON.parse(formatedResponse).pageData

    return JSON.parse(configData).pageData
}

export default getConfigData