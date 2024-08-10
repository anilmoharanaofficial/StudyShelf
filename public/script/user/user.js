document.addEventListener("DOMContentLoaded", () => {
  ////////////////////////////////////////////////
  //ELEMENTS
  const loginBtn = document.querySelector(".login-button");
  const userProfile = document.querySelector(".user");
  const userOptions = document.querySelector(".user-profile-popup");
  const dashboardNavBtn = document.querySelector(".dash__board");

  const registrationForm = document.getElementById("signup");
  const loginForm = document.getElementById("login");

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

  /////////////////////////////////////////
  //HANDLE USER OPTIONS
  userProfile.addEventListener("click", () => {
    userOptions.classList.toggle("show-user-profile-popup");
  });

  // Hide Dashboard Nav Button *If Noraml User
  let { role } = JSON.parse(window.localStorage.getItem("userData"));
  if (role !== "ADMIN") {
    userOptions.removeChild(dashboardNavBtn);
  }
});
