import { useState} from 'react'
import './App.css'

async function getGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)  
  
    return {
    name: data.name, 
    avatar: data.avatar_url,
    bio: data.bio,
    followers: data.followers,
    following: data.following,
    repos: data.public_repos,
    date: data.created_at,
    location: data.location,
    company: data.company,
    blog: data.blog,
    link: data.html_url
  }
  }

  catch (error) {
    console.error('Error fetching GitHub user:', error)
    throw error
  }

  
}

function UserInput({username, setUsername, fetchData, loading}) {
  return (
    <div className="user-input">
      <input 
        type="text" 
        placeholder="Enter GitHub username" 
        value={username} 
        onChange={(event) => {setUsername(event.target.value);
          setSearched(false);
        }}
        onKeyDown={(e) => {
          if(e.key === "Enter"){
            fetchData();
          }
        }}/>
      <button 
        onClick={fetchData}
        disabled = {loading || username.trim() === ""}>
          Search
      </button>
    </div>
  )
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={`${user.name}'s avatar`} />
      <div className="user-info"> 
        <h2 className='name'>{user.name || "Name not specified"}</h2>
        <p>{user.bio || "No bio available"}</p>
        <p>Followers: {user.followers}</p>
        <p>Following: {user.following}</p>
        <p>Repositories: {user.repos}</p>
        <p>Joined: {new Date(user.date).toLocaleDateString()}</p>
        <p>Location: {user.location || "Not specified"}</p>
        <p>Company: {user.company || "Not specified"}</p>
        <p>Blog: 
          {user.blog ? 
            <a href={user.blog} target="_blank" rel="noopener noreferrer">
              {user.blog}
            </a> : 
            "Not specified"}
        </p>
        <a
          href = {user.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Profile
        </a>
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

  return (
    <div className="App">
      <UserInput username={username} setUsername={setUsername} fetchData={fetchData} loading={loading} />
      {
        loading
        ?
        (<p>Loading...</p>)
        :
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