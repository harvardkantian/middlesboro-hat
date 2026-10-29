import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function LoginPage() {
  const { request, isLoading, error } = useRequest();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData((ofd) => ({
      ...ofd,
      [e.target.name]: e.target.value,
    }));

    setFormErrors((ofe) => ({
      ...ofe,
      [e.target.name]: "",
    }));
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({});

    try {
      const res = await request("post", "/api/login", {
        username: formData.username,
        password: formData.password,
      });

      console.log("Logged in:", res.data);
      const meres = await request("get", "/api/me");

      localStorage.setItem("profile", JSON.stringify(meres.data));
      navigate("/?reload=true");
      // redirect here
      // navigate("/dashboard");
    } catch (err) {
      console.log(err);

      if (err.response?.data) {
        setFormErrors(err.response.data);
      } else {
        setFormErrors({
          masterError: "Something went wrong.",
        });
      }
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side */}

      {/* Right Side */}
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
          >
            Login
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Enter your credentials below
          </Typography>

          {formErrors.masterError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.masterError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
