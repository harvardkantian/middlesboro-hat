import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRequest } from "../hooks/useRequest";

const subjectOrder = [
  "Math", "English", "Hindi", "Sci", "French", "SS", "HS", "Painting", "HC", "AI", "IT",
];
const subjectMaxMarks = {
  Math: 80, English: 80, Hindi: 80, Sci: 80, French: 80, SS: 80,
  HS: 70, Painting: 30, HC: 50, AI: 50, IT: 50,
};
const coScholasticGroups = [
  { title: "Activities", subjects: ["PE", "Yoga", "NSS", "NCC", "MA"] },
  { title: "Skills", subjects: ["WE", "ATL", "Comp"] },
];

const formatMark = (score) => {
  if (score === undefined || score === null || score === "") return "—";
  if (Number(score) === 500) return "Ab";
  if (Number(score) === 1000) return "Not done";
  if (Number(score) === -1000) return "N/A";
  return score;
};

const gradeFromScore = (score, max) => {
  const value = Number(score);
  if (!Number.isFinite(value) || value < 0 || value > max) return "—";
  const percentage = (value / max) * 100;
  if (percentage >= 91) return "A1";
  if (percentage >= 81) return "A2";
  if (percentage >= 71) return "B1";
  if (percentage >= 61) return "B2";
  if (percentage >= 51) return "C1";
  if (percentage >= 41) return "C2";
  if (percentage >= 33) return "D";
  return "E";
};

const SignatureSection = () => (
  <Box
    className="marksheet-signatures"
    sx={{
      mt: 5,
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      columnGap: 4,
      rowGap: 4,
      breakInside: "avoid",
    }}
  >
    {["Subject Teacher", "HOD", "Section Head", "Assistant VP", "Vice Principal", "Principal"].map((title) => (
      <Box className="marksheet-signature" key={title} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Box className="marksheet-signature-line" sx={{ width: "80%", borderTop: "1px solid #555", mt: 3 }} />
        <Typography variant="subtitle2" align="center">{title}</Typography>
      </Box>
    ))}
  </Box>
);

export default function MarksheetTemplate() {
  const [params] = useSearchParams();
  const classe = params.get("class") || "";
  const exam = params.get("exam") || "";
  const subject = params.get("subject") || "";
  const format = params.get("format") || "individual";
  const { request, isLoading, error } = useRequest();
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    let active = true;
    request("get", "/api/student")
      .then((response) => {
        if (active) setAllStudents(response.data);
      })
      .catch((requestError) => console.error(requestError));
    return () => { active = false; };
  }, [request]);

  const students = useMemo(
    () => allStudents
      .filter((student) => student.class_div?.division === classe)
      .filter((student) => {
        if (format !== "individual") return true;
        const mark = student.marks?.find(
          (item) => item.exam?.abbreviation === exam && item.subject?.sub === subject,
        );
        return mark?.score !== -1000;
      })
      .sort((a, b) => Number(a.roll_no) - Number(b.roll_no)),
    [allStudents, classe, exam, format, subject],
  );

  const scoreFor = (student, sub) => student.marks?.find(
    (mark) => mark.exam?.abbreviation === exam && mark.subject?.sub === sub,
  )?.score;

  const subjects = useMemo(() => {
    if (format !== "consolidated") return [subject];
    const available = new Set(
      students.flatMap((student) => student.marks
        ?.filter((mark) => mark.exam?.abbreviation === exam)
        .map((mark) => mark.subject?.sub) || []),
    );
    let ordered = subjectOrder.filter((sub) => available.has(sub));
    if (classe.endsWith("A")) ordered = ordered.filter((sub) => sub !== "French");
    if (["B", "C"].some((division) => classe.endsWith(division))) {
      ordered = ordered.filter((sub) => sub !== "Hindi");
    }
    return ordered;
  }, [classe, exam, format, students, subject]);

  const isPT = exam.startsWith("PT");
  const isScholasticConsolidated = format === "consolidated" && !isPT;
  const showCoScholastic = isScholasticConsolidated && exam === "MT";
  const titleSubject = format === "consolidated" ? "Consolidated" : subject;

  const coScholasticScoreFor = (student, sub) => {
    const matches = student.marks?.filter(
      (mark) => ["SP", "SE"].includes(mark.exam?.abbreviation) && mark.subject?.sub === sub,
    );
    return matches?.find((mark) => mark.exam?.abbreviation === "SP")?.score ??
      matches?.find((mark) => mark.exam?.abbreviation === "SE")?.score;
  };

  const formatCoScholasticMark = (score) => {
    const display = formatMark(score);
    return display === "—" || ["Ab", "Not done", "N/A"].includes(display)
      ? display
      : `${display}/5`;
  };

  const coScholasticAverage = (student, groupSubjects) => {
    const validScores = groupSubjects
      .map((sub) => Number(coScholasticScoreFor(student, sub)))
      .filter((score) => Number.isFinite(score) && score >= 0 && score <= 5);
    return validScores.length
      ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(2)
      : "—";
  };

  const renderStudentIdentity = (student) => (
    <>
      <TableCell align="center">{student.roll_no}</TableCell>
      <TableCell>{student.surname}</TableCell>
      <TableCell>{student.first_name}</TableCell>
    </>
  );

  const tableHeader = () => (
    <TableHead>
      {isScholasticConsolidated && (
        <TableRow>
          <TableCell rowSpan={2} align="center">Roll No</TableCell>
          <TableCell rowSpan={2}>Surname</TableCell>
          <TableCell rowSpan={2}>First Name</TableCell>
          {subjects.map((sub) => (
            <TableCell key={sub} align="center" colSpan={3}>{sub}</TableCell>
          ))}
          {showCoScholastic && coScholasticGroups.map(({ title, subjects: groupSubjects }) => (
            <TableCell key={title} align="center" colSpan={groupSubjects.length + 1}>{title}</TableCell>
          ))}
          <TableCell rowSpan={2} align="center">Total</TableCell>
          <TableCell rowSpan={2} align="center">Percentage</TableCell>
        </TableRow>
      )}
      <TableRow>
        {!isScholasticConsolidated && (
          <>
            <TableCell align="center">Roll No</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>First Name</TableCell>
          </>
        )}
        {isScholasticConsolidated ? (
          [
            ...subjects.flatMap((sub) => [
              <TableCell key={`${sub}-raw`} align="center">{sub}/{subjectMaxMarks[sub] || 80}</TableCell>,
              <TableCell key={`${sub}-100`} align="center">{sub}/100</TableCell>,
              <TableCell key={`${sub}-grade`} align="center">Grade</TableCell>,
            ]),
            ...(showCoScholastic ? coScholasticGroups.flatMap(({ title, subjects: groupSubjects }) => [
              ...groupSubjects.map((sub) => (
                <TableCell key={`${title}-${sub}`} align="center">{sub}/5</TableCell>
              )),
              <TableCell key={`${title}-average`} align="center">Average</TableCell>,
            ]) : []),
          ]
        ) : format === "individual" ? (
          isPT ? (
            <TableCell align="center">Marks/20</TableCell>
          ) : (
            <>
              <TableCell align="center">MO/{subjectMaxMarks[subject] || 80}</TableCell>
              <TableCell align="center">MO/100</TableCell>
              <TableCell align="center">Grade</TableCell>
            </>
          )
        ) : isPT ? (
          subjects.map((sub) => <TableCell key={sub} align="center">{sub}/20</TableCell>)
        ) : (
          <>
            {subjects.map((sub) => <TableCell key={sub} align="center">{sub}/20</TableCell>)}
          </>
        )}
      </TableRow>
    </TableHead>
  );

  const renderScores = (student) => {
    if (format === "individual") {
      const score = scoreFor(student, subject);
      if (isPT) return <TableCell align="center">{formatMark(score)}</TableCell>;
      const max = subjectMaxMarks[subject] || 80;
      const valid = Number.isFinite(Number(score)) && Number(score) >= 0 && Number(score) <= max;
      return (
        <>
          <TableCell align="center">{formatMark(score)}</TableCell>
          <TableCell align="center">{valid ? ((Number(score) * 100) / max).toFixed(1) : formatMark(score)}</TableCell>
          <TableCell align="center">{gradeFromScore(score, max)}</TableCell>
        </>
      );
    }

    if (isPT) {
      return subjects.map((sub) => (
        <TableCell key={sub} align="center">{formatMark(scoreFor(student, sub))}</TableCell>
      ));
    }

    const normalizedScores = subjects.map((sub) => {
      const score = Number(scoreFor(student, sub));
      const max = subjectMaxMarks[sub] || 80;
      return Number.isFinite(score) && score >= 0 && score <= max ? (score * 100) / max : null;
    });
    const total = normalizedScores.reduce((sum, score) => sum + (score ?? 0), 0);
    const totalPossible = normalizedScores.filter((score) => score !== null).length * 100;

    return (
      <>
        {subjects.flatMap((sub) => {
          const score = scoreFor(student, sub);
          const max = subjectMaxMarks[sub] || 80;
          const valid = Number.isFinite(Number(score)) && Number(score) >= 0 && Number(score) <= max;
          return [
            <TableCell key={`${sub}-raw`} align="center">{formatMark(score)}</TableCell>,
            <TableCell key={`${sub}-100`} align="center">
              {valid ? ((Number(score) * 100) / max).toFixed(1) : formatMark(score)}
            </TableCell>,
            <TableCell key={`${sub}-grade`} align="center">{gradeFromScore(score, max)}</TableCell>,
          ];
        })}
        {showCoScholastic && coScholasticGroups.flatMap(({ title, subjects: groupSubjects }) => [
          ...groupSubjects.map((sub) => (
            <TableCell key={`${title}-${sub}`} align="center">
              {formatCoScholasticMark(coScholasticScoreFor(student, sub))}
            </TableCell>
          )),
          <TableCell key={`${title}-average`} align="center">
            {coScholasticAverage(student, groupSubjects)}
          </TableCell>,
        ])}
        <TableCell align="center">{total.toFixed(1)}</TableCell>
        <TableCell align="center">{totalPossible ? `${((total / totalPossible) * 100).toFixed(1)}%` : "—"}</TableCell>
      </>
    );
  };

  const coScholasticColumnCount = showCoScholastic
    ? coScholasticGroups.reduce((total, group) => total + group.subjects.length + 1, 0)
    : 0;
  const columnCount = 3 + (format === "individual" ? (isPT ? 1 : 3) : isPT ? subjects.length : subjects.length * 3 + coScholasticColumnCount + 2);

  if (isLoading) return <Typography sx={{ p: 2 }}>Loading marksheet…</Typography>;
  if (error) return <Typography color="error" sx={{ p: 2 }}>{String(error)}</Typography>;

  return (
    <Box className="marksheet-print-root" id="pdf-content" sx={{ p: { xs: 1, md: 3 }, maxWidth: "100%" }}>
      <Typography className="marksheet-title" variant="h5" align="center" fontWeight={700}>
        VIDYA VIKAS ACADEMY
      </Typography>
      <Typography className="marksheet-subtitle" variant="subtitle1" align="center" sx={{ mb: 2 }}>
        {titleSubject} {exam} Marklist Of Class {classe.toUpperCase()}
      </Typography>

      <TableContainer
        component={Paper}
        className="marksheet-table-container"
        sx={{
          boxShadow: 1,
          overflowX: "auto",
          "@media print": { overflow: "visible", boxShadow: "none" },
        }}
      >
        <Table
          className="marksheet-table"
          size="small"
          aria-label={`${titleSubject} marksheet`}
          sx={{
            minWidth: 650,
            borderCollapse: "collapse",
            "& th, & td": { border: "1px solid", borderColor: "divider", py: 1, px: 1.5 },
            "& thead th": { bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 700, whiteSpace: "nowrap" },
            "& tbody tr:nth-of-type(even)": { bgcolor: "action.hover" },
            "@media print": {
              minWidth: 0,
              width: "100%",
              fontSize: "8pt",
              "& th, & td": { py: 0.4, px: 0.6, fontSize: "8pt" },
              "& thead th": { printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" },
            },
          }}
        >
          {tableHeader()}
          <TableBody>
            {students.length ? students.map((student) => (
              <TableRow key={student.id}>
                {renderStudentIdentity(student)}
                {renderScores(student)}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columnCount} align="center">No students or marks found for this class and exam.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <SignatureSection />
      <Button className="marksheet-print-button remove-print" variant="contained" sx={{ mt: 3 }} onClick={() => window.print()}>
        Print Marksheet
      </Button>
    </Box>
  );
}
