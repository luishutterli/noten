import React from "react";
import PropTypes from "prop-types";

const ExamListTable = ({ onExamClick, exams, subjects }) => {
    const formatDate = (date) => {
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    };

    const round = (value, decimals) => {
        const roundedValue =
            Math.round(value * (10 ** decimals)) / (10 ** decimals);
        return roundedValue.toFixed(decimals);
    };

    return (
        <table className="w-full table-auto border-collapse shadow-lg bg-white">
            <thead className="bg-gray-200">
                <tr>
                    <th className="text-start border p-2">Fach</th>
                    <th className="text-start border p-2">Datum</th>
                    <th className="text-start border p-2">Name</th>
                    <th className="text-center border p-2">Note</th>
                    <th className="text-center border p-2">Gewicht</th>
                </tr>
            </thead>
            <tbody>
                {exams.map((exam, index) => {
                    const subject = subjects.find(
                        (subject) => subject.id === exam.subject,
                    );
                    const subjectName = subject ? subject.name : "";
                    return (
                        <tr
                            key={exam.id}
                            className="even:bg-gray-100 cursor-pointer hover:bg-slate-300"
                            onClick={() => onExamClick(exam)}
                            onKeyUp={(e) => { if (e.key === 'Enter') onExamClick(exam); }}
                            tabIndex={0}>
                            <td className="border p-2">{subjectName}</td>
                            <td className="border p-2">
                                {formatDate(exam.date)}
                            </td>
                            <td className="border p-2">{exam.name}</td>
                            <td className="text-end border p-2">
                                {round(exam.grade, 1)}
                            </td>
                            <td className="text-end border p-2">
                                {round(exam.weight, 1)}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

ExamListTable.propTypes = {
    onExamClick: PropTypes.func.isRequired,
    exams: PropTypes.array.isRequired,
    subjects: PropTypes.array.isRequired,
};

export default ExamListTable;
