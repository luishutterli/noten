import React, { useState } from "react";
import PropTypes from "prop-types";

function GradeListTable({ exams, subjects}) {
    const [averagedGrades, setAveragedGrades] = useState(null);

    const calculateAveragedGrades = () => {
        let avgGrades = {};
        for (const subject of subjects) {
            const subjectExams = exams.filter(exam => exam.subject === subject.id);
            let sumProd = 0;
            let sumWeight = 0;
            for (const exam of subjectExams) {
                sumProd += exam.grade * exam.weight;
                sumWeight += exam.weight;
            }
            avgGrades[subject.id] = sumProd / sumWeight;
        }
        setAveragedGrades(avgGrades);
    };

    if (!averagedGrades) {
        calculateAveragedGrades();
    }

    
    return (
        <div>
            <table className="w-full table-auto border-collapse shadow-lg bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="text-start border p-2">Fach</th>
                        <th className="text-start border p-2">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, index) => {
                        return (
                            <tr key={subject.id} className="even:bg-gray-100">
                                <td className="border p-2">{subject.name}</td>
                                <td className="border p-2">{averagedGrades[subject.id]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

GradeListTable.propTypes = {
    exams: PropTypes.array.isRequired,
    subjects: PropTypes.array.isRequired,
};

export default GradeListTable