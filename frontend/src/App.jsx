import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import NoteList from "./pages/NoteList.jsx";
import SaveNotes from "./pages/SaveNotes.jsx";
import EditNoteModal from "./pages/EditNoteModal.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { useState, useContext } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import { UserContext } from "./context/UserContext.jsx";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Landing from "./pages/Landing.jsx";

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const { currentUser, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-ring text-secondary loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-0 lg:max-w-none min-h-screen flex flex-col bg-base-100">
      <Toaster
        position="top-center"
        reverseOrder={true}
        gutter={8}
        toastOptions={{
          duration: 2000,
          removeDelay: 1000,
          style: {
            border: "1px solid #292929",
            padding: "10px",
            color: "#FFFAEE",
            background: "#292929",
            borderRadius: "15px",
          },
        }}
      />

      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          element={
            currentUser ? (
              <Layout search={search} setSearch={setSearch} />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        >
          <Route index element={<Navigate to="/notes" replace />} />
          <Route
            path="/notes"
            element={<NoteList setSelectedNoteId={setSelectedNoteId} />}
          />
          <Route path="/save" element={<SaveNotes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>

      {selectedNoteId && currentUser && (
        <EditNoteModal
          selectedNoteId={selectedNoteId}
          setSelectedNoteId={setSelectedNoteId}
        />
      )}
    </div>
  );
}
