import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useRequest } from "../hooks/useRequest";

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
];

const QuickTable = ({
  subject,
  exam,
  class: classe,
  colspan = 4,
  children,
}) => (
  <table className="quickTable" style={{ width: "100%" }}>
    <caption className="printTitle">
      <div>VIDYA VIKAS ACADEMY</div>
      <div>
        {subject} {exam} Marklist Of Class {classe.toUpperCase()}
      </div>
    </caption>

    {children}
  </table>
);

const SignatureSection = () => {
  return (
    <div>
      <div
        style={{
          marginTop: 30,
          display: "grid",
          columnGap: 50,
          gridTemplateColumns: "calc(100%/3) calc(100%/3) calc(100%/3)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Subject Teacher</h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>HOD</h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Section Head</h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Assistant VP</h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Vice Principal</h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Principal</h3>
        </div>
      </div>
    </div>
  );
};

export default function MarksheetTemplate() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const classe = params.get("class");
  const exam = params.get("exam");
  const subject = params.get("subject");
  const format = params.get("format");

  const { request, isLoading, error } = useRequest();
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await request("get", "/api/student");
        setAllStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, [request]);

  console.log(
    "antandec",
    allStudents.map(
      (s) =>
        s.marks.filter(
          (m) => m.exam.abbreviation === exam && m.subject.sub === subject,
        )[0],
    ),
  );

  console.log(
    exam,
    subject,
    allStudents.map((s) =>
      s.marks.filter(
        (m) => m.exam.abbreviation == exam && m.subject.sub == subject,
      ),
    ),
    "hall of fame",
  );

  const students = allStudents.filter(
    (s) =>
      s.class_div.division == classe &&
      s.marks.filter(
        (m) => m.exam.abbreviation === exam && m.subject.sub === subject,
      )[0].score != -1000,
  );

  const getMark = (student, sub) => {
    const mark = student.marks.find(
      (m) => m.exam.abbreviation === exam && m.subject.sub === sub,
    );

    return mark?.score == 500
      ? "Ab"
      : mark?.score == 1000
        ? "Not done"
        : mark?.score;
  };

  function PtIndividualSubject() {
    return (
      <QuickTable subject={subject} exam={exam} class={classe}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Surname</th>
            <th>First Name</th>
            <th>Marks/20</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td style={{ textAlign: "center" }}>{student.roll_no}</td>
              <td>{student.first_name}</td>
              <td>{student.surname}</td>
              <td style={{ textAlign: "center" }}>
                {getMark(student, subject)}
              </td>
            </tr>
          ))}
        </tbody>
      </QuickTable>
    );
  }

  function MidTermsPBIndividualSubject() {
    return (
      <QuickTable subject={subject} exam={exam} class={classe} colspan={6}>
        <thead>
          <tr>
            <th colSpan={3}></th>
            <th colSpan={3}>{subject}</th>
          </tr>
          <tr>
            <th>Roll No</th>
            <th>Surname</th>
            <th>First Name</th>
            <th>MO/80</th>
            <th>MO/100</th>
            <th>GRADE</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => {
            const score = getMark(student, subject);

            return (
              <tr key={student.id}>
                <td>{student.roll_no}</td>
                <td>{student.surname}</td>
                <td>{student.first_name}</td>
                <td>{score}</td>
                <td>{((score * 5) / 4).toFixed(2)}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </QuickTable>
    );
  }

  function PtConsolidatedSubject() {
    let uniqueSubjects = [];

    if (students.length) {
      uniqueSubjects = [
        ...new Set(
          students[0].marks
            .filter((m) => m.exam.abbreviation === exam)
            .map((m) => m.subject.sub),
        ),
      ];
    }

    uniqueSubjects.sort(
      (a, b) => subjectList.indexOf(a) - subjectList.indexOf(b),
    );

    if (classe.endsWith("A"))
      uniqueSubjects = uniqueSubjects.filter((s) => s !== "French");

    if (classe.endsWith("B") || classe.endsWith("C"))
      uniqueSubjects = uniqueSubjects.filter((s) => s !== "Hindi");

    return (
      <QuickTable
        subject="Consolidated"
        exam={exam}
        class={classe}
        colspan={uniqueSubjects.length + 3}
      >
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Surname</th>
            <th>First Name</th>

            {uniqueSubjects.map((sub) => (
              <th key={sub}>{sub}/20</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.roll_no}</td>
              <td>{student.surname}</td>
              <td>{student.first_name}</td>

              {uniqueSubjects.map((sub) => {
                const mark = getMark(student, sub);

                return (
                  <td key={sub}>
                    {mark === 1000 ? "✅" : mark === -1000 ? "NA" : mark}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </QuickTable>
    );
  }

  useEffect(() => {
    if (students.length) {
      // window.print();
      // navigate("/");
    }
  }, [students]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{String(error)}</p>;

  const formatTable = {
    individual: {
      PT1: <PtIndividualSubject />,
      PT2: <PtIndividualSubject />,
      PT3: <PtIndividualSubject />,
      MT: <MidTermsPBIndividualSubject />,
      PB1: <MidTermsPBIndividualSubject />,
      PB2: <MidTermsPBIndividualSubject />,
      PB3: <MidTermsPBIndividualSubject />,
    },
    consolidated: {
      PT1: <PtConsolidatedSubject />,
      PT2: <PtConsolidatedSubject />,
      PT3: <PtConsolidatedSubject />,
      MT: <MidTermsPBIndividualSubject />,
      PB1: <MidTermsPBIndividualSubject />,
      PB2: <MidTermsPBIndividualSubject />,
      PB3: <MidTermsPBIndividualSubject />,
    },
  };

  return (
    <div id="pdf-content">
      {console.log(format, formatTable[format])}
      {formatTable[format]?.[exam]}
      <SignatureSection />
    </div>
  );
}
