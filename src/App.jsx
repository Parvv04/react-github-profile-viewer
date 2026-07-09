import { useState} from 'react'
import './App.css'

async function getGitHubUser(username) {
  try {
    const reponse = await fetch(`https://api.github.com/users/${username}`)
    if(!reponse.ok) {
      throw new Error(`HTTP error! status: ${reponse.status}`)
    }

    const data = await reponse.json()
    console.log(data)  
  
    return {
    name: data.name, 
    avatar: data.avatar_url,
    bio: data.bio,
    followers: data.followers,
    following: data.following,
    repos: data.public_repos
  }
  }

  catch (error) {
    console.error('Error fetching GitHub user:', error)
    throw error
  }

  
}

function UserInput({username, setUsername, fetchData}) {
  return (
    <div className="user-input">
      <input 
        type="text" 
        placeholder="Enter GitHub username" 
        value={username} 
        onChange={(event) => setUsername(event.target.value)} 
        onKeyDown={(e) => {
          if(e.key === "Enter"){
            fetchData();
          }
        }}/>
      <button onClick={fetchData}>Search</button>
    </div>
  )
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={`${user.name}'s avatar`} />
      <div className="user-info"> 
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <p>Followers: {user.followers}</p>
      <p>Following: {user.following}</p>
      <p>Repositories: {user.repos}</p>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("") 
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  
  async function fetchData() {
    if(username.trim() === "") {
      setUser(null)
      return
    }
    setLoading(true)
    setSearched(true)
    try{
      const data = await getGitHubUser(username)
      setUser(data);
    }catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
    }finally {
    setLoading(false)
    }
  }

  console.log(user)

  if (loading) {
    return (
        <div className="App">
          <UserInput username={username} setUsername={setUsername} fetchData={fetchData} />
          <p>Loading...</p>   
        </div>
    )
  }

  return (
    <div className="App">
      <UserInput username={username} setUsername={setUsername} fetchData={fetchData} />
      {
        username.trim() === ""
        ?
        (<p>Please enter a username to search</p>)
        :
        !searched
        ?
        (<p>Click search to find user</p>)
        :
        user
        ?
        <UserCard user={user} />
        :
        <p>User not found</p>
      }
    </div>
  )
}
  
export default App