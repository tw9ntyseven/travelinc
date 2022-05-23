import './App.css';
import Header from './components/header/header';
import Auth from './screens/auth/auth';
import Main from './screens/main/main';
import Users from './screens/users/users';

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}

export default App;
