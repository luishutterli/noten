import "./App.css";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import GradeList from "./components/GradeList";
import { Button } from "@mui/material";
import ExamCard from "./components/ExamCard";
import { collection, getDocs, query, addDoc, updateDoc, serverTimestamp, where } from "firebase/firestore";


// const exams = [
//   { uid: "1", subject: "Mathematik", date: "2023-04-01", name: "Algebra Test", grade: "5.5", weight: "2" },
//   { uid: "2", subject: "Informatik", date: "2023-04-05", name: "Datenstrukturen", grade: "6.0", weight: "2" },
//   { uid: "3", subject: "Englisch", date: "2023-04-10", name: "Vokabeltest", grade: "5.0", weight: "1" },
//   { uid: "4", subject: "Chemie", date: "2023-04-15", name: "Periodensystem", grade: "4.5", weight: "1" },
//   { uid: "5", subject: "Geschichte", date: "2023-04-20", name: "Erster Weltkrieg", grade: "5.8", weight: "2" },
//   { uid: "6", subject: "Biologie", date: "2023-04-25", name: "Pflanzenwachstum", grade: "6.5", weight: "1" }
// ];

// const subjects = [
//   { uid: "1", name: "Mathematik", teacher: "LÄU" },
//   { uid: "2", name: "Informatik", teacher: "" },
//   { uid: "3", name: "Englisch", teacher: "LAJ" },
//   { uid: "4", name: "Chemie", teacher: "" },
//   { uid: "5", name: "Geschichte", teacher: "SWA" },
//   { uid: "6", name: "Biologie", teacher: "" }
// ];

function App() {
  const [user] = useAuthState(auth);
  const [showExamCard, setShowExamCard] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  // Database data
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const fetchSubjects = async () => {
    try {
      const q = query(collection(firestore, "subjects"));
      const querySnapshot = await getDocs(q);
      const subjectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubjects(subjectsData.filter(subject => subject.type === "subject"));
    } catch (error) {
      console.error("Error fetching subjects: ", error);
    }
  };

  const fetchExams = async () => {
    try {
      const q = query(collection(firestore, "grades"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const examsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExams(examsData);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  // Fetch data
  useEffect(() => {
    if(!user) return;
    fetchSubjects();
    fetchExams();
  }, []);

  const handleNewExam = () => {
    setCurrentExam(null);
    setShowExamCard(true);
  };

  const handleSaveExam = async (exam) => {
    setShowExamCard(false);
    console.log("Save exam", exam);
    if (exam.id) {
      await updateDoc(collection(firestore, "grades", exam.id), {
        subject: exam.subject,
        date: exam.date,
        name: exam.name,
        grade: exam.grade,
        weight: exam.weight,
        updatedAt: serverTimestamp()
      });
    } else {
      await addDoc(collection(firestore, "grades"), {
        subject: exam.subject,
        date: exam.date,
        name: exam.name,
        grade: exam.grade,
        weight: exam.weight,
        updatedAt: serverTimestamp(),
      });

    }
  };

  const handleCancel = () => {
    setShowExamCard(false);
  };

  const handleExamClick = (exam) => {
    setCurrentExam(exam);
    setShowExamCard(true);
  };

  const handelExamDelete = (exam) => {
    console.log("Delete exam", exam);
    setShowExamCard(false);
  };

  return (
    <div className="App">
      <Header />
      {!user && <Navigate to="/auth" />}
      {user && (
        <div>
          {showExamCard && (
            <div className="backdrop">
                <ExamCard exam={currentExam} onSave={handleSaveExam} onCancel={handleCancel} onDelete={handelExamDelete} subjects={subjects} />
            </div>
          )}
          <div className="flex flex-col items-center m-2">
            <div className="w-full max-w-[850px]">
              <div className="w-full flex justify-end mb-4">
                <Button variant="contained" color="primary" className="" onClick={handleNewExam}>Neue Prüfung</Button>
              </div>
              <div className="overflow-x-auto">
                <div className="w-[850px] max-w-full">
                  <GradeList onExamClick={handleExamClick} exams={exams} subjects={subjects} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
