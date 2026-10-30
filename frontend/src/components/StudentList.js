import {
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRequest } from "../hooks/useRequest";
import NumberField from "./NumberField";
import { Edit, Newspaper } from "@mui/icons-material";
import { setMarksheetData } from "../context/slices/marksheetSlice";
import { setFormatValue } from "../context/slices/formatSlice";
import SubjectSelectModal from "./SubjectSelectModal";
import { useNavigate } from "react-router";
import { StudentListPEEditing, StudentListPEViewing } from "./StudentListPE";

export const StudentListConsolidated_ = ({
  students,
  exam,
  profile,
  class: classe,
}) => {
  const scholasticSubjects = [
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
  ];

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">R No</TableCell>
              <TableCell align="left">Surname</TableCell>
              <TableCell align="left">First Name</TableCell>
              <>
                <TableCell align="left">Math</TableCell>
                <TableCell align="left">English</TableCell>
                <TableCell align="left">Hindi</TableCell>
                <TableCell align="left">Sci</TableCell>
                <TableCell align="left">French</TableCell>
                <TableCell align="left">SS</TableCell>
                <TableCell align="left">HS</TableCell>
                <TableCell align="left">Painting</TableCell>
                <TableCell align="left">HC</TableCell>
                <TableCell align="left">AI</TableCell>
                <TableCell align="left">IT</TableCell>
              </>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log(
              profile.role,
              exam,
              classe,
              students.filter(
                (student) => student.class_div.division == classe,
              ),
            )}

            {students.map((student) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{student.roll_no}</TableCell>
                <TableCell align="left">{student.first_name}</TableCell>
                <TableCell align="left">{student.surname}</TableCell>
                {console.log(student.marks, "stevavane")}
                {scholasticSubjects.map((sub) => {
                  console.log(
                    student.marks.filter(
                      (mark) =>
                        mark.exam.abbreviation == exam &&
                        mark.subject.sub == sub,
                    ),
                    "oasises",
                  );
                  const score = student.marks.filter(
                    (mark) =>
                      mark.exam.abbreviation == exam && mark.subject.sub == sub,
                  )[0].score;
                  return (
                    <TableCell>
                      {score == 1000
                        ? "✅"
                        : score == -1000
                          ? "N/A"
                          : score == 500
                            ? "ab"
                            : score}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        startIcon={<Newspaper />}
        sx={{ marginTop: 2 }}
        variant="contained"
        color="error"
      >
        Generate Report
      </Button>
    </>
  );
};

const subjectMaxMarks = {
  HS: 70,
  IT: 50,
  HC: 50,
  AI: 50,
  Painting: 30,
  _: 80,
};

const StudentListAcademicViewing = ({
  students,
  exam,
  profile,
  class: classe,
}) => {
  const profSubject = useSelector((state) => state.subject.subject);
  const maxMarks = exam.includes("PT")
    ? 20
    : subjectMaxMarks[profSubject] || 80;
  const passMarks = Math.ceil(maxMarks / 3);

  const navigate = useNavigate();
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  console.log(profSubject, "pr str", profSubject);
  // console.log(
  //   JSON.parse(profSubjectStr),
  //   JSON.parse(
  //     '{"id":51,"subject":{"id":2,"sub":"English"},"classes":[{"id":1,"grade":10,"division":"A"}]}',
  //   ),
  //   9997,
  // );
  const handleOpenSubjectModal = () => {
    const format =
      profSubject.subject.sub == "All" ? "consolidated" : "individual";
    const subject = profSubject.subject.sub;
    const classeData = classe;
    navigate(
      `/mk-ta?format=${format}&subject=${subject}&class=${classeData}&exam=${exam}`,
    );
  };

  const handleCloseSubjectModal = () => {
    setOpenSubjectModal(false);
  };
  console.log("dlbaa", students);
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">R No</TableCell>
              <TableCell align="left">Surname</TableCell>
              <TableCell align="left">First Name</TableCell>
              {profile.role == "Administrator" || (
                <TableCell align="left">Marks/{maxMarks}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log(
              profile.role,
              exam,
              classe,
              students.filter(
                (student) => student.class_div.division == classe,
              ),
            )}

            {(profile.role == "Administrator"
              ? students.filter((st) => st.class_div.division == classe)
              : (exam == "INT"
                  ? students.filter(
                      (student) => student.class_div.division == classe,
                    )
                  : students.filter(
                      (student) =>
                        student.class_div.division == classe &&
                        student.marks.filter(
                          (mark) =>
                            mark.exam.abbreviation == exam &&
                            mark.subject.sub == profSubject.subject.sub,
                        )[0].score != -1000,
                    )) &&
                (exam == "INT"
                  ? students.filter(
                      (student) => student.class_div.division == classe,
                    )
                  : students.filter(
                      (student) =>
                        student.class_div.division == classe &&
                        student.marks.filter(
                          (mark) =>
                            mark.exam.abbreviation == exam &&
                            mark.subject.sub == profSubject.subject.sub,
                        )[0].score != -1000,
                    ))
            ).map((student) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{student.roll_no}</TableCell>
                <TableCell align="left">{student.first_name}</TableCell>
                <TableCell align="left">{student.surname}</TableCell>
                {profile.role == "Administrator" || (
                  <TableCell
                    align="left"
                    sx={{
                      fontFamily: "Geist Mono, monospace !important",
                      color:
                        student.marks.filter(
                          (mark) =>
                            mark.exam.abbreviation == exam &&
                            mark.subject.sub == profSubject.subject.sub,
                        )[0].score < passMarks
                          ? "red"
                          : "black",
                    }}
                  >
                    {/* {console.log("Shacri", exam)}0 */}
                    {exam != "INT" &&
                      student.marks.filter(
                        (mark) =>
                          mark.exam.abbreviation == exam &&
                          mark.subject.sub == profSubject.subject.sub,
                      )[0].score < 10 && (
                        <span style={{ visibility: "hidden" }}>{"a"}</span>
                      )}
                    {exam == "INT"
                      ? 0
                      : student.marks.filter(
                            (mark) =>
                              mark.exam.abbreviation == exam &&
                              mark.subject.sub == profSubject.subject.sub,
                          )[0].score == "1000"
                        ? "✅"
                        : student.marks.filter(
                              (mark) =>
                                mark.exam.abbreviation == exam &&
                                mark.subject.sub == profSubject.subject.sub,
                            )[0].score == -1000
                          ? "N/A"
                          : student.marks.filter(
                                (mark) =>
                                  mark.exam.abbreviation == exam &&
                                  mark.subject.sub == profSubject.subject.sub,
                              )[0].score == 500
                            ? "ab"
                            : student.marks.filter(
                                (mark) =>
                                  mark.exam.abbreviation == exam &&
                                  mark.subject.sub == profSubject.subject.sub,
                              )[0].score}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        startIcon={<Newspaper />}
        sx={{ marginTop: 2 }}
        variant="contained"
        color="error"
        onClick={handleOpenSubjectModal}
      >
        Generate Report
      </Button>
    </>
  );
};

const StudentListAcademicEditing = ({
  students,
  setStudents,
  setEditing,
  exam,
  profile,
  editing,
  class: classe,
  handleSubmit,
  profSubject,
}) => {
  const { request } = useRequest();
  const maxMarks = subjectMaxMarks[profSubject] || 80;

  const navigate = useNavigate();
  const [openSubjectModal, setOpenSubjectModal] = useState(false);

  const [editedMarks, setEditedMarks] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const data = {};

    students.forEach((student) => {
      const mark = student.marks.find(
        (m) =>
          m.exam.abbreviation === exam &&
          m.subject.sub === profSubject.subject.sub,
      );

      if (mark) {
        data[student.id] = {
          markId: mark.id,
          exam,
          subject: profSubject.subject.sub,
          score: mark.score,
          originalScore: mark.score,
        };
      }
    });

    setEditedMarks((previous) => {
      Object.keys(data).forEach((studentId) => {
        const draft = previous[studentId];
        if (
          draft &&
          draft.markId === data[studentId].markId &&
          draft.exam === exam &&
          draft.subject === profSubject.subject.sub &&
          draft.score !== draft.originalScore
        ) {
          data[studentId] = draft;
        }
      });
      return data;
    });
  }, [students, exam, profSubject.subject.sub]);

  const filteredStudents =
    profile.role === "Administrator"
      ? students.filter((st) => st.class_div.division === classe)
      : exam === "INT"
        ? students.filter((st) => st.class_div.division === classe)
        : students.filter((student) => {
            const mark = student.marks.find(
              (m) =>
                m.exam.abbreviation === exam &&
                m.subject.sub === profSubject.subject.sub,
            );

            return (
              student.class_div.division === classe &&
              mark &&
              mark.score !== -1000
            );
          });

  const handleAbsentChange = (studentId, checked) => {
    setEditedMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: checked
          ? 500
          : prev[studentId].originalScore === 500
            ? 0
            : prev[studentId].originalScore,
      },
    }));
  };

  const handleMarkChange = (studentId, value) => {
    setEditedMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: value,
      },
    }));
  };
  const [alertOpen, setAlertOpen] = useState("");

  const saveChanges = async () => {
    if (
      Object.values(editedMarks).some(
        (mark) => !Number.isFinite(Number(mark.score)),
      )
    ) {
      setAlertOpen("Enter a valid number for each score.");
      return;
    }

    const changed = Object.entries(editedMarks)
      .filter(([_, m]) => Number(m.score) !== Number(m.originalScore))
      .map(([studentId, m]) => ({
        studentId: Number(studentId),
        id: m.markId,
        score: Number(m.score),
      }));

    console.log(editedMarks);

    const errorChanged = Object.entries(editedMarks).filter(
      ([id, a]) =>
        Number(a.score) > maxMarks &&
        ![500, -500, 1000, -1000].includes(Number(a.score)),
    );

    console.log(changed, errorChanged, errorChanged.length);
    if (errorChanged.length) {
      console.log("Oi");
      setAlertOpen(
        "Some marks are above " + maxMarks + ". Check the ones marked in red.",
      );
      return;
    }
    if (!changed.length) {
      console.log("In the Juengle");
      setEditing(false);
      return;
    }

    setAlertOpen("");

    dispatch(
      setMarksheetData({
        students,
        subjects:
          profile?.subjects?.map((sub) =>
            sub && sub.subject ? sub.subject.sub : null,
          ) ?? [].filter((a) => a),
      }),
    );

    await request("post", "/api/mark/update", {
      marks: changed,
      exam,
      subject: profSubject.subject,
    });
    const newStudentsReq = await request("get", "/api/student");
    const newStudents = newStudentsReq.data;
    console.log(newStudentsReq, newStudents, "daatta");
    setStudents(newStudents);
    setEditing(false);

    if (handleSubmit) handleSubmit();
  };

  return (
    <>
      <Collapse in={alertOpen} sx={{ position: "fixed", top: 0 }}>
        <Alert severity="error" variant="filled">
          There is an error: {alertOpen}
        </Alert>
      </Collapse>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">R No</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Absent</TableCell>
              <TableCell>Marks/{maxMarks}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStudents.map((student) => {
              const current = editedMarks[student.id];

              if (!current) return null;

              return (
                <TableRow key={student.id}>
                  <TableCell align="center">{student.roll_no}</TableCell>

                  <TableCell>{student.first_name}</TableCell>

                  <TableCell>{student.surname}</TableCell>

                  <TableCell>
                    <Checkbox
                      checked={current.score === 500}
                      onChange={(e) =>
                        handleAbsentChange(student.id, e.target.checked)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      type="text"
                      slotProps={{ htmlInput: { inputMode: "decimal" } }}
                      max={20}
                      placeholder={
                        current.score == "1000"
                          ? "Enter"
                          : current.score == "500"
                            ? "Absent"
                            : ""
                      }
                      value={
                        current.score === 500
                          ? "Absent"
                          : current.score === 1000
                            ? ""
                            : current.score
                      }
                      error={
                        current.score &&
                        ((current.score > maxMarks &&
                          !["500", "1000"].includes(current.score)) ||
                          isNaN(Number(current.score)))
                      }
                      sx={
                        current.score > maxMarks &&
                        !["500", "1000"].includes(current.score)
                          ? { color: "red" }
                          : {}
                      }
                      disabled={
                        editing
                          ? current.score === 500
                          : !["1000", "-1000"].includes(current.score)
                      }
                      onChange={(e) =>
                        handleMarkChange(student.id, e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ mt: 2 }} onClick={saveChanges}>
        Save Changes
      </Button>
    </>
  );
};

const StudentListViewing = ({
  students,
  setStudents,
  setEditing,
  exam,
  profile,
  editing,
  class: classe,
  handleSubmit,
}) => {
  const profSubject = useSelector((state) => state.subject.subject);
  if (
    ["PE", "Yoga", "NSS", "MA", "ATL", "WE", "Comp"].includes(
      profSubject.subject.sub,
    )
  )
    return (
      <StudentListPEViewing
        {...{
          students,
          setStudents,
          setEditing,
          exam,
          profile,
          editing,
          class: classe,
          handleSubmit,
          profSubject,
        }}
      />
    );
  else
    return (
      <StudentListAcademicViewing
        {...{
          students,
          setStudents,
          setEditing,
          exam,
          profile,
          editing,
          class: classe,
          handleSubmit,
          profSubject,
        }}
      />
    );
};

const StudentListEditing = ({
  students,
  setStudents,
  setEditing,
  exam,
  profile,
  editing,
  class: classe,
  handleSubmit,
}) => {
  const profSubject = useSelector((state) => state.subject.subject);
  if (
    ["PE", "Yoga", "NSS", "MA", "ATL", "WE", "Comp"].includes(
      profSubject.subject.sub,
    )
  )
    return (
      <StudentListPEEditing
        {...{
          students,
          setStudents,
          setEditing,
          exam,
          profile,
          editing,
          class: classe,
          handleSubmit,
          profSubject,
        }}
      />
    );
  else
    return (
      <StudentListAcademicEditing
        {...{
          students,
          setStudents,
          setEditing,
          exam,
          profile,
          editing,
          class: classe,
          handleSubmit,
          profSubject,
        }}
      />
    );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const { request, isLoading, error } = useRequest();
  const exam = useSelector((state) => state.exam.exam);
  const profile = useSelector((state) => state.profile);
  const classe = useSelector((state) => state.class);
  useEffect(() => {
    (async () => {
      const studentData = (await request("get", "/api/student")).data;
      let filteredStudentData = [];
      // if (profile?.subjects[0]?.subjects?.sub != "Hi") {
      //   console.log(exam, profile,
      //     studentData.map(
      //       (student) =>
      //         student.marks.filter(
      //           (mark) =>
      //             mark.exam.abbreviation == exam
      //         )
      //     ),
      //   );
      // filteredStudentData = studentData.filter(
      //   (student) =>
      //     student.marks.filter(
      //       (mark) =>
      //         mark.exam.abbreviation == exam &&
      //         mark.subject.sub == profSubject.subject.sub,
      //     )[0].score != -1000,
      // );
      // }
      setStudents(studentData);
    })();
  }, [exam, profile]);

  const [editing, setEditing] = useState(false);
  useEffect(() => {
    console.log("lion ceccah", editing);
  }, [editing]);
  return (
    <div>
      <Button
        startIcon={<Edit />}
        variant="contained"
        color="secondary"
        onClick={() => setEditing((oe) => !oe)}
      >
        Edit
      </Button>
      {editing ? (
        <StudentListEditing
          {...{
            students,
            exam,
            profile,
            class: classe,
            editing,
            setStudents,
            setEditing,
          }}
        />
      ) : (
        <StudentListViewing {...{ students, exam, profile, class: classe }} />
      )}
    </div>
  );
  // if (profile?.role && profile.role == "Administrator")
  //   return (
  //     <StudentListViewing {...{ students, exam, profile, class: classe }} />
  //   );
  // else
  //   return (
  //     <StudentListEditing {...{ students, exam, profile, class: classe }} />
  //   );
};

export const StudentListConsolidated = () => {
  const [students, setStudents] = useState([]);
  const { request, isLoading, error } = useRequest();
  const exam = useSelector((state) => state.exam.exam);
  const profile = useSelector((state) => state.profile);
  const classe = useSelector((state) => state.class);
  useEffect(() => {
    (async () => {
      const studentData = (await request("get", "/api/student")).data;
      let filteredStudentData = [];
      // if (profile?.subjects[0]?.subjects?.sub != "Hi") {
      //   console.log(exam, profile,
      //     studentData.map(
      //       (student) =>
      //         student.marks.filter(
      //           (mark) =>
      //             mark.exam.abbreviation == exam
      //         )
      //     ),
      //   );
      // filteredStudentData = studentData.filter(
      //   (student) =>
      //     student.marks.filter(
      //       (mark) =>
      //         mark.exam.abbreviation == exam &&
      //         mark.subject.sub == profSubject.subject.sub,
      //     )[0].score != -1000,
      // );
      // }
      setStudents(studentData);
    })();
  }, [exam, profile]);

  const [editing, setEditing] = useState(false);
  useEffect(() => {
    console.log("lion ceccah", editing);
  }, [editing]);

  return (
    <div>
      <StudentListConsolidated_
        {...{ students, exam, profile, class: classe }}
      />
    </div>
  );
  // if (profile?.role && profile.role == "Administrator")
  //   return (
  //     <StudentListViewing {...{ students, exam, profile, class: classe }} />
  //   );
  // else
  //   return (
  //     <StudentListEditing {...{ students, exam, profile, class: classe }} />
  //   );
};
export default StudentList;
