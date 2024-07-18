import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import GradeList from "./components/GradeList";
import { Button } from "@mui/material";

function App() {
  const [user] = useAuthState(auth);

  const handleNewExam = () => {

  };

  return (
    <div className="App">
      <Header />
      {!user && <Navigate to="/auth" />}
      {user && (
        <div className="flex flex-col items-center m-2">
          <div className="w-full max-w-[850px]">
            <div className="w-full flex justify-end mb-4">
              <Button variant="contained" color="primary" className="" onClick={handleNewExam}>Neue Prüfung</Button>
            </div>
            <div className="overflow-x-auto">
              <div className="w-[850px] max-w-full">
                <GradeList />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
