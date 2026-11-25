import { Container } from "@mui/material";
import Tabs from "../components/Tabs";
import Dropdown from "../components/Dropdown";
import SubjectList from "../components/SubjectList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router";
import StudentList, {
  StudentListConsolidated,
} from "../components/StudentList";
import StudentListPE from "../components/StudentListPE";
import AddStudent from "../components/AddStudent";

const Home = () => {
  const classe = useSelector((state) => state.class);
  const role = useSelector((state) => state.profile?.role);
  const profile = useSelector((state) => state.profile);
  const subject = useSelector((state) => state.subject?.subject?.subject?.sub);
  const [studentRefreshKey, setStudentRefreshKey] = useState(0);
  const peSubjects = ["PE", "Yoga", "NSS", "MA", "Art", "Music", "ATL", "WE", "Comp"];
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(params, 999);
    if (params.get("reload") == "true") {
      navigate("/");
      location.reload();
    }
  }, [params]);
  useEffect(() => {
    localStorage.setItem("class", classe);
  }, [classe]);
  const selectedClass = profile?.subjects
    ?.flatMap((item) => item.classes || [])
    .find((item) => item.division === classe);
  const className = `${selectedClass?.grade ?? 10}${classe}`;
  return (
    <>
      <Tabs value="marktable" />

      <Dropdown />
      <AddStudent
        className={className}
        onAdded={() => setStudentRefreshKey((key) => key + 1)}
      />
      {console.log(subject, "shtika")}
      {role == "Administrator" || subject == "ALL" ? (
        <StudentListConsolidated refreshKey={studentRefreshKey} />
      ) : peSubjects.includes(subject) ? (
        <StudentListPE refreshKey={studentRefreshKey} />
      ) : (
        <StudentList refreshKey={studentRefreshKey} />
      )}
    </>
  );
};
export default Home;
