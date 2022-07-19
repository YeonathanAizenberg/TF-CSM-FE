import axios from'axios'

const configLambdaURL = "https://vxuprbsteidguxpsvpg4xizfhy0ssedc.lambda-url.eu-west-3.on.aws/"

const getConfigData = async station => {
    const response = await axios.get(configLambdaURL, { params: { key: `${station}` } })
    const curentTemplate = response.data.Item.template
    const curentTemplateVerison = response.data.Item.templateVerison
    const formatedResponse = response.data.Item.data
    if(formatedResponse==="{}") {
        return {"data": formatedResponse, "curentTemplate":curentTemplate, "curentTemplateVerison":curentTemplateVerison}
    } else {
        const configData = JSON.parse(formatedResponse).pageData
        return {"data":configData?.pageData, "curentTemplate":curentTemplate, "curentTemplateVerison":curentTemplateVerison}
    }
}

export default getConfigData