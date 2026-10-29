import { DataGrid } from "@mui/x-data-grid";
import { Button, ButtonGroup, Fade } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { setFormatValue } from "../context/slices/formatSlice";
import { setMarksheetData } from "../context/slices/marksheetSlice";
import SubjectSelectModal from "./SubjectSelectModal";
import { setStudentsValue } from "../context/slices/studentSlice";

const getActivityGrade = (avg) => {
  if (avg > 4) return "A";
  if (avg > 3) return "B";
  if (avg > 2) return "C";
  if (avg > 1) return "D";
  return "";
};

// Derive grade from a normalised-to-100 score
const getScholasticGrade = (score100) => {
  if (score100 >= 91) return "A1";
  if (score100 >= 81) return "A2";
  if (score100 >= 71) return "B1";
  if (score100 >= 61) return "B2";
  if (score100 >= 51) return "C1";
  if (score100 >= 41) return "C2";
  if (score100 >= 33) return "D";
  return "E";
};

const SubjectList = () => {
  const classe = useSelector((store) => store.class);
  const exam = useSelector((store) => store.exam.exam);
  useEffect(() => {
    console.log("barstoltwo", classe);
  }, [classe]);
  console.info(
    exam,
    ["PT1", "PT2", "PT3"].includes(exam),
    exam.split("").map((s) => s.charCodeAt(0)),
  );

  useEffect(() => {
    dispatch(setFormatValue("individual"));
  }, []);
  const [cellError, setCellError] = useState(false);

  const subjectMarksMax = {
    Math: 80,
    English: 80,
    Hindi: 80,
    Phys: 80,
    Chem: 80,
    Bio: 80,
    French: 80,
    SS: 80,
    HS: 70,
    Painting: 30,
    HC: 50,
    AI: 50,
    IT: 50,
  };
  // For PT the max per subject is 20
  const ptMax = 20;

  const mainSubjects = [
    "Math",
    "English",
    "Hindi",
    "Phys",
    "Chem",
    "Bio",
    "French",
    "SS",
  ];

  const coScholasticGroups = {
    activity: ["PE", "Yoga", "NSS", "MA"],
    skill: ["WE", "ATL", "Comp"],
  };
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });
  const handleDeleteSelected = async () => {
    if (selectedRows.ids.size === 0) return;

    const selectedIds = [...selectedRows.ids];

    const studentIds = selectedIds
      .map((rowId) => students.find((s) => s.id === rowId)?.student_id)
      .filter(Boolean);

    try {
      await request("delete", "/api/student/bulk-delete", {
        ids: studentIds,
      });

      location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  const handleOpenSubjectModal = () => {
    setOpenSubjectModal(true);
  };

  const handleCloseSubjectModal = () => {
    setOpenSubjectModal(false);
  };
  const dispatch = useDispatch();
  const scholasticSubjectList = [
    "Math",
    "English",
    "Hindi",
    "Phys",
    "Chem",
    "Bio",
    "French",
    "SS",
    "HS",
    "Painting",
    "HC",
    "AI",
    "IT",
  ];

  const lastChange = useRef();

  const scholasticCols = [
    {
      field: "surname",
      headerName: "Surname",
      width: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "math",
      headerName: `Math/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["Math"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "math_mo_100",
      headerName: "Math/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "math_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "english",
      headerName: `English/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["English"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "english_mo_100",
      headerName: "English/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "english_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hindi",
      headerName: `Hindi/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["Hindi"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hindi_mo_100",
      headerName: "Hindi/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hindi_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phys",
      headerName: `Phys/${["PT1", "PT2", "PT3"].includes(exam) ? 6 : subjectMarksMax["Sci"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chem",
      headerName: `Chem/${["PT1", "PT2", "PT3"].includes(exam) ? 6 : subjectMarksMax["Sci"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bio",
      headerName: `Bio/${["PT1", "PT2", "PT3"].includes(exam) ? 8 : subjectMarksMax["Sci"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sci",
      headerName: `Sci/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["Sci"]}`,
      width: 90,
      editable: !["PT1", "PT2", "PT3"].includes(exam),
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sci_mo_100",
      headerName: "Sci/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sci_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "french",
      headerName: `French/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["French"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "french_mo_100",
      headerName: "French/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "french_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ss",
      headerName: `SS/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["SS"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ss_mo_100",
      headerName: "SS/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ss_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hs",
      headerName: `Home Sci/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["HS"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hs_mo_100",
      headerName: "Home Sci/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hs_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "painting",
      headerName: `Painting/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["Painting"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "painting_mo_100",
      headerName: "Painting/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "painting_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hc",
      headerName: `Healthcare/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["HC"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hc_mo_100",
      headerName: "Healthcare/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hc_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ai",
      headerName: `AI/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["AI"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ai_mo_100",
      headerName: "AI/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ai_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "it",
      headerName: `IT/${["PT1", "PT2", "PT3"].includes(exam) ? ptMax : subjectMarksMax["IT"]}`,
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "it_mo_100",
      headerName: "Info Tech/100",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "it_grade",
      headerName: "Grade",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
  ];

  const coScholasticCols = [
    {
      field: "pe",
      headerName: "PE",
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "yoga",
      headerName: "Yoga",
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nss",
      headerName: "NSS",
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ma",
      headerName: "MA",
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "activity_average",
      headerName: "Average",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "activity_grade",
      headerName: "Grade",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "we",
      headerName: "WE",
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "atl",
      headerName: "ATL",
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "comp",
      headerName: "Comp",
      width: 90,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "skill_average",
      headerName: "Average",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "skill_grade",
      headerName: "Grade",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
  ];

  // ─── Build INT columns per subject ────────────────────────────────────────
  const buildInternalColsForSubject = (sub) => {
    const prefix = sub.toLowerCase();
    return [
      {
        field: `${prefix}_pt1`,
        headerName: "PT1",
        width: 70,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_pt2`,
        headerName: "PT2",
        width: 70,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_pt3`,
        headerName: "PT3",
        width: 70,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_best_pt`,
        headerName: "Best PT",
        width: 80,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_pt`,
        headerName: "PT",
        width: 60,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_mul_assess`,
        headerName: "Multiple Assessment",
        width: 140,
        editable: true,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_portfolio`,
        headerName: "Portfolio",
        width: 100,
        editable: true,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_sub_enrich`,
        headerName: "Subject Enrichment",
        width: 140,
        editable: true,
        align: "center",
        headerAlign: "center",
      },
      {
        field: `${prefix}_total_int`,
        headerName: "Total Internal Marks",
        width: 140,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
    ];
  };

  const [columns, setColumns] = useState([
    {
      field: "roll_no",
      headerName: "Roll No",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "surname",
      headerName: "Surname",
      width: 100,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
  ]);

  const [students, setStudents] = useState([]);
  const groupingModel = useRef([]);
  const [editedRows, setEditedRows] = useState({});
  const originalStudents = useRef([]);
  const { request, isLoading } = useRequest();
  const profile = useSelector((state) => state.profile);

  const subjects = profile?.subjects;

  // ─── Track which fields are INT-editable ──────────────────────────────────
  const internalEditableFields = useRef(new Set());

  useEffect(() => {
    if (!profile?.subjects) return;

    if (exam === "SP" || exam === "SE") {
      buildColumnsPE(false);
    } else if (exam === "INT") {
      buildColumnsINT();
    } else {
      buildColumns(false);
    }
  }, [exam, classe, profile, profile?.subject]);

  const [showAllColumns, setShowAllColumns] = useState(false);

  // ─── Build INT columns ────────────────────────────────────────────────────
  const buildColumnsINT = () => {
    const baseCols = [
      {
        field: "roll_no",
        headerName: "Roll No",
        width: 50,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "first_name",
        headerName: "First Name",
        width: 100,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "surname",
        headerName: "Surname",
        width: 100,
        editable: false,
        align: "center",
        headerAlign: "center",
      },
    ];

    if (!profile?.subjects) return;

    console.log("PROFILE SUBJECTS", profile.subjects);
    console.log("SELECTED CLASS", classe);

    const mapsubs = profile.subjects
      .map((s) => (sub && sub.subject ? s.subject.sub : null))
      .filter((a) => a);
    const editableFields = new Set();
    const groupings = [];
    let allSubjectCols = [];

    mapsubs.forEach((sub) => {
      const cols = buildInternalColsForSubject(sub);
      allSubjectCols.push(...cols);

      cols.forEach((c) => {
        if (c.editable) editableFields.add(c.field);
      });

      groupings.push({
        groupId: sub,
        children: cols.map((col) => ({ field: col.field })),
      });
    });

    internalEditableFields.current = editableFields;
    groupingModel.current = groupings;
    setColumns([...baseCols, ...allSubjectCols]);
  };

  const buildColumns = (showAll = false) => {
    const baseCols = [
      {
        field: "roll_no",
        headerName: "Roll No",
        width: 50,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "first_name",
        headerName: "First Name",
        width: 100,
        editable: true,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "surname",
        headerName: "Surname",
        width: 100,
        editable: true,
        align: "center",
        headerAlign: "center",
      },
    ];

    const getSubjectColumns = (subject, cols) => {
      const prefix = subject.toLowerCase();

      if (["PT1", "PT2", "PT3"].includes(exam)) {
        if (subject === "Sci") {
          return cols.filter((col) =>
            ["phys", "chem", "bio", "sci"].includes(col.field),
          );
        }

        return cols.filter((col) => col.field === prefix);
      }

      return cols.filter(
        (col) => col.field === prefix || col.field.startsWith(`${prefix}_`),
      );
    };

    if (showAll) {
      const groupings = ["PT1", "PT2", "PT3"].includes(exam)
        ? []
        : scholasticSubjectList.map((sub) => ({
            groupId: sub,
            children: getSubjectColumns(sub, scholasticCols).map((col) => ({
              field: col.field,
            })),
          }));

      groupingModel.current = ["PT1", "PT2", "PT3"].includes(exam)
        ? []
        : groupings;
      const endCols = [
        { field: "total", headerName: "Total" },
        { field: "percentage", headerName: "Percentage" },
      ];
      setColumns([
        ...baseCols,
        ...scholasticCols.filter((col) => {
          if (["roll_no", "first_name", "surname"].includes(col.field))
            return false;
          if (["PT1", "PT2", "PT3"].includes(exam))
            return !col.field.includes("_");
          return true;
        }),
        ...endCols,
      ]);
      return;
    }

    if (!profile?.subjects) return;

    console.log("PROFILE SUBJECTS", profile.subjects);
    console.log("SELECTED CLASS", classe);
    profile.subjects.forEach((s) => {
      console.log(
        "barstol",
        classe,
        s.subject.sub,
        s.classes.map((c) => c.division),
        s.classes.some((c) => c.division === classe),
      );
    });
    console.log(
      "ISHIDA",
      profile.subjects.filter((s) =>
        s.classes.some((c) => c.division === classe),
      ),
    );
    const mapsubs = profile.subjects
      .filter((s) => s.classes.some((c) => c.division === classe))
      .map((s) => s.subject.sub);
    let matchedCols = [];
    let groupings = [];

    mapsubs.forEach((sub) => {
      const scholCols = getSubjectColumns(sub, scholasticCols);
      const coScholCols = getSubjectColumns(sub, coScholasticCols);
      const cols = [...scholCols, ...coScholCols];
      matchedCols.push(...cols);
      groupings.push({
        groupId: sub,
        children: cols.map((col) => ({ field: col.field })),
      });
    });

    groupingModel.current = ["PT1", "PT2", "PT3"].includes(exam)
      ? []
      : groupings;
    setColumns([...baseCols, ...matchedCols]);
  };

  const buildColumnsPE = (showAll = false) => {
    const baseCols = [
      {
        field: "roll_no",
        headerName: "Roll No",
        width: 50,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "first_name",
        headerName: "First Name",
        width: 100,
        editable: true,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "surname",
        headerName: "Surname",
        width: 100,
        editable: true,
        align: "center",
        headerAlign: "center",
      },
    ];

    const getSubjectColumns = (subject) => {
      const prefix = subject.toLowerCase();
      return coScholasticCols.filter(
        (col) => col.field === prefix || col.field.startsWith(`${prefix}_`),
      );
    };

    const subjectsToShow =
      exam === "SP"
        ? coScholasticGroups.activity
        : exam === "SE"
          ? coScholasticGroups.skill
          : [];

    let matchedCols = [];
    subjectsToShow.forEach((sub) => {
      matchedCols.push(...getSubjectColumns(sub));
    });

    if (exam === "SP") {
      matchedCols.push(
        coScholasticCols.find((c) => c.field === "activity_average"),
      );
      matchedCols.push(
        coScholasticCols.find((c) => c.field === "activity_grade"),
      );
    }
    if (exam === "SE") {
      matchedCols.push(
        coScholasticCols.find((c) => c.field === "skill_average"),
      );
      matchedCols.push(coScholasticCols.find((c) => c.field === "skill_grade"));
    }

    groupingModel.current = null;
    setColumns([...baseCols, ...matchedCols.filter(Boolean)]);
  };

  const [allStudents, setAllStudents] = useState([]);
  const [rawStudents, setRawStudents] = useState([]);

  useEffect(() => {
    (async () => {
      const studentres = await request("get", "/api/student");
      setAllStudents(studentres.data);
      dispatch(setStudentsValue(studentres.data));
    })();
  }, []);

  useEffect(() => {
    setRawStudents(allStudents.filter((a) => a.class_div.division == classe));
  }, [classe, allStudents]);

  // ─── Row building ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (exam === "INT") {
      buildInternalRows();
    } else {
      buildStandardRows();
    }
  }, [rawStudents, exam]);

  const buildInternalRows = () => {
    console.log("PROFILE SUBJECTS", profile.subjects);
    console.log("SELECTED CLASS", classe);
    const mapsubs = profile.subjects
      .filter((s) => s.classes.some((c) => c.division === classe))
      .map((s) => s.subject.sub);
    const finalStudentData = [];

    rawStudents.forEach((student, id) => {
      const row = {
        id,
        student_id: student.id,
        roll_no: student.roll_no,
        first_name: student.first_name,
        surname: student.surname,
      };

      mapsubs.forEach((sub) => {
        const prefix = sub.toLowerCase();

        const getPTScore = (examAbbr) => {
          const mark = student.marks.find(
            (m) => m.subject?.sub === sub && m.exam?.abbreviation === examAbbr,
          );
          if (!mark || mark.score === undefined || mark.score === null)
            return "";
          if (mark.score === -1000) return "N/A";
          if (mark.score === 1000) return "✅";
          return mark.score;
        };

        const pt1 = getPTScore("PT1");
        const pt2 = getPTScore("PT2");
        const pt3 = getPTScore("PT3");

        row[`${prefix}_pt1`] = pt1;
        row[`${prefix}_pt2`] = pt2;
        row[`${prefix}_pt3`] = pt3;

        const numericPTs = [pt1, pt2, pt3].filter((v) => typeof v === "number");
        numericPTs.sort((a, b) => b - a);
        const bestPT =
          numericPTs.length >= 2
            ? numericPTs[0] + numericPTs[1]
            : numericPTs.length === 1
              ? numericPTs[0]
              : "";

        row[`${prefix}_best_pt`] = bestPT;
        row[`${prefix}_pt`] = bestPT !== "" ? Math.ceil(bestPT / 8) : "";

        const internalMark = student.internals?.find?.(
          (i) => i.subject?.sub === sub,
        );

        const mulAssess = internalMark?.multiple_assessment ?? "";
        const portfolio = internalMark?.portfolio ?? "";
        const subEnrich = internalMark?.subject_enrichment ?? "";

        row[`${prefix}_mul_assess`] = mulAssess;
        row[`${prefix}_portfolio`] = portfolio;
        row[`${prefix}_sub_enrich`] = subEnrich;

        const ptVal = row[`${prefix}_pt`];
        const maVal =
          typeof mulAssess === "number" ? mulAssess : Number(mulAssess) || 0;
        const pfVal =
          typeof portfolio === "number" ? portfolio : Number(portfolio) || 0;
        const seVal =
          typeof subEnrich === "number" ? subEnrich : Number(subEnrich) || 0;

        row[`${prefix}_total_int`] =
          ptVal !== "" ? ptVal + maVal + pfVal + seVal : "";
      });

      finalStudentData.push(row);
    });

    setStudents(finalStudentData);
  };

  // ─── Helper: compute derived fields (mo_100, grade) for a single subject score ──
  const computeDerivedFields = (sub, score, row) => {
    const prefix = sub.toLowerCase();
    const max = ["PT1", "PT2", "PT3"].includes(exam)
      ? ptMax
      : subjectMarksMax[sub];
    if (typeof score === "number" && max) {
      const mo100 = Number(((score * 100) / max).toFixed(1));
      row[`${prefix}_mo_100`] = mo100;
      row[`${prefix}_grade`] = getScholasticGrade(mo100);
    } else {
      row[`${prefix}_mo_100`] = "";
      row[`${prefix}_grade`] = "";
    }
  };

  // ─── Helper: recompute total and percentage for a row ─────────────────────
  const computeTotals = (row) => {
    let sum = 0;

    scholasticSubjectList.forEach((sub) => {
      if (sub === "AI") return;

      const score = Number(row[sub.toLowerCase()]);

      if (isNaN(score)) return;

      if (["PT1", "PT2", "PT3"].includes(exam)) {
        sum += score;
      } else {
        const max = subjectMarksMax[sub];
        if (max) {
          sum += (score * 100) / max;
        }
      }
    });

    row.total = Number(sum.toFixed(2));

    if (["PT1", "PT2", "PT3"].includes(exam)) {
      const subjectCount = scholasticSubjectList.filter(
        (sub) => sub !== "AI",
      ).length;

      row.percentage =
        subjectCount > 0 ? Number((sum / subjectCount).toFixed(2)) : 0;
    } else {
      row.percentage = Number((sum / 5).toFixed(2));
    }
  };

  const buildStandardRows = () => {
    const finalStudentData = [];

    rawStudents.forEach((student, id) => {
      const row = {
        id,
        student_id: student.id,
        roll_no: student.roll_no,
        first_name: student.first_name,
        surname: student.surname,
      };

      scholasticSubjectList.forEach((sub) => {
        const filterMarks = student.marks.filter(
          (a) => a.subject?.sub === sub && a.exam?.abbreviation === exam,
        );
        const scoreObj = filterMarks?.[0] ?? { score: "" };
        let score = scoreObj.score;

        const prefix = sub.toLowerCase();

        if (score === -1000) {
          score = "N/A";
          row[prefix] = score;
          row[`${prefix}_mo_100`] = "";
          row[`${prefix}_grade`] = "";
        } else if (score === 1000) {
          score = "✅";
          row[prefix] = score;
          row[`${prefix}_mo_100`] = "";
          row[`${prefix}_grade`] = "";
        } else {
          row[prefix] = score ?? "";
          computeDerivedFields(sub, score, row);
        }
      });
      if (["PT1", "PT2", "PT3"].includes(exam)) {
        const phys = Number(row.phys) || 0;
        const chem = Number(row.chem) || 0;
        const bio = Number(row.bio) || 0;

        row.sci = phys + chem + bio;

        row.sci_mo_100 = row.sci;
        row.sci_grade = getScholasticGrade(row.sci * 5);
      }

      // co-scholastic activity
      let activityTotal = 0,
        activityCount = 0;
      coScholasticGroups.activity.forEach((sub) => {
        const filterMarks = student.marks.find(
          (a) => a.subject?.sub === sub && a.exam?.abbreviation === "SP",
        );
        const scoreObj = filterMarks?.[0] ?? { score: "" };
        let score = scoreObj.score;

        if (score === -1000) {
          score = "N/A";
        } else if (score === 1000) {
          score = "✅";
        } else if (typeof score === "number") {
          activityTotal += score / 10;
          activityCount += 1;
        }

        row[sub.toLowerCase()] = typeof score === "number" ? score / 10 : score;
      });

      // co-scholastic skill
      let skillTotal = 0,
        skillCount = 0;
      coScholasticGroups.skill.forEach((sub) => {
        const filterMarks = student.marks.find(
          (a) => a.subject?.sub === sub && a.exam?.abbreviation === "SP",
        );
        const scoreObj = filterMarks?.[0] ?? { score: "" };
        let score = scoreObj.score;

        if (score === -1000) {
          score = "N/A";
        } else if (score === 1000) {
          score = "✅";
        } else if (typeof score === "number") {
          skillTotal += score / 10;
          skillCount += 1;
        }

        row[sub.toLowerCase()] = typeof score === "number" ? score / 10 : score;
      });

      const activityAverage =
        activityCount > 0
          ? Number((activityTotal / activityCount).toFixed(2))
          : "";
      row.activity_average = activityAverage;
      row.activity_grade =
        activityAverage !== "" ? getActivityGrade(activityAverage) : "";

      const skillAverage =
        skillCount > 0 ? Number((skillTotal / skillCount).toFixed(2)) : "";
      row.skill_average = skillAverage;
      row.skill_grade =
        skillAverage !== "" ? getActivityGrade(skillAverage) : "";

      computeTotals(row);
      finalStudentData.push(row);
    });

    setStudents(finalStudentData);
  };

  const coScholasticFields = new Set(
    [...coScholasticGroups.activity, ...coScholasticGroups.skill].map((s) =>
      s.toLowerCase(),
    ),
  );
  const [changes, setChanges] = useState(null);

  // ─── Row update handler ───────────────────────────────────────────────────
  const processRowUpdate = (newRow, oldRow) => {
    const changes = {};
    Object.keys(newRow).forEach((key) => {
      if (newRow[key] !== oldRow[key]) changes[key] = newRow[key];
    });

    if (Object.keys(changes).length === 0) return newRow;

    if (exam === "INT") {
      const mapsubs = profile.subjects
        .filter((s) => s.classes.some((c) => c.division === classe))
        .map((s) => s.subject.sub);
      const updatedRow = { ...newRow };

      mapsubs.forEach((sub) => {
        const prefix = sub.toLowerCase();
        const ptVal = updatedRow[`${prefix}_pt`];
        const maVal = Number(updatedRow[`${prefix}_mul_assess`]) || 0;
        const pfVal = Number(updatedRow[`${prefix}_portfolio`]) || 0;
        const seVal = Number(updatedRow[`${prefix}_sub_enrich`]) || 0;
        updatedRow[`${prefix}_total_int`] =
          ptVal !== "" ? ptVal + maVal + pfVal + seVal : "";
      });

      setEditedRows((prev) => {
        const existing = prev[newRow.student_id] ?? {
          student_id: newRow.student_id,
          subjects: {},
        };
        const updatedSubjects = { ...existing.subjects };

        Object.keys(changes).forEach((field) => {
          if (!internalEditableFields.current.has(field)) return;

          const matchedSub = mapsubs.find((sub) =>
            field.startsWith(sub.toLowerCase() + "_"),
          );
          if (!matchedSub) return;
          const prefix = matchedSub.toLowerCase();

          if (!updatedSubjects[matchedSub]) updatedSubjects[matchedSub] = {};

          if (field === `${prefix}_mul_assess`)
            updatedSubjects[matchedSub].multiple_assessment = changes[field];
          if (field === `${prefix}_portfolio`)
            updatedSubjects[matchedSub].portfolio = changes[field];
          if (field === `${prefix}_sub_enrich`)
            updatedSubjects[matchedSub].subject_enrichment = changes[field];
        });

        return {
          ...prev,
          [newRow.student_id]: {
            student_id: newRow.student_id,
            subjects: updatedSubjects,
          },
        };
      });

      setStudents((prev) =>
        prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
      );
      return updatedRow;
    }

    // ─── Standard (non-INT) path ──────────────────────────────────────────
    const editedField = Object.keys(changes)[0];
    const isCoScholastic = coScholasticFields.has(editedField);

    let updatedRow = { ...newRow };

    if (isCoScholastic) {
      // Co-scholastic fields stored *10 internally; recalc averages/grades
      if (typeof changes[editedField] === "string") {
        changes[editedField] = (Number(changes[editedField]) * 10).toString();
      }

      // Recalculate activity average/grade live
      const activityVals = coScholasticGroups.activity
        .map((sub) => updatedRow[sub.toLowerCase()])
        .filter((v) => typeof v === "number");
      if (activityVals.length > 0) {
        const avg = Number(
          (
            activityVals.reduce((a, b) => a + b, 0) / activityVals.length
          ).toFixed(2),
        );
        updatedRow.activity_average = avg;
        updatedRow.activity_grade = getActivityGrade(avg);
      }

      const skillVals = coScholasticGroups.skill
        .map((sub) => updatedRow[sub.toLowerCase()])
        .filter((v) => typeof v === "number");
      if (skillVals.length > 0) {
        const avg = Number(
          (skillVals.reduce((a, b) => a + b, 0) / skillVals.length).toFixed(2),
        );
        updatedRow.skill_average = avg;
        updatedRow.skill_grade = getActivityGrade(avg);
      }
    } else {
      // Scholastic field edited — recalculate _mo_100, _grade, total, percentage live
      const editedSub = scholasticSubjectList.find(
        (sub) => sub.toLowerCase() === editedField,
      );

      if (editedSub) {
        const newScore = Number(newRow[editedField]);

        if (!isNaN(newScore)) {
          updatedRow[editedField] = newScore;
          computeDerivedFields(editedSub, newScore, updatedRow);
        } else {
          const prefix = editedSub.toLowerCase();
          updatedRow[`${prefix}_mo_100`] = "";
          updatedRow[`${prefix}_grade`] = "";
        }

        if (
          ["PT1", "PT2", "PT3"].includes(exam) &&
          ["phys", "chem", "bio"].includes(editedField)
        ) {
          const phys = Number(updatedRow.phys) || 0;
          const chem = Number(updatedRow.chem) || 0;
          const bio = Number(updatedRow.bio) || 0;

          updatedRow.sci = phys + chem + bio;

          updatedRow.sci_mo_100 = updatedRow.sci;
          updatedRow.sci_grade = getScholasticGrade(updatedRow.sci * 5);
        }

        computeTotals(updatedRow);
      }
    }

    setEditedRows((prev) => ({
      ...prev,
      [newRow.student_id]: {
        exam: isCoScholastic ? "SP" : exam,
        student_id: newRow.student_id,
        ...changes,
      },
    }));
    setChanges(changes);

    setStudents((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
    );
    const maxMarks = {
      math: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 80,
      english: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 80,
      hindi: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 80,
      phys: ["PT1", "PT2", "PT3"].includes(exam) ? 6 : 80,
      chem: ["PT1", "PT2", "PT3"].includes(exam) ? 6 : 80,
      bio: ["PT1", "PT2", "PT3"].includes(exam) ? 8 : 80,
      sci: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 80,
      french: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 80,
      ss: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 80,
      hs: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 70,
      painting: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 30,
      hc: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 50,
      ai: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 50,
      it: ["PT1", "PT2", "PT3"].includes(exam) ? 20 : 50,
    };

    const hasError = students.some((row) =>
      Object.entries(maxMarks).some(([field, max]) => {
        const value = row[field];
        return (
          value !== "" &&
          value !== null &&
          value !== undefined &&
          !isNaN(value) &&
          Number(value) > max
        );
      }),
    );

    setCellError(hasError);
    return updatedRow;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const changedRows = Object.values(editedRows);
    if (changedRows.length === 0) return;

    try {
      if (exam === "INT") {
        await request("patch", "/api/student/internals", changedRows);
      } else {
        await request("patch", "/api/student/update", changedRows);
      }
      console.log(profile);
      dispatch(
        setMarksheetData({
          students,
          subjects:
            profile?.subjects?.map((sub) =>
              sub && sub.subject ? sub.subject.sub : null,
            ) ?? [].filter((a) => a),
        }),
      );
      console.log(originalStudents, changedRows);

      setEditedRows({});

      // optional
      // navigate("/marksheet");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    console.log("Mounted");
  }, []);
  useEffect(() => {
    {
      console.log(1919, students, columns);
    }
  }, [students]);

  useEffect(() => {
    console.log(
      "hian",
      originalStudents.current,
      Object.values(editedRows),
      editedRows,
    );
  }, [originalStudents, editedRows]);

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ButtonGroup>
          {!(exam === "INT") && profile.class_tr?.division == classe && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ mb: 2, ml: 2 }}
              onClick={() => {
                const next = !showAllColumns;
                if (next) dispatch(setFormatValue("consolidated"));
                else dispatch(setFormatValue("individual"));
                setShowAllColumns(next);
                if (exam === "SP" || exam === "SE") {
                  buildColumnsPE(next);
                } else {
                  buildColumns(next);
                }
              }}
            >
              {showAllColumns ? "Show Profile Subjects" : "Show All Subjects"}
            </Button>
          )}
          <Button
            variant="contained"
            color={
              !(exam === "INT") && profile.class_tr?.division == classe
                ? "primary"
                : "secondary"
            }
            onClick={handleOpenSubjectModal}
            sx={{ mb: 2 }}
          >
            Generate Subject Report
          </Button>
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            color="error"
            disabled={selectedRows.ids.size === 0}
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
        </ButtonGroup>
        {console.log("KEVING UAMGUAM", students)}
        {console.log(Object.values(editedRows).length)}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mb: 2 }}
          disabled={Object.values(editedRows).length == 0}
          loading={isLoading}
          loadingPosition="start"
        >
          Submit Changes
        </Button>
      </div>
      <DataGrid
        rows={students}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) =>
          setSelectedRows(newSelection)
        }
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        columnGroupingModel={groupingModel.current}
        getCellClassName={(params) => {
          if (params.field === "first_name" || params.field === "surname")
            return "";
          return "center";
        }}
      />
      <SubjectSelectModal
        open={openSubjectModal}
        onClose={handleCloseSubjectModal}
        profileSubjects={subjects}
      />
    </>
  );
};

export default SubjectList;
