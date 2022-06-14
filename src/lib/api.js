import axios from'axios'

const configLambdaURL = "https://rpc52oxts22whztq2e7tjpntee0lukvq.lambda-url.us-east-1.on.aws"
const pageGeneratorLambdaURL = "https://vij5rcwav4an7ob3gsf5ldbf440qjaza.lambda-url.us-east-1.on.aws"

export const getConfigData = async station => {
    const response = await axios.get(configLambdaURL, { params: { key: `${station}` } })
    const formatedResponse = JSON.parse(response.data.Items[0].data).pageData
    return formatedResponse
}

export const updateConfigData = async (data,station) => {
    const response = await axios.put(configLambdaURL, {pageData: data}, { params: { key: `${station}` } })
    return response
}

export const getPage = async station => {
    const response = await axios.get(pageGeneratorLambdaURL, { params: { key: `${station}` } })
    return response
}