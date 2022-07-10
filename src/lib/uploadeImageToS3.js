import axios from'axios'

const lambdaURL = "https://onfth86fb7.execute-api.eu-west-3.amazonaws.com/dev/image_uploader/"

const uploadeImageToS3= async (entity,image,id,field) => {
    const fd = new FormData()
    fd.append("image", image)

    const response = await axios.post(lambdaURL+`${entity}` ,fd, {params: {id: `${id}`, field: `${field}`} })
    return {
        "success": 1,
        "file": {
            "url": response.data.image,
        } 
    }
}

export default uploadeImageToS3