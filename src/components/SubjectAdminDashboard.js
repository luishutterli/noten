import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, MenuItem, List, ListItem, ListItemText, Divider } from "@mui/material";
import { collection, getDocs, query, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

function SubjectAdminDashboard() {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [type, setType] = useState("subject");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [existingSubjects, setExistingSubjects] = useState([]);
  const [existingGroups, setExistingGroups] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const q = query(collection(firestore, "subjects"));
      const querySnapshot = await getDocs(q);
      const subjectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      let subjects = subjectsData.filter(subject => subject.type === "subject");
      let groups = subjectsData.filter(subject => subject.type === "group" || subject.type === "halfterm");

      groups = groups.map(group => ({
        ...group,
        members: group.members.map(memberId => {
          const memberDetails = subjects.find(subject => subject.id === memberId) || groups.find(group => group.id === memberId);
          const name = memberDetails.type === "subject" ? `${memberDetails.name} (${memberDetails.teacher})` : memberDetails.name;
          return memberDetails ? `${name}, ${memberDetails.type.charAt(0).toUpperCase()}` : "Unknown Member";
        })
      }));

      setExistingSubjects(subjects);
      setExistingGroups(groups);
    } catch (error) {
      console.error("Error fetching subjects: ", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");
    try {
      const docRef = collection(firestore, "subjects");
      if (type === "subject") {
        await addDoc(docRef, {
          name: name,
          teacher: teacher,
          type: "subject",
          weight: 1
        });
      } else {
        await addDoc(docRef, {
          name: name,
          type: "group",
          members: selectedSubjects,
          weight: 1
        });
      }
      setName("");
      setTeacher("");
      setSelectedSubjects([]);
      fetchSubjects();
    } catch (error) {
      alert("Error");
      console.error(`Error adding ${type}: `, error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          spellCheck="true"
          margin="normal"
        />
        {type === "subject" && (
          <TextField
            label="Teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        <TextField
          select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="subject">Subject</MenuItem>
          <MenuItem value="group">Group</MenuItem>
        </TextField>
        {type === "group" && (
          <TextField
            select
            label="Select Subjects/Groups"
            value={selectedSubjects}
            onChange={(e) => setSelectedSubjects(e.target.value)}
            SelectProps={{ multiple: true }}
            fullWidth
            margin="normal"
          >
            {existingSubjects.map(subject => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name} ({subject.teacher}), S
              </MenuItem>
            ))}
            {existingGroups.map(group => (
              group.type !== "halfterm" && (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}, G
                </MenuItem>
              )
            ))}
          </TextField>
        )}
        <Button type="submit" variant="contained" color="primary">
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </form>
      <Divider style={{ margin: "20px 0" }} />
      <Typography variant="h5" gutterBottom>Existing Subjects</Typography>
      <List>
        {existingSubjects.map(subject => (
          <ListItem key={subject.id}>
            <ListItemText primary={subject.name} secondary={subject.teacher} />
          </ListItem>
        ))}
      </List>
      <Divider style={{ margin: "20px 0" }} />
      <Typography variant="h5" gutterBottom>Existing Groups</Typography>
      <List>
        {existingGroups.map(group => (
          <ListItem key={group.id} button onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}>
            <ListItemText primary={group.name} secondary={`Click to view members`} />
            {selectedGroup === group.id && (
              <List component="div" disablePadding>
                {group.members.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={member} />
                  </ListItem>
                ))}
              </List>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default SubjectAdminDashboard;
