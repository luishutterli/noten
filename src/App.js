import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import GradeList from "./components/GradeList";

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Header />
      <section>
        {!user && <Navigate to="/auth" />}
      </section>
      <GradeList />
    </div>
  );
}

export default App;
