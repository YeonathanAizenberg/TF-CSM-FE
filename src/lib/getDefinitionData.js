// import axios from'axios'
//TODO make the an API call, the definition shoulb be comming from the DB or S3 bucket
import definitionFile from "../data/definition.js";

const getDefinitionData = async () => {
    return definitionFile
}

export default getDefinitionData