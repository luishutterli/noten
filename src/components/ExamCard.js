import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Card, CardContent, CardActions, Typography, MenuItem } from "@mui/material";
import dayjs from "dayjs";

const ExamCard = ({ exam, onSave, onCancel, onDelete, subjects }) => {
    const today = new Date().toISOString().split("T")[0];

    // const [subject, setSubject] = useState(exam ? findSubjectDNameById(exam.subject) : "");
    const [subject, setSubject] = useState(exam ? exam.subject : "");
    const [date, setDate] = useState(exam ? exam.date : today);
    const [name, setName] = useState(exam ? exam.name : "");
    const [grade, setGrade] = useState(exam ? exam.grade : "");
    const [weight, setWeight] = useState(exam ? exam.weight : "");
    const [gradeError, setGradeError] = useState("");
    const [weightError, setWeightError] = useState("");
    const [dateError, setDateError] = useState("");

    const validateGrade = (value) => {
        const gradeValue = Number.parseFloat(value);
        if (Number.isNaN(gradeValue) || gradeValue < 1 || gradeValue > 6) {
            setGradeError("Note muss eine Zahl zwischen 1 und 6 sein");
        } else {
            setGradeError("");
        }
    };

    const validateWeight = (value) => {
        const weightValue = Number.parseFloat(value);
        if (Number.isNaN(weightValue)) {
            setWeightError("Gewicht muss eine Zahl sein");
        } else {
            setWeightError("");
        }
    };

    const validateDate = (value) => {
        const selectedDate = dayjs(value);
        if (selectedDate.isAfter(dayjs())) {
            setDateError("Datum darf nicht in der Zukunft liegen");
        } else {
            setDateError("");
        }
    };

    const handleSave = () => {
        let newExam = {};
        if(exam)
            newExam = { id: exam.id, subject: subject, date: date, name: name, grade: grade, weight: weight };
        else
            newExam = { subject: subject, date: date, name: name, grade: grade, weight: weight };
        onSave(newExam);
    };

    const isFormValid = () => {
        return subject && date && name && grade && weight && !gradeError && !weightError && !dateError;
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{exam ? "Prüfung bearbeiten" : "Neue Prüfung"}</Typography>
                <TextField
                    select
                    label="Fach"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {subjects.map((subj) => (
                        <MenuItem key={subj.id} value={subj.id}>
                            {(subj.name + (subj.teacher && ` (${subj.teacher})`))}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Datum"
                    type="date"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        validateDate(e.target.value);
                    }}
                    fullWidth
                    margin="normal"
                    error={!!dateError}
                    helperText={dateError}
                />
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Note"
                    value={grade}
                    onChange={(e) => {
                        setGrade(e.target.value);
                        validateGrade(e.target.value);
                    }}
                    fullWidth
                    margin="normal"
                    error={!!gradeError}
                    helperText={gradeError}
                />
                <TextField
                    label="Gewicht"
                    value={weight}
                    onChange={(e) => {
                        setWeight(e.target.value);
                        validateWeight(e.target.value);
                    }}
                    fullWidth
                    margin="normal"
                    error={!!weightError}
                    helperText={weightError}
                />
            </CardContent>
            <CardActions>
                <Button onClick={handleSave} color="primary" variant="contained" disabled={!isFormValid()}>Speichern</Button>
                {exam && <Button onClick={() => onDelete(exam)} color="error">Löschen</Button>}
                <Button onClick={onCancel} color="secondary">Abbrechen</Button>
            </CardActions>
        </Card>
    );
};

ExamCard.propTypes = {
    exam: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    subjects: PropTypes.array.isRequired
};

export default ExamCard;