import './App.css';
import FirebaseAuth from './components/FirebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      </header>
      <section>
        {user ? <div>HALLLLOOO</div> : <FirebaseAuth />}
      </section>
    </div>
  );
}

export default App;
