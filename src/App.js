import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, getUserClaims } from "./firebase";
import { settings, loadSettings } from "./settings";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import GradeList from "./components/GradeList";
import { Button } from "@mui/material";
import ExamCard from "./components/ExamCard";
import { collection, query, addDoc, updateDoc, serverTimestamp, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";

function App() {
  const [user] = useAuthState(auth);
  const [customClaims, setCustomClaims] = useState(null);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const fetchCustomClaims = useCallback(async () => {
    if (!user) return;
    setLoadingClaims(true);
    const claims = await getUserClaims();
    console.log("Claims:", claims);
    setCustomClaims(claims);
    setLoadingClaims(false);
  }, [user]);

  const [showExamCard, setShowExamCard] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  // Database data
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const fetchSubjects = useCallback(() => {
    if (!customClaims) return;
    try {
      const q = query(collection(firestore, "subjects"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("fetching subjects source:", querySnapshot.metadata.fromCache ? "cache" : "server");
        const subjectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubjects(filterSubjectsToHalfterm(subjectsData));
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching subjects: ", error);
    }
  }, [customClaims]);

  const filterSubjectsToHalfterm = (subjects) => {
    const halfterms = subjects.filter(subject => subject.type === "halfterm");
    const halfterm = halfterms.find(halfterm => halfterm.name === settings.halfterm);
    if (!halfterm) throw new Error("Halfterm not found");

    // Recursively resolve subject of each sub group
    const resolveSubjects = (headGroup, collectedSubjects) => {
      const members = subjects.filter(subject => headGroup.members.includes(subject.id));
      for (const member of members) {
        if(member.type === "subject") 
          collectedSubjects.push(member);
        else
          resolveSubjects(member, collectedSubjects);
      }
      return collectedSubjects;
    }

    return resolveSubjects(halfterm, []);
  }

  const fetchExams = useCallback(() => {
    if (!user) return;
    if (!customClaims) return;
    try {
      const q = query(collection(firestore, "grades"), where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("fetching exams source:", querySnapshot.metadata.fromCache ? "cache" : "server");
        const examsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExams(examsData);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  }, [user, customClaims]);

  // Fetch data
  useEffect(() => {
    fetchCustomClaims();
  }, [user, fetchCustomClaims]);

  useEffect(() => {
    if (loadingClaims || !user) return;
    const unsubscribeSubjects = fetchSubjects();
    const unsubscribeExams = fetchExams();
    return () => {
      if (unsubscribeSubjects) unsubscribeSubjects();
      if (unsubscribeExams) unsubscribeExams();
    };
  }, [user, loadingClaims, fetchSubjects, fetchExams]);


  // Settings
  const checkSettings = useCallback(async () => {
    if (!user) return;
    await loadSettings();
    if (settings.halfterm !== undefined) {
      setLoadingSettings(false);
      console.log("Settings loaded:", settings);
    }
  }, [user]);

  useEffect(() => {
    checkSettings();
  }, [checkSettings]);

  
  const handleNewExam = () => {
    setCurrentExam(null);
    setShowExamCard(true);
  };

  const handleSaveExam = async (exam) => {
    setShowExamCard(false);
    if (exam.id) {
      console.log("Update exam");
      await updateDoc(doc(firestore, "grades", exam.id), {
        subject: exam.subject,
        date: exam.date,
        name: exam.name,
        grade: exam.grade,
        weight: exam.weight,
        updatedAt: serverTimestamp()
      });
    } else {
      console.log("Save exam");
      await addDoc(collection(firestore, "grades"), {
        uid: user.uid,
        subject: exam.subject,
        date: exam.date,
        name: exam.name,
        grade: exam.grade,
        weight: exam.weight,
        updatedAt: serverTimestamp(),
      });
    }
  };

  const handelExamDelete = async (exam) => {
    setShowExamCard(false);
    console.log("Delete exam");
    await deleteDoc(doc(firestore, "grades", exam.id));
  };

  const handleCancel = () => {
    setShowExamCard(false);
  };

  const handleExamClick = (exam) => {
    setCurrentExam(exam);
    setShowExamCard(true);
  };

  if (loadingSettings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      {!user?.emailVerified && <Navigate to="/auth" />}
      {user && (
        <div>
          {loadingClaims ? (
            <div>Loading...</div>
          ) : (
            <>
              {!customClaims?.stripeRole ? (
                <Navigate to="/subscription" />
              ) : (
                <>
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
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;