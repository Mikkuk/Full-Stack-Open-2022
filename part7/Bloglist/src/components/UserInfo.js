import React from 'react'
import { useParams } from 'react-router'

const UserInfo = ({ users }) => {
    const id = useParams().id

    let user = users.filter((user) => user.id === id)
    if (user.length === 0) {
        return null
    }
    return (
        <div>
            <h2>{user[0].name}</h2>
            <h3>added blogs</h3>
            <ul>
                {user[0].blogs.map((blog) => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserInfo
