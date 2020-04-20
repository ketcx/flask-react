import React, {useState, useEffect} from 'react'

const API = process.env.REACT_APP_API

export const Users = () =>
{
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [id, setId] = useState('')

  const [editing, setEditing] = useState(false)

  const [users, setUsers] = useState([])

  const handleSubmit = async(e) =>
  {
    e.preventDefault()
    let res

    if(editing)
    {
      res = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      })

    }else
    {
      res = await fetch(`${API}/users`, {
      method: "POST",
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })
    }  
    
    await getUsers()
    
    setEditing(false)
    setId('')
    setName('')
    setEmail('')
    setPassword('')
  }

  const getUsers = async () =>
  {
    let res = await fetch(`${API}/users`) 
    const data = await res.json()
    setUsers(data)

  }

  const editUsers = async (id) =>
  {
    let res = await fetch(`${API}/users/${id}`) 
    const data = await res.json()

    setEditing(true)
    setId(data._id)
    setName(data.name)
    setEmail(data.email)
    setPassword(data.password)
  }
  
  const deleteUsers = async (id) =>
  {
    const userResp = window.confirm('Estas seguro?')

    if(userResp)
    {
      let res = await fetch(`${API}/users/${id}`,{
        method: 'DELETE'
      }) 
      
      await getUsers()
    }
    
  }

  useEffect(() =>
  {
    getUsers()
  })

  return(
    <div className="row">
      <div className="col-md-4">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text"
            onChange={e => setName(e.target.value)}
            value={name}
            className="form-control"
            placeholder="Type a name"
             />
          </div>
          <div className="form-group">
            <input type="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            className="form-control"
            placeholder="Type a email" />
          </div>
          <div className="form-group">
            <input type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            className="form-control"
            placeholder="Type a pass" />
          </div>
          <button className="btn btn-primary btn-block">
          {editing ? "Edit" : "Create"}
          </button>
        </form>
      </div>
      <div className="col-md-6">
        <table className="table table-striped">
          <thead>

          </thead>
          <tbody>
            {users.map(user =>(
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                <button className="btn btn-secondary btn-sm btn-block"
                onClick={() => editUsers(user._id)}
                >EDIT</button>
                <button 
                className="btn btn-danger btn-sm btn-block"
                onClick={() => deleteUsers(user._id)}
                >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
