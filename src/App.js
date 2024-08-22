import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, getUserClaims } from "./firebase";
import { settings, loadSettings } from "./settings";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import GradeList from "./components/GradeList";
import { Button, CircularProgress } from "@mui/material";
import ExamCard from "./components/ExamCard";
import { collection, query, addDoc, updateDoc, serverTimestamp, where, onSnapshot, doc, deleteDoc, getDoc, getDocs, documentId } from "firebase/firestore";

function App() {
  const [user] = useAuthState(auth);
  const [customClaims, setCustomClaims] = useState(null);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  const [showExamCard, setShowExamCard] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  const navigate = useNavigate();

  // Database data
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);


  // Fetch functions
  const fetchCustomClaims = useCallback(async () => {
    if (!user) return;
    setLoadingClaims(true);
    const claims = await getUserClaims();
    console.log("Claims:", claims);

    if(!claims.stripeRole) {
      navigate("/subscription");
      return;
    }

    setCustomClaims(claims);
    setLoadingClaims(false);
  }, [user]);

  const fechtSubjectsFromIds = async (ids, premade) => {
    const subjects = [];

    const itterations = Math.ceil(ids.length / 10);

    for (let i = 0; i < itterations; i++) {
      const batchIds = ids.slice(i * 10, (i + 1) * 10);
      const q = query(collection(firestore, "subjects"), where("premade", "==", premade), where(documentId(), "in", batchIds));
      const queryResults = await getDocs(q);
      const batchSubjects = queryResults.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      subjects.push(...batchSubjects);
    }
    return subjects;
  }

  const resolveSubjects = useCallback(async (headGroup, collectedSubjects, premade) => {
    const members = await fechtSubjectsFromIds(headGroup.members, premade);
    for (const member of members) {
      if (member.type === "subject")
        collectedSubjects.push(member);
      else
        resolveSubjects(member, collectedSubjects, premade);
    }
    return collectedSubjects;
  }, []);

  const fetchSubjects = useCallback(async () => {
    if (!settings.halfterm) return;

    try {
      console.log("premade", !settings.halfterm.startsWith("um_"));
      const premade = !settings.halfterm.startsWith("um_");
      const queryResults = await getDocs(query(collection(firestore, "subjects"), where("premade", "==", premade), where("type", "==", "halfterm"),where("name", "==", settings.halfterm)));
      const halfterm = queryResults.docs[0].data();

      const subjects = await resolveSubjects(halfterm, [], premade);
      console.log("Subjects:", subjects);
      setSubjects(subjects);
    } catch (error) {
      console.error("Error fetching subjects: ", error);
    }
  }, [resolveSubjects]);



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

  // Settings
  const checkSettings = useCallback(async () => {
    if (!user) return;
    await loadSettings();
    if (settings.halfterm !== undefined) {
      console.log("Settings loaded:", settings);

      if (settings.halfterm === null) {
        navigate("/onboarding");
      }
      setLoadingSettings(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    checkSettings();
  }, [checkSettings]);

  useEffect(() => {
    if (loadingClaims || !user) return;
    if(subjects.length > 0) return;
    fetchSubjects();
    const unsubscribeExams = fetchExams();

    // TODO: Replace this with smart fetching, not client side filtering
    const updateExams = async () => {
      while (!subjects) { }
      const subjectIds = subjects.map(subject => subject.id);
      setExams(exams.filter(exam => subjectIds.includes(exam.subject)));
    };

    updateExams();

    return () => {
      if (unsubscribeExams) unsubscribeExams();
    };
  }, [user, loadingClaims, fetchSubjects, fetchExams]);


  // Handlers
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

  if (!user?.emailVerified) {
    navigate("/auth");
  }

  if (loadingSettings || loadingClaims || loadingSubscriptions) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <Header setLoadingSubscription={setLoadingSubscriptions}/>
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
    </div>
  );
}

export default App;