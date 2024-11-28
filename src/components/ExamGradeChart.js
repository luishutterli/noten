import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

const ExamGradesChart = ({ exams }) => {
    const gradeRanges = [
        { min: 5.5, max: 6.0, label: "6 - 5.5" },
        { min: 5.0, max: 5.5, label: "5.5 - 5" },
        { min: 4.5, max: 5.0, label: "5 - 4.5" },
        { min: 4.0, max: 4.5, label: "4.5 - 4" },
        { min: 3.5, max: 4.0, label: "4 - 3.5" },
        { min: 1.0, max: 3.5, label: "3.5 - 1" },
    ];

    const chartData = gradeRanges.map((range) => ({
        range: range.label,
        count: exams.filter(
            (exam) => exam.grade > range.min && exam.grade <= range.max,
        ).length,
    }));

    const maxCount = Math.max(...chartData.map((data) => data.count));

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis allowDecimals={false} domain={[0, maxCount + 1]} />
                    <Tooltip formatter={(value) => [`${value}`, "Anzahl"]} />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

ExamGradesChart.propTypes = {
    exams: PropTypes.array.isRequired,
};

export default ExamGradesChart;
