import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import HelloTr from "./HelloTr";
import { useSelector } from "react-redux";
import { Link } from "react-router";
const Header = () => {
  const profile = useSelector(state => state.profile)
  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Link to="/" style={{color: "White", textDecoration: "none"}}><Box>
            <CalendarMonth />
            <Typography variant="h6">Marksheet</Typography>
          </Box></Link>
          {profile && (
            <Box>
              <HelloTr />
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
