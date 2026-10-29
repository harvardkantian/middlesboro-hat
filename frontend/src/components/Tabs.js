import { Tab, Tabs as TabContainer } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const Tabs = ({ value: valueData }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    console.log(997, valueData);
    if (valueData) setValue(valueData);
  }, [valueData]);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };
  console.log(valueData, value, 997);
  return (
    <TabContainer
      value={value}
      onChange={handleChange}
      sx={{ marginBottom: 2 }}
      slotProps={{ indicator: { sx: { transition: "none" } } }}
    >
      <Tab value="marktable" label="marktable" component={Link} to="/" />
      <Tab value="teachers" label="teachers" component={Link} to="/teachers" />
    </TabContainer>
  );
};
export default Tabs;
