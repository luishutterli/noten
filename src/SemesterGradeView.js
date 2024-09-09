import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import GradeListTable from "./components/GradeListTable";
import {
	Button,
	CircularProgress,
	FormControlLabel,
	Switch,
} from "@mui/material";

function SemesterGradeView({ exams, subjects, groups, onCancel }) {
	const [loading, setLoading] = useState(true);
	const [averagedGrades, setAveragedGrades] = useState(null);
	const [groupedAveragedGrades, setGroupedAveragedGrades] = useState(null);

    const [showGrouped, setShowGrouped] = useState(!!groups[0]?.groupings);

	// Calculate the averaged grades for each subject
	useEffect(() => {
		const mround = (value, multiple) => {
			return Math.round(value / multiple) * multiple;
		};
		const calculateAveragedGrades = () => {
			const avgGrades = {};
			for (const subject of subjects) {
				const subjectExams = exams.filter(
					(exam) => exam.subject === subject.id,
				);
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
				const members = subjectsAndGroups.filter((subject) =>
					group.members.includes(subject.id),
				);
				let sumProd = 0;
				let sumWeight = 0;
				for (const member of members) {
					if (member.type === "group") {
						calculateForGroup(member);
						if (Number.isNaN(grpAvgGrades[member.id])) continue;
						sumProd +=
							mround(grpAvgGrades[member.id], 0.5) * Number(member.weight);
						sumWeight += Number(member.weight);
						continue;
					}
					if (Number.isNaN(averagedGrades[member.id])) continue;
					sumProd +=
						mround(averagedGrades[member.id], 0.5) * Number(member.weight);
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
		if (!groupedAveragedGrades && averagedGrades)
			calculateGroupedAveragedGrades();
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
							{groups[0]?.groupings && (
								<FormControlLabel
									label="Gruppierte Noten"
									labelPlacement="start"
									control={<Switch  checked={showGrouped} onChange={(e) => setShowGrouped(e.target.checked)} />}
								/>
							)}
						</div>
						<div className="overflow-x-auto">
							<div className="w-[850px] max-w-full">
								<GradeListTable
									averagedGrades={{...averagedGrades, ...groupedAveragedGrades}}
									subjects={subjects.concat(groups)}
                                    showGrouped={showGrouped}
                                    groupings={groups[0]?.groupings}
								/>
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
	groups: PropTypes.array.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default SemesterGradeView;
