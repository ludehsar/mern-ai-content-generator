import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import { Route, Routes, Navigate } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ConversationDetailPage from "./pages/ConversationDetailPage";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { getUser } from "./store/slices/authSlice";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector<RootState>((state) => state.auth.user);
  const status = useSelector<RootState>((state) => state.auth.status) as string;

  if (status === "pending") {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector<RootState>((state) => state.auth.user);
  const status = useSelector<RootState>((state) => state.auth.status) as string;

  if (status === "pending") {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const dispatch = useDispatch();
  const status = useSelector<RootState>((state) => state.auth.status) as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && status === "idle") {
      dispatch(getUser());
    }
  }, [dispatch, status]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conversations/:conversationId"
        element={
          <ProtectedRoute>
            <ConversationDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
