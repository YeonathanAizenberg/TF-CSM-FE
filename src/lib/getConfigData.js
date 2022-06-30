import axios from'axios'

const configLambdaURL = "https://vxuprbsteidguxpsvpg4xizfhy0ssedc.lambda-url.eu-west-3.on.aws/"

const getConfigData = async station => {
    const response = await axios.get(configLambdaURL, { params: { key: `${station}` } })
    const formatedResponse = JSON.parse(response.data.Item.data).pageData
    // When do the call from postman, the data format will be odd, use this commeted code to be able to click on the main save btn and have tge data on hte DB on the correct format. FIX THAT iSSUE!!!!!!
    // console.log("formatedResponse",formatedResponse)
    // console.log("formatedResponse.data",(JSON.parse(formatedResponse).pageData))
    // return JSON.parse(formatedResponse).pageData
    return formatedResponse
}

export default getConfigData