import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useState } from "react";
import { useRequest } from "../hooks/useRequest";

const enrolledSubjects = [
  "Math", "English", "Hindi", "Sci", "French", "SS", "HS", "Painting",
  "HC", "AI", "IT", "PE", "Yoga", "NSS", "MA", "Comp", "WE", "ATL",
  "Art", "Music", "SD",
];

export default function AddStudent({ className, onAdded }) {
  const [open, setOpen] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [formError, setFormError] = useState("");
  const { request, isLoading } = useRequest();

  const resetAndClose = () => {
    setOpen(false);
    setFormError("");
    setRollNo("");
    setFirstName("");
    setSurname("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const parsedRollNo = Number(rollNo);
    if (!Number.isInteger(parsedRollNo) || parsedRollNo < 0) {
      setFormError("Enter a valid roll number.");
      return;
    }
    if (!firstName.trim() || !surname.trim()) {
      setFormError("Enter the student's first name and surname.");
      return;
    }

    try {
      const response = await request("post", "/api/add-students", {
        sheets: [
          {
            class_name: className,
            excel_data: [
              {
                no: parsedRollNo,
                first_name: firstName.trim(),
                surname: surname.trim(),
                subjects: enrolledSubjects,
              },
            ],
          },
        ],
      });

      if (response.data.message === "No new students.") {
        setFormError("A student with this name already exists.");
        return;
      }

      onAdded?.();
      resetAndClose();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.detail ||
          requestError.response?.data?.Error ||
          "Could not add the student. Check the details and try again.",
      );
    }
  };

  return (
    <>
      <Button
        startIcon={<PersonAdd />}
        variant="contained"
        sx={{ my: 2 }}
        onClick={() => setOpen(true)}
      >
        Add Student
      </Button>
      <Dialog open={open} onClose={resetAndClose} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Student</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "12px !important" }}>
            <TextField
              autoFocus
              required
              type="number"
              label="Roll No"
              value={rollNo}
              onChange={(event) => setRollNo(event.target.value)}
              inputProps={{ min: 0, step: 1 }}
            />
            <TextField
              required
              label="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              required
              label="Surname"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
            {formError && <div role="alert" style={{ color: "#d32f2f" }}>{formError}</div>}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={resetAndClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Adding…" : "Add Student"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
