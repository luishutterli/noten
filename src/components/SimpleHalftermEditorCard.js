import React, { useState } from "react";
import PropTypes from "prop-types";
import { firestore } from "../firebase";
import { Card, CardActions, CardContent, Input, Typography, Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";

function SimpleHalftermEditorCard({ halfterm, user, onCancel }) {
    // Halfterm fields
    const [name, setName] = useState(halfterm ? halfterm.name : "Untitled");
    const [subjects, setSubjects] = useState(halfterm ? halfterm.subjects.sort((a, b) => a.name.localeCompare(b.name)) : []);
    const [isSaving, setIsSaving] = useState(false);

    // Subject dialog
    const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
    const [subjectToEdit, setSubjectToEdit] = useState(null);


    const handleSave = async () => {
        if (!name) return;
        if (subjects.length === 0) return;

        setIsSaving(true);

        const newHalfterm = {
            name,
            subjects,
        };
        if (!halfterm)
            await save(newHalfterm);
        else
            // TODO: Update halfterm
            console.log("Update halfterm", newHalfterm);

        setIsSaving(false);
    };

    const save = async (halfterm) => {
        try {
            const uid = user.uid;
            const members = await createSubjects(halfterm.subjects);

            console.log("Save halfterm", halfterm.name);
            console.log("Members", members);

            await addDoc(collection(firestore, "subjects"), {
                uid,
                name: halfterm.name,
                members,
                type: "halfterm",
                weight: 1,
                premade: false,
            });

        } catch (error) {
            console.error("Error saving halfterm", error);
        }
    };

    const createSubjects = async (subjects) => {
        const uid = user.uid;
        let subjectIds = [];
        for (const subject of subjects) {
            const docRef = await addDoc(collection(firestore, "subjects"), {
                uid,
                name: subject.name,
                teacher: subject.teacher,
                type: "subject",
                weight: 1,
                premade: false,
            });
            subjectIds.push(docRef.id);
        }
        return subjectIds;
    };

    return (
        <div>
            {subjectDialogOpen && (
                <div className="backdrop">
                    <SimpleSubjectEditDialog
                        subject={subjectToEdit}
                        onCancel={(arg) => {
                            setSubjectDialogOpen(false);
                            if (!arg && subjectToEdit) setSubjects([...subjects, subjectToEdit].sort((a, b) => a.name.localeCompare(b.name)));
                            setSubjectToEdit(null);
                        }}
                        onSave={(subject) => {
                            setSubjects([...subjects, subject].sort((a, b) => a.name.localeCompare(b.name)));
                            setSubjectDialogOpen(false);
                        }}
                    />
                </div>
            )}
            <Card>
                <CardContent>
                    <div className="flex flex-row items-center">
                        <Typography variant="h5">{halfterm ? "Semester bearbeiten:" : "Neues Semester erstellen:"}</Typography>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                            required
                            disabled={isSaving}
                        />
                    </div>
                    <Typography variant="h6" className="mt-2">Fächer:</Typography>
                    <div className="max-h-52 overflow-y-auto m-0 p-0">
                        <List disablePadding={true}>
                            {subjects.map(subject => (
                                <ListItem
                                    key={subject.name}
                                    disablePadding={true}
                                    onClick={() => {
                                        if (!isSaving) {
                                            setSubjectToEdit(subject);
                                            setSubjects(subjects.filter(s => s !== subject));
                                            setSubjectDialogOpen(true);
                                        }
                                    }}
                                >
                                    <ListItemText primary={subject.name} secondary={subject.teacher} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <Button variant="outlined" onClick={() => !isSaving && setSubjectDialogOpen(true)} disabled={isSaving}>Fach hinzufügen</Button>
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={handleSave} disabled={isSaving}>Speichern</Button>
                    <Button color="secondary" onClick={onCancel} disabled={isSaving}>Abbrechen</Button>
                </CardActions>
            </Card>
        </div>
    );
}

SimpleHalftermEditorCard.propTypes = {
    halfterm: PropTypes.object,
    user: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default SimpleHalftermEditorCard;

function SimpleSubjectEditDialog({ subject, onSave, onCancel }) {
    // Subject fields
    const [name, setName] = useState(subject ? subject.name : "");
    const [teacher, setTeacher] = useState(subject ? subject.teacher : "");

    const handleSave = () => {
        if (!name) return;
        onSave({ name, teacher }, false);
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Fach {subject ? "bearbeiten" : "erstellen"}:</Typography>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Lehrer"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </CardContent>
            <CardActions>
                <Button variant="contained" onClick={handleSave}>Speichern</Button>
                {subject && <Button color="error" onClick={() => onCancel(true)}>Löschen</Button>}
                <Button color="secondary" onClick={() => onCancel(false)}>Abbrechen</Button>
            </CardActions>
        </Card>
    );
}

SimpleSubjectEditDialog.propTypes = {
    subject: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};