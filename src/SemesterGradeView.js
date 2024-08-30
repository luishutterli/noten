import React from "react";
import PropTypes from "prop-types";
import GradeListTable from "./components/GradeListTable";
import { Button } from "@mui/material";

function SemesterGradeView({ exams, subjects, onCancel }) {

    return (
        <div>
            <div>
                {/* Add a Card here to view the exams on the clicked subject */}
                <div className="flex flex-col items-center m-2">
                    <div className="w-full max-w-[850px]">
                        <div className="w-full flex justify-between mb-4">
                            <Button variant="contained" color="primary" onClick={onCancel}>Zurück</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="w-[850px] max-w-full">
                                <GradeListTable exams={exams} subjects={subjects} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

SemesterGradeView.propTypes = {
    exams: PropTypes.array.isRequired,
    subjects: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default SemesterGradeView