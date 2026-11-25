import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import UploadModal from "./UploadModal";
import * as XLSX from "xlsx";
import { useRequest } from "../hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { setClassValue } from "../context/slices/classSlice";
import { setExamValue } from "../context/slices/examSlice";
import { setSubjectData as setSubjectValue } from "../context/slices/subjectSlice";

const Dropdown = () => {
  const exam = useSelector((store) => store.exam.exam);
  const subject = useSelector((store) => store.subject.subject);
  const dispatch = useDispatch();
  const setClass = (newValue) => dispatch(setClassValue(newValue));
  const setExam = (newValue) => dispatch(setExamValue(newValue));
  const setSubject = (newValue) => dispatch(setSubjectValue(newValue));
  const profile = useSelector((state) => state.profile);
  const { request, isLoading, error } = useRequest();
  const [data, setData] = useState([]);
  const inputref = useRef();
  const classOptions = useMemo(() => {
    const options = profile?.role === "Administrator"
      ? ["A", "B", "C"].map((division) => ({
          value: division,
          label: `10${division}`,
        }))
      : (profile?.subjects || []).flatMap((item) =>
          (item.classes || []).map((cls) => ({
            value: cls.division,
            label: `${cls.grade}${cls.division}`,
          })),
        );
    return [...new Map(options.map((option) => [option.value, option])).values()];
  }, [profile]);
  const classOptionsKey = classOptions.map((option) => option.value).join(",");

  useEffect(() => {
    if (!profile) return;
    const mapsubs = (profile?.subjects || [null]).map((sub) => sub.subject.sub);
    console.log(1211, 1, profile, profile.subjects, mapsubs);
    if (
      mapsubs.includes("PE") ||
      mapsubs.includes("Yoga") ||
      mapsubs.includes("NSS") ||
      mapsubs.includes("MA")
    ) {
      console.log(1211, 2, mapsubs);
      setExam("SP");
    } else if (
      mapsubs.includes("WE") ||
      mapsubs.includes("ATL") ||
      mapsubs.includes("Comp")
    ) {
      setExam("SP");
    }
  }, [profile]);
  const subjects = [
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
  const classValue = useSelector((store) => store.class);
  const selectedClassIsAvailable = classOptions.some(
    (option) => option.value === classValue,
  );
  useEffect(() => {
    if (!classOptions.length) {
      if (classValue !== "") setClass("");
      return;
    }
    if (!selectedClassIsAvailable || classOptions.length === 1) {
      setClass(classOptions[0].value);
    }
  }, [classOptionsKey, classValue, selectedClassIsAvailable]);

  const filteredSubjects = useMemo(
    () => (profile?.subjects || []).filter((sub) =>
      sub.classes?.some((cls) => cls.division === classValue),
    ),
    [profile, classValue],
  );
  const canSelectAll =
    profile?.class_tr?.division?.toUpperCase() === classValue?.toUpperCase();
  const allSubjectOption = { subject: { sub: "ALL" } };
  const subjectOptions = canSelectAll
    ? [allSubjectOption, ...filteredSubjects]
    : filteredSubjects;
  const subjectIsAvailable = subjectOptions.some(
    (option) => JSON.stringify(option) === JSON.stringify(subject),
  );
  useEffect(() => {
    if (!subjectOptions.length) {
      if (subject != null) setSubject(null);
      return;
    }
    if (!subjectIsAvailable || subjectOptions.length === 1) {
      setSubject(subjectOptions[0]);
    }
  }, [JSON.stringify(subjectOptions), JSON.stringify(subject), subjectIsAvailable]);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (event) => {
      const buffer = event.target.result;
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const parsedData = [];

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];

        // Get rows as arrays instead of objects
        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        const data = [];

        rows.forEach((row, i) => {
          // Skip empty rows
          if (!row || row.length < 3) return;
          if (i <= 3) return;

          const obj = {
            no: row[0],
            first_name: row[1],
            surname: row[2],
            subjects: row.slice(3).filter(Boolean), // Remaining columns
          };

          data.push(obj);
        });
        // console.log(data)
        parsedData.push({ excel_data: data, class_name: sheetName });
      });
      // delete parsedData[0];
      console.log(parsedData);
      setData(parsedData);
      try {
        const res = await request("post", "/api/add-students", {
          sheets: parsedData,
        });
        console.log(res?.data);
        location.reload();
      } catch (error) {
        console.error(error);
      }
    };
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* <div className="spacer flex-1"></div> */}
      <div>
        <FormControl sx={{ right: 0 }}>
          <InputLabel id="demo-simple-select-label">Class</InputLabel>
          {console.log(classValue, "ab")}
          <Select
            value={selectedClassIsAvailable ? classValue : ""}
            label="Class"
            onChange={(e) => {
              console.log("NEW CLASS", e.target.value);
              setClass(e.target.value);
            }}
          >
            {classOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ right: 0 }}>
          <InputLabel id="demo-simple-select-label">Exam</InputLabel>
          <Select
            value={exam}
            label="Exam"
            onChange={(e) => setExam(e.target.value)}
          >
            <MenuItem value={"PT1"}>Periodic Test 1</MenuItem>
            <MenuItem value={"PT2"}>Periodic Test 2</MenuItem>
            <MenuItem value={"PT3"}>Periodic Test 3</MenuItem>
            <MenuItem value={"INT"}>Internals</MenuItem>
            <MenuItem value={"MT"}>MidTerms</MenuItem>
            <MenuItem value={"PB1"}>Pre-Board 1</MenuItem>
            <MenuItem value={"PB2"}>Pre-Board 2</MenuItem>
            <MenuItem value={"SP"}>Sports Evaluation</MenuItem>
          </Select>
        </FormControl>
        {profile.role != "Administrator" && (
          <FormControl sx={{ right: 0 }}>
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            {console.log(subject, "aku aku")}
            <Select
              value={subjectIsAvailable ? JSON.stringify(subject) : ""}
              label="Subject"
              onChange={(e) => setSubject(JSON.parse(e.target.value))}
            >
              {canSelectAll && (
                <MenuItem value={JSON.stringify(allSubjectOption)}>
                  ALL
                </MenuItem>
              )}
              {filteredSubjects.map((sub) => (
                <MenuItem value={JSON.stringify(sub)}>
                  {sub.subject.sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <>
        {profile?.role == "Administrator" && (
          <Button variant="contained" onClick={() => inputref.current.click()}>
            Submit XLSX Data
          </Button>
        )}
      </>
      <input
        type="file"
        style={{ display: "none" }}
        ref={inputref}
        onChange={handleFileUpload}
      />
    </div>
  );
};
export default Dropdown;
