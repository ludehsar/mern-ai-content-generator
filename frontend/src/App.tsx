import LoginPage from "./pages/LoginPage";
import { Route, Routes } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/Homepage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route index path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
