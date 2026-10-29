import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  Grow,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close, Remove } from "@mui/icons-material";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { useRequest } from "../hooks/useRequest";
import { useNavigate } from "react-router";

const AddEditTeacher = ({ mode: { mode, teacher }, open, setOpen }) => {
  const navigate = useNavigate();
  const subjectList = [
    "Math",
    "English",
    "Hindi",
    "Sci",
    "French",
    "SS",
    "HS",
    "Painting",
    "HC",
    "AI",
    "IT",
    "PE",
    "Yoga",
    "NSS",
    "MA",
    "Comp",
    "WE",
    "ATL",
    "Art",
    "Music",
    "SD",
  ];

  const classId = useId();
  const roleId = useId();

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [classTr, setClassTr] = useState("No");
  const [role, setRole] = useState("Teacher");
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
  if (open && (!teacher || !teacher.username)) {
      setUsername(
        `${firstName && firstName.toLowerCase()}${surname && surname[0] && surname?.[0].toLowerCase()}`,
      );
    }
  if (open && (!teacher || !teacher.password)) {
      setPassword(
        `${firstName && firstName.toLowerCase()}${surname && surname[0] && surname?.[0].toLowerCase()}123`,
      );
    }
  }, [open, teacher, firstName, surname]);
  useEffect(() => {
    console.log(teacher);
    if (teacher) {
      setFirstName(teacher?.first_name ?? "");
      setSurname(teacher?.surname ?? "");
      if (teacher?.classTr) setClassTr(`10${teacher?.class_tr?.division}`);
      else setClassTr("No");
      setRole(`${teacher?.role?.role}` ?? "Teacher");
      setUsername(`${teacher?.username}` ?? "");
      setSubjects(
        teacher?.subject_classes?.map(
          (sub) =>
            ({
              subject: sub.subject.sub,
              classes: "10" + sub?.classes?.map((cl) => cl?.division).join(""),
            }) ?? [],
        ),
      );
    }
  }, []);

  const [formErrors, setFormErrors] = useState({
    firstName: null,
    surname: null,
    role: null,
  });
  const { request, isLoading, error } = useRequest();

  const [formData, setFormData] = useState({
    selectValue: subjectList[0],
    classValue: "10ABC",
  });
  useEffect(() => {
    setFormErrors((ofe) => ({ ...ofe, masterError: error }));
  }, [error]);

  const handleSubmit = async () => {
    if (!firstName) setFormErrors((ofe) => ({ ...ofe, firstName: "Required" }));
    if (!surname) setFormErrors((ofe) => ({ ...ofe, surname: "Required" }));
    if (!role) setFormErrors((ofe) => ({ ...ofe, role: "Required" }));
    if (!username) setFormErrors((ofe) => ({ ...ofe, username: "Required" }));
    if (!password) setFormErrors((ofe) => ({ ...ofe, password: "Required" }));
    if (!firstName || !surname || !role || !username || !password) return;

    const res = await request("post", "/api/teacher", {
      first_name: firstName,
      surname,
      class_tr: classTr,
      subjects,
      role,
      username,
      password,
    });
    if (res) {
      localStorage.setItem("timer", true);
      navigate(0);
    }
  };
  const handleUpdateSubmit = async () => {
    if (!firstName) setFormErrors((ofe) => ({ ...ofe, firstName: "Required" }));
    if (!surname) setFormErrors((ofe) => ({ ...ofe, surname: "Required" }));
    if (!role) setFormErrors((ofe) => ({ ...ofe, role: "Required" }));
    if (!firstName || !surname || !role) return;

    const res = await request("patch", `/api/teacher/${teacher.id}`, {
      first_name: firstName,
      surname,
      class_tr: classTr,
      subjects,
      role,
      username, password
    });
    if (res) {
      localStorage.setItem("", "");
      navigate(0);
    }
  };
  return (
    <Dialog
      keepMounted
      open={open}
      onClose={() => setOpen(false)}
      slots={{ transition: Grow }}
    >
      <Box sx={{ justifyContent: "space-between" }}>
        <DialogTitle>
          {mode == "edit" ? "Edit Teacher" : "Add Teacher"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              required
              label="First Name"
              error={formErrors.firstName}
              helperText={formErrors.firstName}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              required
              label="Surname"
              error={formErrors.surname}
              helperText={formErrors.surname}
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ padding: 2, alignItems: "center" }}>
          <Grid size={{ xs: 6 }}>
            <Select
              fullWidth
              value={formData.selectValue || "English"}
              onChange={(e) => {
                setFormData((ofd) => ({ ...ofd, selectValue: e.target.value }));
              }}
            >
              {subjectList.map((sub) => (
                <MenuItem value={sub}>{sub}</MenuItem>
              ))}
              {/* <MenuItem value={"Dance"}>Dance</MenuItem> */}
            </Select>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Select
              fullWidth
              value={formData.classValue || "10ABC"}
              onChange={(e) => {
                setFormData((ofd) => ({ ...ofd, classValue: e.target.value }));
              }}
            >
              <MenuItem value={"10ABC"}>10ABC</MenuItem>
              <MenuItem value={"10AB"}>10AB</MenuItem>
              <MenuItem value={"10AC"}>10AC</MenuItem>
              <MenuItem value={"10BC"}>10BC</MenuItem>
              <MenuItem value={"10A"}>10A</MenuItem>
              <MenuItem value={"10B"}>10B</MenuItem>
              <MenuItem value={"10C"}>10C</MenuItem>
              {/* <MenuItem value={"Dance"}>Dance</MenuItem> */}
            </Select>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <IconButton
              onClick={() => {
                if (
                  !subjects.includes({
                    subject: formData.selectValue,
                    classes: formData.classValue,
                  })
                )
                  setSubjects((old) => [
                    ...old,
                    {
                      subject: formData.selectValue,
                      classes: formData.classValue,
                    },
                  ]);
                setFormData({
                  selectValue: subjectList[0],
                  classValue: "10ABC",
                });
              }}
            >
              <Add />
            </IconButton>
          </Grid>
        </Grid>
        {subjects.map((sub, i) => (
          <Grid
            container
            key={`${sub.subject}-${sub.classes}-${i}`}
            spacing={2}
            sx={{ paddingInline: 2, alignItems: "center" }}
          >
            <Grid size={{ xs: 6 }}>
              <Typography variant="body1">{sub.subject}</Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography variant="body1">{sub.classes}</Typography>
            </Grid>
            <Grid size={{ xs: 2 }}>
              <IconButton
                onClick={() =>
                  setSubjects((old) => old.filter((_, idx) => idx !== i))
                }
              >
                <Remove />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Grid container spacing={2} sx={{ padding: 2, alignItems: "center" }}>
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                fullWidth
                // labelId={`${roleId}-label`}
                // id={roleId}
                label="Role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (e.target.value == "Administrator") setClassTr("No");
                }}
              >
                <MenuItem value="Administrator">Administrator</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
              </Select>
              <FormHelperText>Teacher Role</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth disabled={role == "Administrator"}>
              <InputLabel>Class</InputLabel>
              <Select
                fullWidth
                label="Class"
                value={classTr}
                onChange={(e) => {
                  setClassTr(e.target.value);
                }}
              >
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="10A">10A</MenuItem>
                <MenuItem value="10B">10B</MenuItem>
                <MenuItem value="10C">10C</MenuItem>
              </Select>
              <FormHelperText>Class teacher?</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              required
              label="Username"
              autoComplete={false}
              error={formErrors.username}
              helperText={formErrors.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControl>
              <TextField
                fullWidth
                required
                label={mode == "edit" ? "New Password" : "Password"}
                autoComplete={false}
                error={formErrors.password}
                helperText={formErrors.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="body1" color="error">
          {formErrors.masterError}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
          paddingBottom: 2,
          paddingTop: 0,
        }}
      >
        <Button
          variant="contained"
          onClick={mode == "edit" ? handleUpdateSubmit : handleSubmit}
        >
          {mode == "edit" ? "Save Changes" : "Add Teacher"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddEditTeacher;
