import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, getUserClaims } from "./firebase";
import { settings, loadSettings } from "./settings";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import ExamListTable from "./components/ExamListTable";
import { Button, CircularProgress, IconButton } from "@mui/material";
import ExamCard from "./components/ExamCard";
import {
    collection,
    query,
    addDoc,
    updateDoc,
    serverTimestamp,
    where,
    onSnapshot,
    doc,
    deleteDoc,
    getDocs,
    documentId,
} from "firebase/firestore";
import LandingPage from "./LandingPage";
import CookieConsent from "./components/CookieConsent";
import SemesterGradeView from "./SemesterGradeView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import TargetGradeCalculatorCard from "./components/TargetGradeCalculatorCard";

function App() {
    const [user] = useAuthState(auth);
    const [customClaims, setCustomClaims] = useState(null);
    const [loadingClaims, setLoadingClaims] = useState(true);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

    const [showExamCard, setShowExamCard] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);

    const [showTargetGradeCalculator, setShowTargetGradeCalculator] = useState(false);

    const [showSemesterGradeView, setShowSemesterGradeView] = useState(false);

    const navigate = useNavigate();

    // Database data
    const [subjects, setSubjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [exams, setExams] = useState([]);

    // Fetch functions
    const fetchCustomClaims = useCallback(async () => {
        if (!user) return;
        setLoadingClaims(true);
        const claims = await getUserClaims();
        console.log("Claims:", claims);

        if (!claims.stripeRole) {
            navigate("/subscription");
            return;
        }

        setCustomClaims(claims);
        setLoadingClaims(false);
    }, [user, navigate]);

    const resolveSubjects = useCallback(async (headGroup, collectedSubjects, collectedGroups, premade, uid) => {
        const fechtSubjectsFromIds = async (ids, premade, uid) => {
            const subjects = [];
            const itterations = Math.ceil(ids.length / 10);

            for (let i = 0; i < itterations; i++) {
                const batchIds = ids.slice(i * 10, (i + 1) * 10);
                let q;
                if (premade) {
                    q = query(collection(firestore, "subjects"), where("premade", "==", premade), where(documentId(), "in", batchIds));
                } else {
                    q = query(
                        collection(firestore, "subjects"),
                        where("premade", "==", premade),
                        where(documentId(), "in", batchIds),
                        where("uid", "==", uid),
                    );
                }
                const queryResults = await getDocs(q);
                const batchSubjects = queryResults.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                subjects.push(...batchSubjects);
            }
            return subjects;
        };

        const members = await fechtSubjectsFromIds(headGroup.members, premade, uid);
        for (const member of members) {
            if (member.type === "subject") collectedSubjects.push(member);
            else {
                collectedGroups.push(member);
                await resolveSubjects(member, collectedSubjects, collectedGroups, premade, uid);
            }
        }
        return [collectedSubjects, collectedGroups];
    }, []);

    const fetchSubjects = useCallback(async () => {
        if (!user) return;
        if (!settings.halfterm) return;

        try {
            console.log("premade", !settings.halfterm.startsWith("um_"));
            const premade = !settings.halfterm.startsWith("um_");
            let q;
            if (premade) {
                q = query(
                    collection(firestore, "subjects"),
                    where("premade", "==", premade),
                    where("type", "==", "halfterm"),
                    where("name", "==", settings.halfterm),
                );
            } else {
                q = query(
                    collection(firestore, "subjects"),
                    where("premade", "==", premade),
                    where("type", "==", "halfterm"),
                    where("uid", "==", user.uid),
                    where("name", "==", settings.halfterm),
                );
            }
            const queryResults = await getDocs(q);
            const halfterm = {
                id: queryResults.docs[0].id,
                ...queryResults.docs[0].data(),
            };

            let [subjects, groups] = await resolveSubjects(halfterm, [], [halfterm], premade, user.uid);
            if (!premade) {
                subjects = subjects.map((subject) => {
                    return {
                        ...subject,
                        name: subject.name.substring(3),
                    };
                });
                groups = groups.map((group) => {
                    return {
                        ...group,
                        name: group.name.substring(3),
                    };
                });
            }
            console.log("Subjectsss:", subjects);
            console.log("Groupsss:", groups);
            setSubjects(subjects);
            setGroups(groups);
            return subjects;
        } catch (error) {
            console.error("Error fetching subjects: ", error);
        }
    }, [user, resolveSubjects]);

    const fetchExams = useCallback(
        (subj) => {
            if (!user) return;
            if (!customClaims) return;
            console.log("Subjects from state: ", subjects.length === 0);
            console.log("Subjects from vars: ", (!subj || subj.length === 0));
            if (subjects.length === 0 && (!subj || subj.length === 0)) return;
            try {
                const q = query(collection(firestore, "grades"), where("uid", "==", user.uid));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    console.log("fetching exams source:", querySnapshot.metadata.fromCache ? "cache" : "server");
                    let examsData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    examsData.sort((a, b) => new Date(b.date) - new Date(a.date));
                    const subjectIds = (subjects.length !== 0) ? subjects.map((subject) => subject.id) : subj.map((subject) => subject.id);
                    console.log("SubjectIds:", subjectIds);
                    console.log("Exams subject ids:", examsData.map((exam) => exam.subject));
                    examsData = examsData.filter((exam) => subjectIds.includes(exam.subject));
                    console.log("Exams length:", examsData.length);
                    setExams(examsData);
                });
                return unsubscribe;
            } catch (error) {
                console.error("Error fetching exams: ", error);
            }
        },
        [user, subjects, customClaims],
    );

    // Fetch data
    useEffect(() => {
        fetchCustomClaims();
    }, [fetchCustomClaims]);

    // Settings
    const checkSettings = useCallback(async () => {
        if (!user?.emailVerified) return;
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
        // const fetchData = async () => {
        //     if (loadingClaims || !user) return;
        //     if (subjects.length > 0) return;
        //     await fetchSubjects();
        //     const unsubscribeExams = fetchExams();

        //     // Filter exams based on loaded subjects
        //     const subjectIds = subjects.map((subject) => subject.id);
        //     setExams((prevExams) => prevExams.filter((exam) => subjectIds.includes(exam.subject)));

        //     return () => {
        //         if (unsubscribeExams) unsubscribeExams();
        //     };
        // };

        const fetchData = async () => {
            if (loadingClaims || !user) return;
            if (subjects.length > 0) return;
            const subj = await fetchSubjects();
            fetchExams(subj);
        };

        fetchData();
    }, [user, loadingClaims, fetchSubjects, fetchExams, subjects]);

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
                grade: Number.parseFloat(exam.grade),
                weight: Number.parseFloat(exam.weight),
                updatedAt: serverTimestamp(),
            });
        } else {
            console.log("Save exam");
            await addDoc(collection(firestore, "grades"), {
                uid: user.uid,
                subject: exam.subject,
                date: exam.date,
                name: exam.name,
                grade: Number.parseFloat(exam.grade),
                weight: Number.parseFloat(exam.weight),
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
        setShowTargetGradeCalculator(false);
    };

    const handleExamClick = (exam) => {
        setCurrentExam(exam);
        setShowExamCard(true);
    };

    if (!user) {
        return <LandingPage />;
    }

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

    if (showSemesterGradeView) {
        return (
            <div className="App">
                <Header setLoadingSubscription={setLoadingSubscriptions} />
                <SemesterGradeView
                    exams={exams}
                    subjects={subjects}
                    groups={groups}
                    onCancel={() => setShowSemesterGradeView(false)}
                />
            </div>
        );
    }

    return (
        <div className="App">
            <Header setLoadingSubscription={setLoadingSubscriptions} />
            <div>
                {showExamCard && (
                    <div className="backdrop">
                        <ExamCard
                            exam={currentExam}
                            onSave={handleSaveExam}
                            onCancel={handleCancel}
                            onDelete={handelExamDelete}
                            subjects={subjects}
                        />
                    </div>
                )}
                {showTargetGradeCalculator && (
                    <div className="backdrop">
                        <TargetGradeCalculatorCard onCancel={handleCancel} subjects={subjects} exams={exams} />
                    </div>
                )}
                <div className="flex flex-col items-center m-2">
                    <div className="w-full max-w-[850px]">
                        <div className="w-full flex justify-between mb-4">
                            <Button variant="contained" color="primary" onClick={() => setShowSemesterGradeView(true)}>
                                Zeugnis
                            </Button>
                            <div className="flex flex-row pl-2">
                                <Button variant="contained" color="primary" onClick={handleNewExam}>
                                    Neue Prüfung
                                </Button>
                                <div className="p-2" />
                                <Button variant="contained" color="primary" onClick={() => setShowTargetGradeCalculator(true)}>
                                    Wunsch Durchschnitt
                                    <FontAwesomeIcon icon={faCalculator} className="ml-1" />
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="w-[850px] max-w-full">
                                <ExamListTable onExamClick={handleExamClick} exams={exams} subjects={subjects} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CookieConsent />
        </div>
    );
}

export default App;
