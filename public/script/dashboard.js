document.addEventListener("DOMContentLoaded", () => {
  ///////////////////// HEADER STARTS HERE//////////////////////////
  const userProfileImage = document.querySelector(".user-profile");
  const userProfilePopup = document.querySelector(".user-profile-popup");
  // const userOption = document.querySelector(".user-option");

  // Show the user profile popup on mouseover of the profile image
  userProfileImage.addEventListener("click", () => {
    userProfilePopup.classList.add("show-user-profile-popup");
  });

  // Hide the user profile popup on click outside
  document.addEventListener("click", (e) => {
    if (
      !userProfilePopup.contains(e.target) &&
      !userProfileImage.contains(e.target)
    ) {
      userProfilePopup.classList.remove("show-user-profile-popup");
    }
  });
});
