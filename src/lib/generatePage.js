import axios from'axios'

const pageGeneratorLambdaURL = "https://qzk4pemrpapx3oad7fmieqxvwu0xryyr.lambda-url.eu-west-3.on.aws/"

const generatePage = async (station, data, template, templateVersion) => {
    const response = await axios.post(pageGeneratorLambdaURL, {pageData: data},  {params: {key: `${station}`, template:`${template}`, templateVersion:`${templateVersion}`}} )
    return response
}

export default generatePage