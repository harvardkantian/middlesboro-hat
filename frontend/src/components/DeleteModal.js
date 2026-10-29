import {
    Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
  IconButton,
} from "@mui/material";
import { useRequest } from "../hooks/useRequest";
import { Close } from "@mui/icons-material";

const DeleteModal = ({ teacher, open, setOpen }) => {
  const { request, isLoading, error } = useRequest();
  const handleDelete = async () => {
    const res = await request("delete", `/api/teacher/${teacher.id}`);
    location.reload();
  };
  return (
    <Dialog
      keepMounted
      slots={{ transition: Grow }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box sx={{ justifyContent: "space-between" }}>
        <DialogTitle>Delete Teacher?</DialogTitle>
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
        <DialogContentText>
          Are you sure you want to delete{" "}
          <b>
            {teacher.first_name} {teacher.surname}
          </b>
          ? This action is <b>irreversible</b> and you will have to re-add the
          teacher.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="standard" onClick={handleDelete}>
          Delete Teacher
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteModal;
