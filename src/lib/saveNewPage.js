import axios from'axios'

const pageGeneratorLambdaURL = "https://qzk4pemrpapx3oad7fmieqxvwu0xryyr.lambda-url.eu-west-3.on.aws/"

const saveNewPage = async (data,station) => {
    const response = await axios.put(pageGeneratorLambdaURL+station, {pageData: data})
    return response
}

export default saveNewPage