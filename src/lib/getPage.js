import axios from'axios'

const pageGeneratorLambdaURL = "https://qzk4pemrpapx3oad7fmieqxvwu0xryyr.lambda-url.eu-west-3.on.aws/"

const getPage = async station => {
    const response = await axios.get(pageGeneratorLambdaURL, {params: {key: `${station}`} })
    return response
}

export default getPage