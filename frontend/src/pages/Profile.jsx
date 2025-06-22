import React, { useState, useEffect } from "react";
import { Edit3, BookOpen, Calendar, Star, X, Save } from "lucide-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state for editing profile
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    bio: "",
    hobbies: [],
  });

  useEffect(() => {
    const storedTheme = localStorage?.getItem("theme") || "valentine";
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  // Mock user data. In a real application, this data would come from an API or a global state manager.
  const [user, setUser] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    joinDate: "March 2023",
    avatar: "https://picsum.photos/200/200?random=1",
    bio: "Passionate writer and creative thinker.",
    stats: {
      totalNotes: 347,
      notesThisMonth: 42,
      streakDays: 15,
    },
    accountType: "Premium",
    storageUsedGB: 1.2,
    storageTotalGB: 5,
    hobbies: [
      "Digital Art",
      "Creative Writing",
      "Reading",
      "Journaling",
      "Photography",
    ],
  });

  // Open edit modal and populate form with current user data
  const openEditModal = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      bio: user.bio,
      hobbies: [...user.hobbies],
    });
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile changes
  const saveProfile = () => {
    // Filter out empty hobbies
    const filteredHobbies = editForm.hobbies.filter(
      (hobby) => hobby.trim() !== ""
    );

    setUser((prev) => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
      bio: editForm.bio,
      hobbies: filteredHobbies,
    }));

    closeEditModal();

    // In a real app, you would make an API call here
    console.log("Profile updated:", { ...editForm, hobbies: filteredHobbies });
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
          <div className="tabs tabs-boxed bg-base-200 mb-6 rounded-lg shadow-md">
            <button
              role="tab"
              className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
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
              className={`tab ${activeTab === "settings" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("settings")}
              aria-label="Account & Settings Tab"
            >
              Account & Settings
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
                  {user.name}
                </h2>
                <p className="text-base-content/70 mb-2">{user.email}</p>
                <p className="text-sm text-base-content/60 mb-4">
                  Member since {user.joinDate}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="stat-figure text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="stat-title text-base-content/70">Total Notes</div>
            <div className="stat-value text-primary">
              {user.stats.totalNotes}
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="stat-figure text-secondary">
              <Star className="h-8 w-8" />
            </div>
            <div className="stat-title text-base-content/70">Favorites</div>
            <div className="stat-value text-secondary">
              {user.stats.favoriteNotes}
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="stat-figure text-accent">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="stat-title text-base-content/70">This Month</div>
            <div className="stat-value text-accent">
              {user.stats.notesThisMonth}
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="stat-figure text-warning">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="stat-title text-base-content/70">Streak</div>
            <div className="stat-value text-warning">
              {user.stats.streakDays} days
            </div>
          </div>
        </div>

        {/* Tabs for Navigation */}

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

              {/* Quick Actions & Categories & Account Overview & Interests */}
              <div className="space-y-4">
                {/* Quick Actions Card */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-base-content mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button className="btn btn-primary btn-sm w-full">
                        <Edit3 className="h-4 w-4 mr-2" />
                        New Note
                      </button>
                      <button className="btn btn-outline btn-sm w-full">
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

          {activeTab === "recent" && (
            <div className="col-span-1 lg:col-span-3">
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="card-title text-base-content">
                            {note.title}
                          </h3>
                          <p className="text-base-content/70 text-sm mb-2">
                            {note.date}
                          </p>
                          <p className="text-base-content/60">{note.preview}</p>
                        </div>
                        <div className="dropdown dropdown-end">
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-sm"
                            aria-label="Note options"
                          >
                            ⋯
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-[1]"
                          >
                            <li>
                              <a>Edit Note</a>
                            </li>
                            <li>
                              <a>Share Note</a>
                            </li>
                            <li>
                              <a>Delete Note</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-6">
                  <button className="btn btn-outline btn-primary">
                    View All Recent Notes
                  </button>
                </div>
              </div>
            </div>
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
                    <button className="btn btn-warning w-full mb-2">
                      Change Email Address
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

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Bio Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself..."
                ></textarea>
              </div>

              {/* Hobbies/Interests Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Interests & Hobbies
                  </span>
                </label>
                <div className="space-y-2">
                  {editForm.hobbies.map((hobby, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={hobby}
                        onChange={(e) =>
                          handleHobbyChange(index, e.target.value)
                        }
                        className="input input-bordered flex-1"
                        placeholder="Enter a hobby or interest"
                      />
                      <button
                        type="button"
                        onClick={() => removeHobby(index)}
                        className="btn btn-outline btn-error btn-sm"
                        aria-label="Remove hobby"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {editForm.hobbies.length < 10 && (
                    <button
                      type="button"
                      onClick={addHobby}
                      className="btn btn-outline btn-sm"
                    >
                      + Add Interest
                    </button>
                  )}
                </div>
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
    </div>
  );
}
