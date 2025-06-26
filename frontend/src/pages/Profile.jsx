import React, { useState, useContext } from "react";
import {
  Edit3,
  BookOpen,
  Calendar,
  X,
  Save,
  Lock,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import { NotesContext } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";
import SaveNotes from "./SaveNotes.jsx";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { currentUser } = useContext(UserContext);
  const { notes } = useContext(NotesContext);
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    avatar: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState({
    avatar: "https://picsum.photos/200/200?random=1",
    bio: "Passionate writer and creative thinker.",
  });

  const getFormattedDate = () => {
    const date = currentUser.created_at || currentUser.updated_at;
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Unknown Date";
      return parsedDate.toLocaleDateString("en-UK", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };

  const getNotesThisMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return notes.filter((note) => {
      const noteDate = new Date(note.created_at);
      return (
        noteDate.getMonth() === currentMonth &&
        noteDate.getFullYear() === currentYear
      );
    }).length;
  };

  const openEditModal = () => {
    setEditForm({
      name: currentUser.name,
      email: currentUser.email,
      bio: user.bio,
      avatar: user.avatar,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openPasswordModal = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newAvatar = `https://picsum.photos/200/200?random=${randomId}`;
    setEditForm((prev) => ({
      ...prev,
      avatar: newAvatar,
    }));
  };

  const saveProfile = () => {
    setUser((prev) => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio,
      avatar: editForm.avatar,
    }));

    closeEditModal();
  };

  const handleChangePassword = async () => {
    // Validation
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert("All fields are required.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`${VITE_SERVER_URL}/users/change_password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      alert("Password changed successfully.");
      closePasswordModal();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Mock data for user achievements
  const achievements = [
    {
      icon: "🔥",
      title: "15 Day Streak",
      description: "Keep writing daily! You're on fire!",
      badgeColor: "badge-warning",
    },
    {
      icon: "📚",
      title: "Note Master",
      description: "You've created 300+ notes! Amazing!",
      badgeColor: "badge-info",
    },
    {
      icon: "⭐",
      title: "Quality Writer",
      description: "25+ starred notes – your best work!",
      badgeColor: "badge-secondary",
    },
    {
      icon: "✍️",
      title: "Prolific Pen",
      description: "Wrote 50 notes in a single month!",
      badgeColor: "badge-accent",
    },
    {
      icon: "💡",
      title: "Idea Generator",
      description: "Contributed 100+ unique ideas!",
      badgeColor: "badge-success",
    },
    {
      icon: "🌐",
      title: "Explorer",
      description: "Explored all note categories!",
      badgeColor: "badge-primary",
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-base-100">
      {/* Main Content Area */}

      <div className="container mx-auto p-4 py-2 max-w-6xl">
        {/* Profile Header Card */}
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="flex items-center justify-between tabs tabs-boxed bg-base-200 mb-6 rounded-lg shadow-md">
            <div className="flex">
              <button
                role="tab"
                className={`tab ${
                  activeTab === "overview" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
                aria-label="Overview Tab"
              >
                Overview
              </button>

              <button
                role="tab"
                className={`tab ${
                  activeTab === "achievements" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("achievements")}
                aria-label="Achievements Tab"
              >
                Achievements
              </button>
              <button
                role="tab"
                className={`tab ${
                  activeTab === "settings" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("settings")}
                aria-label="Account & Settings Tab"
              >
                Account & Settings
              </button>
            </div>

            {/* Close Button */}
            <button
              className="btn btn-sm btn-circle btn-error ml-2"
              onClick={() => navigate("/notes")}
              aria-label="Close Profile"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="card-body">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Avatar Section */}
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user.avatar} alt={user.name} />
                </div>
              </div>

              {/* User Info and Quick Actions */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-base-content mb-2">
                  {currentUser.name}
                </h2>
                <p className="text-base-content/70 mb-2">{currentUser.email}</p>
                <p className="text-sm text-base-content/60 mb-4">
                  Member since {getFormattedDate()}
                </p>
                <p className="text-base-content/80 max-w-md">{user.bio}</p>

                {/* Action Buttons below profile info */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={openEditModal}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="stat-figure text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="stat-title text-base-content/70">Total Notes</div>
            <div className="stat-value text-primary">{notes.length || 0}</div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="stat-figure text-accent">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="stat-title text-base-content/70">This Month</div>
            <div className="stat-value text-accent">
              {getNotesThisMonth() || 0}
            </div>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === "overview" && (
            <>
              {/* Writing Activity Chart Placeholder */}
              <div className="col-span-1 lg:col-span-2">
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-4">
                      Writing Activity
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-base-300 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-base-content/60">
                          Activity chart would go here (e.g., using Recharts,
                          D3.js)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Categories & Account Overview */}
              <div className="space-y-4">
                {/* Quick Actions Card */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className="btn btn-primary btn-sm w-full"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        New Note
                      </button>
                      <button
                        onClick={() => navigate("/notes")}
                        className="btn btn-outline btn-sm w-full"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Browse All Notes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories Card */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-4">
                      Categories
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                        <span className="badge badge-primary px-3 py-2 text-base">
                          Work
                        </span>
                        <span className="text-sm text-base-content/70">
                          124 notes
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                        <span className="badge badge-secondary px-3 py-2 text-base">
                          Personal
                        </span>
                        <span className="text-sm text-base-content/70">
                          89 notes
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                        <span className="badge badge-accent px-3 py-2 text-base">
                          Ideas
                        </span>
                        <span className="text-sm text-base-content/70">
                          67 notes
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-base-300 transition-colors cursor-pointer">
                        <span className="badge badge-info px-3 py-2 text-base">
                          Learning
                        </span>
                        <span className="text-sm text-base-content/70">
                          45 notes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "achievements" && (
            <div className="col-span-1 lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="card-body text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="card-title justify-center text-base-content">
                        {achievement.title}
                      </h3>
                      <p className="text-base-content/70">
                        {achievement.description}
                      </p>
                      {achievement.badgeColor && (
                        <div className="mt-2">
                          <span
                            className={`badge ${achievement.badgeColor} badge-outline`}
                          >
                            Unlocked
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="col-span-1 lg:col-span-3">
              <div className="space-y-6">
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-4">
                      General Settings
                    </h3>
                    <div className="form-control mb-4">
                      <label className="label cursor-pointer justify-between">
                        <span className="label-text text-base-content">
                          Receive Notifications
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer justify-between">
                        <span className="label-text text-base-content">
                          Enable Two-Factor Authentication
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-secondary"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-4">
                      Account Actions
                    </h3>
                    <button
                      className="btn btn-primary w-full mb-2"
                      onClick={openPasswordModal}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </button>
                    <button className="btn btn-error w-full">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-base-content">
                Edit Profile
              </h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={closeEditModal}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Profile Picture
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={editForm.avatar} alt="Avatar preview" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={generateRandomAvatar}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Generate Random
                    </button>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Bio Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content mx-2">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24 w-full"
                  placeholder="Tell others about yourself..."
                ></textarea>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={closeEditModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-base-content">
                Change Password
              </h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={closePasswordModal}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Current Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="input input-bordered w-full pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-base-content/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-base-content/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    New Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    className="input input-bordered w-full pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-base-content/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-base-content/60" />
                    )}
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    At least 6 characters
                  </span>
                </label>
              </div>

              {/* Confirm Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Confirm New Password
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="input input-bordered w-full"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={closePasswordModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleChangePassword}
                disabled={
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword
                }
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && <SaveNotes setShowSaveModal={setShowSaveModal} />}
    </div>
  );
}
