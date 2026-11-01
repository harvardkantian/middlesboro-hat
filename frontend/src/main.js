import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store, persistor } from "./context/store";
import { PersistGate } from "redux-persist/integration/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6b7b3a",
      light: "#91a45a",
      dark: "#465222",
      contrastText: "#ffffff",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
