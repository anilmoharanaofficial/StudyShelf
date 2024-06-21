document.addEventListener("DOMContentLoaded", () => {
  ///////////////////// HEADER STARTS HERE//////////////////////////
  const currentURL = window.location.pathname;

  const userProfileImage = document.querySelector(".user-profile");
  const userProfilePopup = document.querySelector(".user-profile-popup");

  // SHOW THE USER PROFILE
  userProfileImage.addEventListener("click", () => {
    userProfilePopup.classList.add("show-user-profile-popup");
  });

  document.addEventListener("click", (e) => {
    if (
      !userProfilePopup.contains(e.target) &&
      !userProfileImage.contains(e.target)
    ) {
      userProfilePopup.classList.remove("show-user-profile-popup");
    }
  });

  //ACTIVE PATH HIGHLIGHTER
  const navDashboard = document.querySelector(".nav-dashboard");
  const navAllItem = document.querySelector(".nav-all");
  const navAddNew = document.querySelector(".nav-add");
  const navProfile = document.querySelector(".nav-profile");

  activePath(navDashboard, currentURL, "/dashboard");
  activePath(navAllItem, currentURL, "/dashboard/all");
  activePath(navAddNew, currentURL, "/dashboard/add");
  activePath(navProfile, currentURL, "/profile");
});
