import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const User = ({ users }) => {
    return (
        <div>
            <h2>Users</h2>
            <Table striped>
                <thead>
                    <tr>
                        <th>
                        </th>
                        <th>
                            blogs created
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`} key={user.id}>
                                    {user.name}
                                </Link>{' '}
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default User
