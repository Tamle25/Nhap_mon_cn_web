import { useState } from 'react'
import './App.css'
import Search from './components/search.jsx'
import AddUser from './components/addUser.jsx'
import ResultTable from './components/resultTable.jsx'

function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <>
      <div className="app-container">
        <h1>WEB API EXCEISE</h1>

        <div className="controls">
          <Search onChangeValue={setKeyword} />
          <AddUser onAdd={setNewUser} />
        </div>

        <ResultTable
          keyword={kw}
          user={newUser}
          onAdded={() => setNewUser(null)}
        />
      </div>
    </>
  )
}

export default App
