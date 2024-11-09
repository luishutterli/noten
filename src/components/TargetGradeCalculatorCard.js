import React, { useState } from "react";
import { Button, Card, CardActions, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";

function TargetGradeCalculatorCard({ onCancel, subjects, exams }) {
    const [subject, setSubject] = useState("");
    const [desiredGrade, setDesiredGrade] = useState("");
    const [desiredGradeError, setDesiredGradeError] = useState("");
    const [weight, setWeight] = useState("");
    const [weightError, setWeightError] = useState("");

    const [resultText, setResultText] = useState("");

    const validateWeight = (value) => {
        const weightValue = Number.parseFloat(value);
        if (Number.isNaN(weightValue) || weightValue <= 0) {
            setWeightError("Gewicht muss eine Zahl sein");
        } else {
            setWeightError("");
        }
        calculateTargetGrade(subject, value, desiredGrade);
    };

    const validateDesiredGrade = (value) => {
        const gradeValue = Number.parseFloat(value);
        if (Number.isNaN(gradeValue) || gradeValue < 1 || gradeValue > 6) {
            setDesiredGradeError("Note muss eine Zahl zwischen 1 und 6 sein");
        } else {
            setDesiredGradeError("");
        }
        calculateTargetGrade(subject, weight, value);
    };

    const calculateTargetGrade = (subject, weight, desiredGrade) => {
        if (Number.isNaN(desiredGrade) || desiredGrade < 1 || desiredGrade > 6 || Number.isNaN(weight) || weight <= 0) {
            setResultText("");
            return;
        }
        const fSubject = subjects.find((subj) => {
            const dName = subj.name + (subj.teacher && ` (${subj.teacher})`);
            return dName === subject;
        });
        console.log(`dName: ${subject} found: ${fSubject.name}`);
        console.log(`desiredGrade: ${desiredGrade} weight: ${weight}`);

        const examsForSubject = exams.filter((exam) => exam.subject === fSubject.id);

        let currentGrade = 0;
        let currentWeight = 0;
        for (const exam of examsForSubject) {
            currentGrade += Number.parseFloat(exam.grade) * Number.parseFloat(exam.weight);
            currentWeight += Number.parseFloat(exam.weight);
        }

        const targetGrade = (desiredGrade * (currentWeight + Number.parseFloat(weight)) - currentGrade) / Number.parseFloat(weight);

        if (targetGrade < 1 || targetGrade > 6 || Number.isNaN(targetGrade)) {
            setResultText("Die gewünschte Note ist nicht erreichbar");
            return;
        }
        setResultText(`Du musst eine ${targetGrade.toFixed(2)} schreiben`);
    };

    return (
        <Card>
            <CardContent>
                <Typography>Wunsch Note berrechnen</Typography>
                <TextField
                    select
                    label="Fach"
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value);
                        calculateTargetGrade(e.target.value, weight, desiredGrade);
                    }}
                    fullWidth
                    margin="dense">
                    {subjects.map((subj) => (
                        <MenuItem key={subj.id} value={subj.name}>
                            {subj.name} {subj.teacher && `(${subj.teacher})`}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Gewünschte Note"
                    value={desiredGrade}
                    onChange={(e) => {
                        setDesiredGrade(e.target.value);
                        validateDesiredGrade(e.target.value);
                    }}
                    error={!!desiredGradeError}
                    helperText={desiredGradeError}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Gewicht"
                    value={weight}
                    onChange={(e) => {
                        setWeight(e.target.value);
                        validateWeight(e.target.value);
                    }}
                    error={!!weightError}
                    helperText={weightError}
                    fullWidth
                    margin="dense"
                />
                <p>{resultText}</p>
            </CardContent>
            <CardActions>
                <Button onClick={onCancel}>Abbrechen</Button>
            </CardActions>
        </Card>
    );
}

TargetGradeCalculatorCard.propTypes = {
    onCancel: PropTypes.func.isRequired,
    subjects: PropTypes.array.isRequired,
    exams: PropTypes.array.isRequired,
};

export default TargetGradeCalculatorCard;
