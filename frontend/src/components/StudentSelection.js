import { createContext, useContext, useState } from "react";
import { Alert, Button, Checkbox, Stack } from "@mui/material";
import { useRequest } from "../hooks/useRequest";

const StudentSelectionContext = createContext(null);

export function StudentSelectionProvider({ students, setStudents, children }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const { request, isLoading } = useRequest();

  const toggleStudent = (studentId, checked) => {
    setSelectedIds((current) =>
      checked
        ? current.includes(studentId) ? current : [...current, studentId]
        : current.filter((id) => id !== studentId),
    );
  };

  const toggleStudents = (visibleStudents, checked) => {
    const visibleIds = visibleStudents.map((student) => student.id);
    setSelectedIds((current) => checked
      ? [...new Set([...current, ...visibleIds])]
      : current.filter((id) => !visibleIds.includes(id)));
  };

  const deleteSelected = async () => {
    if (!selectedIds.length || isLoading) return;
    setDeleteError("");
    try {
      await request("delete", "/api/student/bulk-delete", { ids: selectedIds });
      setStudents((current) => current.filter((student) => !selectedIds.includes(student.id)));
      setSelectedIds([]);
    } catch (error) {
      setDeleteError(
        error.response?.data?.Error || "Could not delete the selected students.",
      );
    }
  };

  return (
    <StudentSelectionContext.Provider
      value={{ selectedIds, toggleStudent, toggleStudents, deleteSelected, isLoading }}
    >
      <Stack spacing={1} sx={{ mb: 1 }}>
        {deleteError && <Alert severity="error">{deleteError}</Alert>}
        {selectedIds.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={deleteSelected}
            disabled={isLoading}
            sx={{ alignSelf: "flex-start" }}
          >
            {isLoading ? "Deleting…" : `Delete Selected (${selectedIds.length})`}
          </Button>
        )}
      </Stack>
      {children}
    </StudentSelectionContext.Provider>
  );
}

export function StudentSelectionCheckbox({ studentId }) {
  const selection = useContext(StudentSelectionContext);
  if (!selection) return null;
  return (
    <Checkbox
      size="small"
      checked={selection.selectedIds.includes(studentId)}
      onChange={(event) => selection.toggleStudent(studentId, event.target.checked)}
      inputProps={{ "aria-label": "Select student" }}
    />
  );
}

export function StudentSelectAllCheckbox({ students }) {
  const selection = useContext(StudentSelectionContext);
  if (!selection) return null;
  const visibleIds = students.map((student) => student.id);
  const selectedCount = visibleIds.filter((id) => selection.selectedIds.includes(id)).length;
  return (
    <Checkbox
      size="small"
      checked={visibleIds.length > 0 && selectedCount === visibleIds.length}
      indeterminate={selectedCount > 0 && selectedCount < visibleIds.length}
      onChange={(event) => selection.toggleStudents(students, event.target.checked)}
      inputProps={{ "aria-label": "Select all visible students" }}
    />
  );
}
