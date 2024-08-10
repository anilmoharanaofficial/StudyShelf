document.addEventListener("DOMContentLoaded", () => {
  ////////////////////////////////////////////////
  //ELEMENTS
  const loginBtn = document.querySelector(".login-button");
  const userProfile = document.querySelector(".user");
  const userMenu = document.querySelector(".user-profile");
  const userOptions = document.querySelector(".user-profile-popup");
  const dashboardNavBtn = document.querySelector(".dash__board");

  const registrationForm = document.getElementById("signup");
  const loginForm = document.getElementById("login");

  const avatar = document.querySelectorAll(".avatar");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const date = document.getElementById("date");

  const deleteAccount = document.querySelector(".delete-account");
  const overlay = document.querySelector(".overlay");
  const deletionModel = document.querySelector(".delete-model");
  const cancelDeletion = document.querySelectorAll(
    ".closeModel, #delete-cancel"
  );
  const deleteConfirmation = document.getElementById("delete-confirm");

  const editProfileForm = document.getElementById("update-profile-data");

  ////////////////////////////////////
  //ACTIVE PATH HIGHLIGHTER
  const profileNav = document.querySelector(".profile__nav");
  const editProfileNav = document.querySelector(".edit__profile__nav");

  activePath(profileNav, currentURL, "/profile");
  activePath(editProfileNav, currentURL, "/profile/edit-profile");

  /////////////////////////////////////////////////
  ///HANDEL *SINGUP AND *LOGIN
  const handleFormSubmit = async (form, url) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const requestBody = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const responseData = await response.json();

        if (response.ok) {
          message.textContent = responseData.message || "Success";
          ToastMessage();
          form.reset();
          userLoggedInStatus(true);

          if (responseData.redirectUrl) {
            window.location.href = responseData.redirectUrl;
          } else {
            return;
          }

          // userLoggedInStatus(true);
        } else {
          throw new Error(responseData.message || "Failed");
        }
      } catch (error) {
        message.textContent = error.message || "Failed";
        ToastMessage();
        console.log(error.message);
      }
    });
  };

  if (registrationForm) {
    handleFormSubmit(registrationForm, "/api/v1/user/signup");
  }

  if (loginForm) {
    handleFormSubmit(loginForm, "/api/v1/user/login");
  }

  //////////////////////////////////////////
  //HANDLE LOGOUT
  const logout = document.querySelector(".logout");
  logout.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/v1/user/logout");

      if (response.ok) {
        window.location.href = "/";
        userLoggedInStatus(false);
        userLocalData({});
      }
    } catch (error) {
      message.textContent = responseData.error;
      ToastMessage();
    }
  });

  /////////////////////////////////////////////
  //CHECK USER LOGGED IN OR NOT
  function userLoggedInStatus(status) {
    window.localStorage.setItem("loggedInStatus", status);
  }

  ////////////////////////////////////////////////////
  //STORE USER DATA IN LOCALSTORAGE
  function userLocalData(userData) {
    window.localStorage.setItem("userData", JSON.stringify(userData));
  }

  /////////////////////////////////////////
  //HANDLE USER OPTIONS
  userMenu.addEventListener("click", () => {
    userOptions.classList.toggle("hide-user-profile-popup");
  });

  // Hide Dashboard Nav Button *If Noraml User
  let { role } = JSON.parse(window.localStorage.getItem("userData"));
  if (role !== "ADMIN") {
    userOptions.removeChild(dashboardNavBtn);
  }

  /////////////////////////////////////////////
  //FETCH USER DETAILS
  let userData = null;

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/v1/user/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      userData = responseData.data;

      if (response.ok) {
        //Hide Login Button on Header
        userProfile.classList.remove("hide");

        // Display User Profile on Header
        document.getElementById("user-avatar").src = userData.avatar.secure_url;
      }

      // Store user data in local storage
      userLocalData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  let isLoggedIn = JSON.parse(window.localStorage.getItem("loggedInStatus"));
  if (isLoggedIn) {
    fetchUserData();
  } else {
    // Show Login Button
    loginBtn.classList.remove("hide");
  }

  /////////////////////////////////////////////////
  //HANDLE PROFILE DATA
  const userDetails = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.redirect) {
          window.location.href = responseData.redirect;
        }
        return;
      }

      // SET User Avatar
      avatar.forEach((avatar) => {
        avatar.src = responseData.data.avatar.secure_url;
      });

      if (currentURL === "/profile" || "/profile/edit-profile") {
        const userName = responseData.data.name.toString();
        name.value = normalizeName(userName);
        email.value = responseData.data.email;
        date.value = normalizeDate(responseData.data.createdAt);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  currentURL === "/profile" || "/profile/edit-profile"
    ? userDetails("/api/v1/user/profile")
    : "";

  ///////////////////////////////////////////////////////////
  ///HANDLE DELETE ACCOUNT
  if (deleteAccount) {
    deleteAccount.addEventListener("click", async () => {
      deletionModel.classList.add("active");
      overlay.classList.add("active");

      // Final Call For Delete Account
      deleteConfirmation.addEventListener("click", async () => {
        try {
          const response = await fetch("/api/v1/user/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          const responseData = await response.json();

          if (response.ok) {
            message.textContent = responseData.message || "Success";
            ToastMessage();

            deletionModel.classList.remove("active");
            overlay.classList.remove("active");

            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        } catch (error) {
          message.textContent = error.message || "Failed";
          ToastMessage();
        }
      });
    });

    cancelDeletion.forEach((e) => {
      e.addEventListener("click", () => {
        deletionModel.classList.remove("active");
        overlay.classList.remove("active");
      });
    });
  }

  ///////////////////////////////////////////////////////////
  ///HANDLE EDIT PROFILE
  const handleEditProfile = (form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      // Progress Status
      ProgressStatus("Updating....");

      // Update Data
      try {
        const response = await fetch("/api/v1/user/update-profile", {
          method: "PUT",
          body: formData,
        });

        const responseData = await response.json();

        if (response.ok) {
          // Close Progress Status
          closeProgressStatus();

          // Show Success Message
          message.textContent = responseData.message;
          ToastMessage();
        }
      } catch (error) {
        message.textContent = error;
        ToastMessage();
      }
    });
  };

  currentURL === "/profile/edit-profile"
    ? handleEditProfile(editProfileForm)
    : "";

  ///////////////////////////////////////////////////////////
  ///HANDLE CHANGE PASSWORD
  const handleChnagePassword = () => {};
});
