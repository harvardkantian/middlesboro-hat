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
import {
  StudentSelectAllCheckbox,
  StudentSelectionCheckbox,
  StudentSelectionProvider,
  sortStudentsByRollNo,
} from "./StudentSelection";

const GenerateReportButton = ({ exam, classe }) => {
  const navigate = useNavigate();
  const query = new URLSearchParams({
    format: "consolidated",
    subject: "All",
    class: classe,
    exam,
  });

  return (
    <Button
      startIcon={<Newspaper />}
      sx={{ marginTop: 2 }}
      variant="contained"
      color="error"
      onClick={() => navigate(`/mk-ta?${query.toString()}`)}
    >
      Generate Report
    </Button>
  );
};

export const getCoScholasticGrade = (average) => {
  const score = Number(average);
  if (!Number.isFinite(score) || score < 0 || score > 5) return "—";
  if (score > 4) return "A";
  if (score > 3) return "B";
  if (score > 2) return "C";
  if (score > 1) return "D";
  return "E";
};

export const StudentListConsolidatedPT_ = ({
  students,
  setStudents,
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
  const visibleStudents = sortStudentsByRollNo(students.filter(
    (student) => student.class_div?.division === classe,
  ));

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <StudentSelectAllCheckbox students={visibleStudents} />
              </TableCell>
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

            {visibleStudents.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <StudentSelectionCheckbox studentId={student.id} />
                  </TableCell>
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
                        mark.exam.abbreviation == exam &&
                        mark.subject.sub == sub,
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
      <GenerateReportButton exam={exam} classe={classe} />
    </>
  );
};
const StudentListConsolidatedPB_Legacy = ({
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
                <TableCell align="left">Math/80</TableCell>
                <TableCell align="left">Math/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">English/80</TableCell>
                <TableCell align="left">English/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Hindi/80</TableCell>
                <TableCell align="left">Hindi/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Sci/80</TableCell>
                <TableCell align="left">Sci/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">French/80</TableCell>
                <TableCell align="left">French/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">SS/80</TableCell>
                <TableCell align="left">SS/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">HS/70</TableCell>
                <TableCell align="left">HS/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">IT/50</TableCell>
                <TableCell align="left">IT/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">AI/50</TableCell>
                <TableCell align="left">AI/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">HC/50</TableCell>
                <TableCell align="left">HC/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Painting/30</TableCell>
                <TableCell align="left">Painting/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">Percentage</TableCell>
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

            {students
              .filter((student) => student.class_div.division === classe)
              .map((student) => (
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
                        mark.exam.abbreviation == exam &&
                        mark.subject.sub == sub,
                    )[0].score;
                    return (
                      <>
                        <TableCell>
                          {score == 1000
                            ? "✅"
                            : score == -1000
                              ? "N/A"
                              : score == 500
                                ? "ab"
                                : score}
                        </TableCell>
                        <TableCell>
                          {score == 1000
                            ? "✅"
                            : score == -1000
                              ? "N/A"
                              : score == 500
                                ? "ab"
                                : (
                                    (score * 100) /
                                    (subjectMaxMarks[sub] || 80)
                                  ).toFixed(1)}
                        </TableCell>
                        <TableCell>L</TableCell>
                      </>
                    );
                  })}
                  {(() => {
                    const firstFiveScores = scholasticSubjects
                      .slice(0, 5)
                      .map((sub) => {
                        const score = Number(
                          student.marks.find(
                            (mark) =>
                              mark.exam.abbreviation == exam &&
                              mark.subject.sub == sub,
                          )?.score,
                        );
                        return Number.isFinite(score) &&
                          ![500, -500, 1000, -1000].includes(score)
                          ? (score * 100) / (subjectMaxMarks[sub] || 80)
                          : 0;
                      });
                    const total = firstFiveScores.reduce(
                      (sum, score) => sum + score,
                      0,
                    );
                    return (
                      <>
                        <TableCell>{total.toFixed(1)}</TableCell>
                        <TableCell>
                          {((total / 500) * 100).toFixed(1)}%
                        </TableCell>
                      </>
                    );
                  })()}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GenerateReportButton exam={exam} classe={classe} />
    </>
  );
};
export const StudentListConsolidatedPB_ = ({
  students,
  setStudents,
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
  const visibleStudents = sortStudentsByRollNo(students.filter(
    (student) => student.class_div?.division === classe,
  ));

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" rowSpan={2}>
                <StudentSelectAllCheckbox students={visibleStudents} />
              </TableCell>
              <TableCell align="center">R No</TableCell>
              <TableCell align="left">Surname</TableCell>
              <TableCell align="left">First Name</TableCell>
              <>
                <TableCell align="left">Math/80</TableCell>
                <TableCell align="left">Math/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">English/80</TableCell>
                <TableCell align="left">English/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Hindi/80</TableCell>
                <TableCell align="left">Hindi/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Sci/80</TableCell>
                <TableCell align="left">Sci/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">French/80</TableCell>
                <TableCell align="left">French/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">SS/80</TableCell>
                <TableCell align="left">SS/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">HS/70</TableCell>
                <TableCell align="left">HS/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">IT/50</TableCell>
                <TableCell align="left">IT/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">AI/50</TableCell>
                <TableCell align="left">AI/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">HC/50</TableCell>
                <TableCell align="left">HC/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Painting/30</TableCell>
                <TableCell align="left">Painting/100</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">Percentage</TableCell>
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

            {visibleStudents.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <StudentSelectionCheckbox studentId={student.id} />
                  </TableCell>
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
                        mark.exam.abbreviation == exam &&
                        mark.subject.sub == sub,
                    )[0].score;
                    return (
                      <>
                        <TableCell>
                          {score == 1000
                            ? "✅"
                            : score == -1000
                              ? "N/A"
                              : score == 500
                                ? "ab"
                                : score}
                        </TableCell>
                        <TableCell>
                          {score == 1000
                            ? "✅"
                            : score == -1000
                              ? "N/A"
                              : score == 500
                                ? "ab"
                                : (
                                    (score * 100) /
                                    (subjectMaxMarks[sub] || 80)
                                  ).toFixed(1)}
                        </TableCell>
                        <TableCell>L</TableCell>
                      </>
                    );
                  })}
                  {(() => {
                    const firstFiveScores = scholasticSubjects
                      .slice(0, 5)
                      .map((sub) => {
                        const score = Number(
                          student.marks.find(
                            (mark) =>
                              mark.exam.abbreviation == exam &&
                              mark.subject.sub == sub,
                          )?.score,
                        );
                        return Number.isFinite(score) &&
                          ![500, -500, 1000, -1000].includes(score)
                          ? (score * 100) / (subjectMaxMarks[sub] || 80)
                          : 0;
                      });
                    const total = firstFiveScores.reduce(
                      (sum, score) => sum + score,
                      0,
                    );
                    return (
                      <>
                        <TableCell>{total.toFixed(1)}</TableCell>
                        <TableCell>
                          {((total / 500) * 100).toFixed(1)}%
                        </TableCell>
                      </>
                    );
                  })()}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GenerateReportButton exam={exam} classe={classe} />
    </>
  );
};

export const StudentConsolidatedMT = ({
  students,
  exam,
  class: classe,
}) => {
  const scholasticSubjects = [
    { subject: "Math", max: 80 },
    { subject: "English", max: 80 },
    { subject: "Hindi", max: 80 },
    { subject: "Sci", max: 80 },
    { subject: "French", max: 80 },
    { subject: "SS", max: 80 },
    { subject: "HS", max: 70 },
    { subject: "Painting", max: 30 },
    { subject: "HC", max: 50 },
    { subject: "AI", max: 50 },
    { subject: "IT", max: 50 },
  ];
  const groupedSubjects = [
    { title: "Activities", subjects: ["PE", "Yoga", "NSS", "NCC", "MA"] },
    { title: "Skills", subjects: ["WE", "ATL", "Comp"] },
  ];
  const getScore = (student, subject) =>
    student.marks?.find(
      (mark) =>
        mark.exam?.abbreviation === exam && mark.subject?.sub === subject,
    )?.score;
  const getCoScholasticScore = (student, subject) => {
    const matchingMarks = student.marks?.filter(
      (mark) =>
        ["SP", "SE"].includes(mark.exam?.abbreviation) &&
        mark.subject?.sub === subject,
    );
    return (
      matchingMarks?.find((mark) => mark.exam?.abbreviation === "SP")?.score ??
      matchingMarks?.find((mark) => mark.exam?.abbreviation === "SE")?.score
    );
  };
  const getCohortGrade = (student, subject) => {
    const gradeLevel = student.class_div?.grade;
    if (gradeLevel === undefined || gradeLevel === null) return "—";
    const cohort = students.filter((candidate) => {
      if (String(candidate.class_div?.grade) !== String(gradeLevel))
        return false;
      if (Number(gradeLevel) !== 10) return true;
      return ["A", "B", "C"].includes(
        String(candidate.class_div?.division).trim().toUpperCase(),
      );
    });
    const ranked = [];

    for (const candidate of cohort) {
      const score = getScore(candidate, subject);
      if (score === undefined || score === null || score === "") return "—";
      const numericScore = Number(score);
      if ([500, 1000, 5000, -1000].includes(numericScore)) {
        continue;
      }
      if (Number.isFinite(numericScore) && numericScore >= 0) {
        ranked.push({ id: candidate.id, score: numericScore });
      } else {
        return "—";
      }
    }

    ranked.sort((a, b) => b.score - a.score);
    const rank = ranked.findIndex((entry) => entry.id === student.id);
    if (rank < 0) return "—";
    // Each consecutive eighth of the combined cohort gets one grade band;
    // the final eighth is E.
    const percentileGrades = ["A1", "A2", "B1", "B2", "C1", "C2", "D"];
    const band = Math.floor((rank / Math.max(1, ranked.length)) * 8);
    return percentileGrades[band] ?? "E";
  };
  const printableScore = (score, max = 5) => {
    if (score === undefined || score === null || score === "") return "—";
    if (Number(score) === 5000) return "✅";
    if (Number(score) === 1000) return "✅";
    if (Number(score) === -1000) return "N/A";
    if (Number(score) === 500) return "ab";
    return `${score}/${max}`;
  };
  const rawScore = (score) => {
    if (score === undefined || score === null || score === "") return "—";
    if (Number(score) === 5000) return "✅";
    if (Number(score) === 1000) return "✅";
    if (Number(score) === -1000) return "N/A";
    if (Number(score) === 500) return "ab";
    return score;
  };
  const isBelowOneThird = (score, max) => {
    const numericScore = Number(score);
    return (
      Number.isFinite(numericScore) &&
      numericScore >= 0 &&
      numericScore < max / 3
    );
  };
  const average = (student, subjects) => {
    const scores = subjects
      .map((subject) => Number(getCoScholasticScore(student, subject)))
      .filter((score) => Number.isFinite(score) && score >= 0 && score <= 5);
    return scores.length
      ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(
          2,
        )
      : "—";
  };
  const visibleStudents = sortStudentsByRollNo(students.filter(
    (student) => student.class_div?.division === classe,
  ));

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="MT consolidated marks">
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} padding="checkbox">
                <StudentSelectAllCheckbox students={visibleStudents} />
              </TableCell>
              <TableCell rowSpan={2} align="center">
                R No
              </TableCell>
              <TableCell rowSpan={2}>Surname</TableCell>
              <TableCell rowSpan={2}>First Name</TableCell>
              {scholasticSubjects.map(({ subject }) => (
                <TableCell key={subject} align="center" colSpan={3}>
                  {subject}
                </TableCell>
              ))}
              {groupedSubjects.map(({ title, subjects }) => (
                <TableCell
                  key={title}
                  align="center"
                  colSpan={subjects.length + 1}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {scholasticSubjects.flatMap(({ subject, max }) => [
                <TableCell key={`${subject}-raw`} align="center">
                  Marks
                </TableCell>,
                <TableCell key={`${subject}-100`} align="center">
                  Marks/100
                </TableCell>,
                <TableCell key={`${subject}-grade`} align="center">
                  Grade
                </TableCell>,
              ])}
              {groupedSubjects.flatMap(({ title, subjects }) => [
                ...subjects.map((subject) => (
                  <TableCell key={`${title}-${subject}`} align="center">
                    {subject}/5
                  </TableCell>
                )),
                <TableCell key={`${title}-average`} align="center">
                  Grade
                </TableCell>,
              ])}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleStudents.map((student) => (
                <TableRow key={student.id ?? student.roll_no}>
                  <TableCell padding="checkbox">
                    <StudentSelectionCheckbox studentId={student.id} />
                  </TableCell>
                  <TableCell align="center">{student.roll_no}</TableCell>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.surname}</TableCell>
                  {scholasticSubjects.flatMap(({ subject, max }) => {
                    const score = getScore(student, subject);
                    const numericScore = Number(score);
                    const hasNumericScore =
                      Number.isFinite(numericScore) &&
                      numericScore >= 0 &&
                      numericScore <= max;
                    const lowMark = isBelowOneThird(score, max);
                    const percentage = hasNumericScore
                      ? ((numericScore * 100) / max)
                      : printableScore(score, max);
                    return [
                      <TableCell
                        key={`${subject}-raw`}
                        align="center"
                        sx={{ color: lowMark ? "error.main" : "inherit" }}
                      >
                        {rawScore(score)}
                      </TableCell>,
                      <TableCell
                        key={`${subject}-100`}
                        align="center"
                        sx={{ color: lowMark ? "error.main" : "inherit" }}
                      >
                        {isNaN(Number(percentage))
                          ? percentage
                          : Math.round(percentage)}
                      </TableCell>,
                      <TableCell
                        key={`${subject}-grade`}
                        align="center"
                        sx={{ color: lowMark ? "error.main" : "inherit" }}
                      >
                        {getCohortGrade(student, subject)}
                      </TableCell>,
                    ];
                  })}
                  {groupedSubjects.flatMap(({ title, subjects }) => [
                    ...subjects.map((subject) => (
                      <TableCell
                        key={`${title}-${subject}`}
                        align="center"
                        sx={{
                          color: isBelowOneThird(
                            getCoScholasticScore(student, subject),
                            5,
                          )
                            ? "error.main"
                            : "inherit",
                        }}
                      >
                        {printableScore(getCoScholasticScore(student, subject))}
                      </TableCell>
                    )),
                    <TableCell
                      key={`${title}-average`}
                      align="center"
                      sx={{
                        color: isBelowOneThird(average(student, subjects), 5)
                          ? "error.main"
                          : "inherit",
                      }}
                    >
                      {average(student, subjects) === "—"
                        ? "—"
                        : getCoScholasticGrade(average(student, subjects))}
                    </TableCell>,
                  ])}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GenerateReportButton exam={exam} classe={classe} />
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
  setStudents,
  exam,
  profile,
  class: classe,
}) => {
  const profSubject = useSelector((state) => state.subject.subject);
  const maxMarks = exam.includes("PT")
    ? 20
    : subjectMaxMarks[profSubject] || 80;
  const passMarks = Math.ceil(maxMarks / 3);
  const getStudentMark = (student) => student.marks?.find(
    (mark) =>
      mark.exam?.abbreviation === exam &&
      mark.subject?.sub === profSubject.subject.sub,
  );

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
  const classStudents = sortStudentsByRollNo(students.filter(
    (student) => student.class_div?.division === classe,
  ));
  const visibleStudents = sortStudentsByRollNo(profile.role === "Administrator" || exam === "INT"
    ? classStudents
    : classStudents.filter((student) => {
        const mark = getStudentMark(student);
        return mark && mark.score !== -1000;
      }));
  console.log("dlbaa", students);
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <StudentSelectAllCheckbox students={visibleStudents} />
              </TableCell>
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

            {visibleStudents.map((student) => {
              const mark = getStudentMark(student);
              return (
              <TableRow
                key={student.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <StudentSelectionCheckbox studentId={student.id} />
                </TableCell>
                <TableCell align="center">{student.roll_no}</TableCell>
                <TableCell align="left">{student.first_name}</TableCell>
                <TableCell align="left">{student.surname}</TableCell>
                {profile.role == "Administrator" || (
                  <TableCell
                    align="left"
                    sx={{
                      fontFamily: "Geist Mono, monospace !important",
                      color:
                      mark?.score < passMarks
                          ? "red"
                          : "black",
                    }}
                  >
                    {/* {console.log("Shacri", exam)}0 */}
                    {exam != "INT" &&
                      mark?.score < 10 && (
                        <span style={{ visibility: "hidden" }}>{"a"}</span>
                      )}
                    {exam == "INT"
                      ? 0
                      : mark?.score == "1000"
                        ? "✅"
                        : mark?.score == -1000
                          ? "N/A"
                          : mark?.score == 500
                            ? "ab"
                            : mark?.score}
                  </TableCell>
                )}
              </TableRow>
              );
            })}
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

  const filteredStudents = sortStudentsByRollNo(
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
          }),
  );

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
  const profSubject = useSelector((state) => state);
  console.log("Bonjour Saulut Coment cava", profSubject);
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

const StudentList = ({ refreshKey = 0 }) => {
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
  }, [exam, profile, refreshKey]);

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
      <StudentSelectionProvider students={students} setStudents={setStudents}>
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
          <StudentListViewing
            {...{ students, setStudents, exam, profile, class: classe }}
          />
        )}
      </StudentSelectionProvider>
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

export const StudentListConsolidated = ({ refreshKey = 0 }) => {
  const [students, setStudents] = useState([]);
  const { request, isLoading, error } = useRequest();
  const exam = useSelector((state) => state.exam.exam);
  const profile = useSelector((state) => state.profile);
  const classe = useSelector((state) => state.class);
  useEffect(() => {
    (async () => {
      const studentData = (await request("get", "/api/student")).data;
      // let filteredStudentData = [];
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
  }, [exam, profile, refreshKey]);

  const [editing, setEditing] = useState(false);
  useEffect(() => {
    console.log("lion ceccah", editing);
  }, [editing]);

  if (exam.includes("PT")) {
    return (
      <StudentSelectionProvider students={students} setStudents={setStudents}>
        <StudentListConsolidatedPT_
          {...{ students, exam, profile, class: classe }}
        />
      </StudentSelectionProvider>
    );
  } else if (exam == "MT") {
    return (
      <StudentSelectionProvider students={students} setStudents={setStudents}>
        <StudentConsolidatedMT {...{ students, exam, profile, class: classe }} />
      </StudentSelectionProvider>
    );
  } else if (exam.includes("PB")) {
    return (
      <StudentSelectionProvider students={students} setStudents={setStudents}>
        <StudentListConsolidatedPB_
          {...{ students, exam, profile, class: classe }}
        />
      </StudentSelectionProvider>
    );
  }
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
