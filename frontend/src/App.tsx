import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import type { RootState } from "./store";
import { Route, Routes } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/Homepage";
import DashboardPage from "./pages/DashboardPage";
import type { User } from "./types/auth";

function App() {
  const user = useSelector<RootState>(
    (state) => state.auth.user
  ) as User | null;
  const status = useSelector<RootState>((state) => state.auth.status);

  return (
    <Routes>
      <Route index path="/" element={<HomePage />} />
      {status === "pending" && <p>Logging in…</p>}
      {!user && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </>
      )}
      {user && <Route path="/dashboard" element={<DashboardPage />} />}
    </Routes>
  );
}

export default App;
