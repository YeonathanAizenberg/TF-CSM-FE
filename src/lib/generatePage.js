import axios from'axios'

const pageGeneratorLambdaURL = "https://qzk4pemrpapx3oad7fmieqxvwu0xryyr.lambda-url.eu-west-3.on.aws/"

const generatePage = async (station,data) => {
    const response = await axios.post(pageGeneratorLambdaURL+station, {pageData: data})
    return response
}

export default generatePage