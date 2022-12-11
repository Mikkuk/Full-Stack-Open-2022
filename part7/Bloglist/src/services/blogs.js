import axios from 'axios'
import userService from './user'
const baseUrl = '/api/blogs'

const config = () => {
    return {
        headers: {
            Authorization: `bearer ${userService.getToken()}`,
        },
    }
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject, config())
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then((response) => response.data)
}

const updateComments = (id, newObject) => {
    console.log(newObject)
    const request = axios.put(`${baseUrl}/${id}/comments`, newObject)
    return request.then((response) => response.data)
}

const removeBlog = (id) => {
    return axios.delete(`${baseUrl}/${id}`, config())
}

export default { getAll, create, update, updateComments, removeBlog }
