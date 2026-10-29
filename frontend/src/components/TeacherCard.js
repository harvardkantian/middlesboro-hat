import { Delete, Edit } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { memo, useState } from "react";
import AddEditTeacher from "./AddEditTeacher";
import DeleteModal from "./DeleteModal";
import { useSelector } from "react-redux";

const TeacherCard = ({ teacher }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const role = useSelector((state) => state.profile.role);
  console.log(role, "sussudio");
  return (
    <>
      <Grid size={{ md: 3, sm: 6, xs: 12 }}>
        <Card sx={{ position: "relative", padding: 0 }}>
          {role === "Administrator" && (
            <CardActions sx={{ position: "absolute", right: 0 }}>
              <IconButton onClick={() => setModalOpen(true)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => setDeleteModalOpen(true)}>
                <Delete />
              </IconButton>
            </CardActions>
          )}
          <CardContent
            sx={{
              paddingBottom: 16,
              ...(role === "Administrator" ? { marginTop: "30px" } : {marginTop: "16px"}),
            }}
          >
            <Typography variant="h5" color="body1">
              {teacher.first_name} {teacher.surname}
            </Typography>
            {teacher.role.id == 2 ? (
              <>
                {teacher.subject_classes.map((sub) => (
                  <Typography variant="body1">
                    Teaches {sub.subject.sub} in 10
                    {sub.classes.map((cl) => cl.division)}
                  </Typography>
                ))}

                {teacher.class_tr && (
                  <Typography variant="body1">
                    Class Tr of {teacher.class_tr?.grade}
                    {teacher.class_tr?.division}
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body1">{teacher.role.role}</Typography>
            )}

            <Typography variant="body1" color="textSecondary"></Typography>
          </CardContent>
        </Card>
      </Grid>
      <DeleteModal
        teacher={teacher}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      />
      <AddEditTeacher
        open={modalOpen}
        setOpen={setModalOpen}
        mode={{ mode: "edit", teacher }}
      />
    </>
  );
};
export default memo(TeacherCard);
