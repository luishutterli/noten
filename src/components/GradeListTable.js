import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

function GradeListTable({ averagedGrades, subjects, showGrouped, groupings }) {
    const [tooltip, setTooltip] = useState({
        visible: false,
        content: "",
        position: { x: 0, y: 0 },
    });

    const mround = (value, multiple) => {
        return Math.round(value / multiple) * multiple;
    };

    const handleMouseEnter = useCallback((event, grade) => {
        if (Number.isNaN(grade)) return;
        const round = (value, decimals) => {
            const roundedValue =
                Math.round(value * 10 ** decimals) / 10 ** decimals;
            return roundedValue.toFixed(decimals);
        };
        setTooltip({
            visible: true,
            content: `Note: ${round(grade, 3)}`,
            position: { x: event.clientX, y: event.clientY - 30 },
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTooltip({ visible: false, content: "", position: { x: 0, y: 0 } });
    }, []);

    return (
        <div>
            {!showGrouped ? (
                <table className="w-full table-auto border-collapse shadow-lg bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-start border p-2">Fach</th>
                            <th className="text-start border p-2">Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => {
                            const grade = averagedGrades[subject.id];
                            const displayedGrade = Number.isNaN(grade)
                                ? "-"
                                : mround(grade, 0.5);
                            return (
                                <tr
                                    key={subject.id}
                                    className="even:bg-gray-100 cursor-pointer hover:bg-slate-300"
                                    onMouseEnter={(e) =>
                                        handleMouseEnter(e, grade)
                                    }
                                    onMouseLeave={handleMouseLeave}>
                                    <td className="border p-2">
                                        {subject.name}
                                    </td>
                                    <td className="border p-2">
                                        {displayedGrade}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <>
                    {groupings.map((grouping) => {
                        return (
                            <table
                                key={grouping.name}
                                className="w-full table-auto border-collapse shadow-lg bg-white">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="text-start border p-2">
                                            {grouping.name}
                                        </th>
                                        <th className="text-start border p-2">
                                            Note
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grouping.members.map((member) => {
                                        const subject = subjects.find(subject => subject.id === member);
                                        const grade = averagedGrades[subject.id];
                                        const displayedGrade = Number.isNaN(
                                            grade,
                                        )
                                            ? "-"
                                            : mround(grade, 0.5);
                                        return (
                                            <tr
                                                key={member}
                                                className="even:bg-gray-100 cursor-pointer hover:bg-slate-300"
                                                onMouseEnter={(e) =>
                                                    handleMouseEnter(e, grade)
                                                }
                                                onMouseLeave={handleMouseLeave}>
                                                <td className="border p-2">
                                                    {subject.name}
                                                </td>
                                                <td className="border p-2">
                                                    {displayedGrade}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        );
                    })}
                </>
            )}
            {tooltip.visible && (
                <div
                    className="absolute bg-gray-700 text-white text-sm rounded px-2 py-1"
                    style={{
                        left: tooltip.position.x,
                        top: tooltip.position.y,
                    }}>
                    {tooltip.content}
                </div>
            )}
        </div>
    );
}

GradeListTable.propTypes = {
    averagedGrades: PropTypes.object.isRequired,
    subjects: PropTypes.array.isRequired,
    showGrouped: PropTypes.bool.isRequired,
    groupings: PropTypes.array.isRequired,
};

export default GradeListTable;
