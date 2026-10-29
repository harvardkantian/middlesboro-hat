import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router";

const QuickTable = ({
  subject,
  exam,
  class: classe,
  colspan = 4,
  rowspan = 4,
  children,
}) => {
  return (
    <table className="quickTable">
      <thead>
        <tr>
          <th colSpan={colspan}>VIDYA VIKAS ACADEMY</th>
        </tr>
        <tr>
          <th colSpan={colspan}>
            {subject} {exam} Marklist Of Class{" "}
            {classe.toUpperCase()}
          </th>
        </tr>
      </thead>
      {children}
    </table>
  );
};

const MarksheetTemplate = () => {
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
  const {
    class: classe,
    exam: { exam },
    marksheet: { rows, columns },
    format: { format, subject: formatSubject, class: formatClass },
    student: allStudents,
  } = useSelector((state) => state);
  console.log(exam, "ytqat");

  const students = allStudents.filter(
    (stu) => `${stu.class_div.grade}${stu.class_div.division}` == formatClass,
  );
  console.log(students, 9991);

  const [profile, setProfile] = useState({});
  useEffect(() => {
    const profileStr = localStorage.getItem("profile");
    setProfile(JSON.parse(profileStr));
  }, []);

  const ptIndividualSubject = () => {
    return (
      <QuickTable subject={formatSubject} exam={exam} class={formatClass}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Surname</th>
            <th>First Name</th>
            <th>Marks/20</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((student) => (
              <tr>
                <td>{student.roll_no}</td>
                <td>{student.surname}</td>
                <td>{student.first_name}</td>
                <td>
                  {
                    student.marks.filter(
                      (m) =>
                        m.exam.abbreviation == exam &&
                        m.subject.sub == formatSubject,
                    )[0].score
                  }
                </td>
              </tr>
            ))}
        </tbody>
      </QuickTable>
    );
  };
  const midTermsPBIndividualSubject = () => {
    return (
      <QuickTable
        subject={formatSubject}
        exam={exam}
        class={formatClass}
        colspan={6}
      >
        <thead>
          <tr>
            <th colSpan={3}></th>
            <th colSpan={3}>{formatSubject}</th>
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
          {students &&
            students.map((student) => (
              <tr>
                <td>{student.roll_no}</td>
                <td>{student.surname}</td>
                <td>{student.first_name}</td>
                <td>
                  {
                    student.marks.filter(
                      (m) =>
                        m.exam.abbreviation == exam &&
                        m.subject.sub == formatSubject,
                    )[0].score
                  }
                </td>
                <td>
                  {(
                    (student.marks.filter(
                      (m) =>
                        m.exam.abbreviation == exam &&
                        m.subject.sub == formatSubject,
                    )[0].score *
                      5) /
                    4
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </QuickTable>
    );
  };
  const ptConsolidatedSubject = () => {
    const uniqueSubjects = [];
    console.log(140, { hee: "hee" });
    console.table(students);
    if (students.length > 0)
      students[0].marks.forEach((mark) => {
        const {
          subject: { sub },
        } = mark;
        console.log(140, { hee: "hee" });
        console.dir(mark);
        console.dir(mark.subject);
        console.dir(mark.subject.sub);
        console.dir(sub);
        if (mark.exam.abbreviation == exam && !uniqueSubjects.includes(sub))
          uniqueSubjects.push(sub);
        console.dir(uniqueSubjects);
      });
    uniqueSubjects.sort(
      (a, b) => subjectList.indexOf(a) - subjectList.indexOf(b),
    );
    if (classe == "A") uniqueSubjects = uniqueSubjects.filter(a => a != "French")
    if (classe == "B") uniqueSubjects = uniqueSubjects.filter(a => a != "Hindi")
    if (classe == "C") uniqueSubjects = uniqueSubjects.filter(a => a != "Hindi")
    return (
      <QuickTable
        subject={formatSubject}
        exam={exam}
        class={formatClass}
        colspan={uniqueSubjects.length + 3}
      >
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Surname</th>
            <th>First Name</th>
            {/* {JSON.stringify(students)} */}
            {uniqueSubjects.map((sub) => (
              <th>{sub}/20</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((student) => (
              <tr>
                <td>{student.roll_no}</td>
                <td>{student.surname}</td>
                <td>{student.first_name}</td>
                {uniqueSubjects.map((sub) => {
                  const mark = student.marks.filter(
                    (mk) =>
                      mk.subject.sub == sub && mk.exam.abbreviation == exam,
                  )[0].score;
                  return (
                    <td>{mark == 1000 ? "✅" : mark == -1000 ? "NA" : mark}</td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </QuickTable>
    );
  };
  const formatTable = {
    individual: {
      PT1: ptIndividualSubject,
      PT2: ptIndividualSubject,
      PT3: ptIndividualSubject,
      MT: midTermsPBIndividualSubject,
      PB1: midTermsPBIndividualSubject,
      PB2: midTermsPBIndividualSubject,
      PB3: midTermsPBIndividualSubject,
    },
    consolidated: {
      PT1: ptConsolidatedSubject,
      PT2: ptConsolidatedSubject,
      PT3: ptConsolidatedSubject,
      MT: midTermsPBIndividualSubject,
      PB1: midTermsPBIndividualSubject,
      PB2: midTermsPBIndividualSubject,
      PB3: midTermsPBIndividualSubject,
    },
  };

  const downloadPDF = () => {
    const element = document.getElementById("pdf-content");

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (students.length > 0) window.print();
    // navigate("/");
  }, [students]);

  return (
    <div id="pdf-content">
      {formatTable.individual[exam]}
      <p>Generated by Marksheet</p>
    </div>
  );
};
export default MarksheetTemplate;
