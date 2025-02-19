import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import GradeListTable from "./components/GradeListTable";
import { Button, Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import ExamGradesChart from "./components/ExamGradeChart";

function SemesterGradeView({ exams, subjects, groups, onCancel }) {
    const [loading, setLoading] = useState(true);
    const [averagedGrades, setAveragedGrades] = useState(null);
    const [groupedAveragedGrades, setGroupedAveragedGrades] = useState(null);

    const [showGrouped, setShowGrouped] = useState(!!groups[0]?.groupings);
    const [showRounded, setShowRounded] = useState(true);

    // Calculate the averaged grades for each subject
    useEffect(() => {
        const mround = (value, multiple) => {
            return Math.round(value / multiple) * multiple;
        };
        const calculateAveragedGrades = () => {
            const avgGrades = {};
            for (const subject of subjects) {
                const subjectExams = exams.filter((exam) => exam.subject === subject.id);
                let sumProd = 0;
                let sumWeight = 0;
                for (const exam of subjectExams) {
                    sumProd += Number(exam.grade) * Number(exam.weight);
                    sumWeight += Number(exam.weight);
                }
                avgGrades[subject.id] = sumProd / sumWeight;
            }
            setAveragedGrades(avgGrades);
            setLoading(false);
        };
        const calculateGroupedAveragedGrades = () => {
            const grpAvgGrades = {};
            const subjectsAndGroups = subjects.concat(groups);
            const calculateForGroup = (group) => {
                console.log("Calculating for group", group);
                const members = subjectsAndGroups.filter((subject) => group.members.includes(subject.id));
                const collectAs = group.collectAs || "halfRounded";
                if (collectAs !== "halfRounded") console.log("CollectAs", group)
                let sumProd = 0;
                let sumWeight = 0;
                for (const member of members) {
                    if (member.type === "group") {
                        calculateForGroup(member);
                        if (Number.isNaN(grpAvgGrades[member.id])) continue;

                        if (collectAs === "notRounded") sumProd += grpAvgGrades[member.id] * Number(member.weight);
                        else if (collectAs === "halfRounded") sumProd += mround(grpAvgGrades[member.id], 0.5) * Number(member.weight);

                        sumWeight += Number(member.weight);
                        continue;
                    }
                    if (Number.isNaN(averagedGrades[member.id])) continue;

                    if (collectAs === "notRounded") sumProd += averagedGrades[member.id] * Number(member.weight);
                    else if (collectAs === "halfRounded") sumProd += mround(averagedGrades[member.id], 0.5) * Number(member.weight);

                    sumWeight += Number(member.weight);
                }
                console.log(group.name, sumProd, sumWeight);
                grpAvgGrades[group.id] = sumProd / sumWeight;
            };

            // The Halfterm is by definition the first group
            calculateForGroup(groups[0]);
            console.log("Grouped Averaged Grades", grpAvgGrades);

            setGroupedAveragedGrades(grpAvgGrades);
        };

        if (!averagedGrades) calculateAveragedGrades();
        if (!groupedAveragedGrades && averagedGrades) calculateGroupedAveragedGrades();
    }, [exams, subjects, averagedGrades, groups, groupedAveragedGrades]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div>
            <div>
                {/* Add a Card here to view the exams on the clicked subject */}
                <div className="flex flex-col items-center m-2">
                    <div className="w-full max-w-[850px]">
                        <div className="w-full flex justify-between mb-4">
                            <Button variant="contained" color="primary" onClick={onCancel}>
                                Zurück
                            </Button>
                            <div>
                                {groups[0]?.groupings && (
                                    <FormControlLabel
                                        label="Gruppierte Noten"
                                        labelPlacement="start"
                                        control={<Checkbox checked={showGrouped} onChange={(e) => setShowGrouped(e.target.checked)} />}
                                    />
                                )}
                                <FormControlLabel
                                    label="Runden"
                                    labelPlacement="start"
                                    control={<Checkbox checked={showRounded} onChange={(e) => setShowRounded(e.target.checked)} />}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="w-[850px] max-w-full">
                                <GradeListTable
                                    averagedGrades={{
                                        ...averagedGrades,
                                        ...groupedAveragedGrades,
                                    }}
                                    subjects={subjects.concat(groups)}
                                    showGrouped={showGrouped}
                                    groupings={groups[0]?.groupings}
                                    showRounded={showRounded}
                                />
                            </div>
                        </div>
                        {exams.length > 0 && (
                            <div className="mt-4 p-2 bg-gray-100 border rounded">
                                <h3 className="text-lg font-semibold">Prüfungsnoten Verteilung</h3>
                                <ExamGradesChart exams={exams} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

SemesterGradeView.propTypes = {
    exams: PropTypes.array.isRequired,
    subjects: PropTypes.array.isRequired,
    groups: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default SemesterGradeView;
