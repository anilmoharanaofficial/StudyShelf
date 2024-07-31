document.addEventListener("DOMContentLoaded", () => {
  ///////////////////////ELEMENTS////////////////////
  const loginBtn = document.querySelector(".login-button");
  const userProfile = document.querySelector(".user");

  const registrationForm = document.getElementById("signup");
  const loginForm = document.getElementById("login");

  ////////////////HANDEL *SINGUP AND *LOGIN////////////////////////
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

          if (responseData.redirectUrl) {
            window.location.href = responseData.redirectUrl;
          } else {
            return;
          }

          // User Loging Status
          userLoggedInStatus(true);
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

  ////////////////CHECK USER LOGGED IN OR NOT/////////////
  const userLoggedInStatus = (status) => {
    window.localStorage.setItem("loggedInStatus", status);
  };

  let isLoggedIn = window.localStorage.getItem("loggedInStatus");

  ////////////////FETCH USER DETAILS////////////////////
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
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (isLoggedIn === "true") {
    fetchUserData();
  } else {
    // Show Login Button
    loginBtn.classList.remove("hide");
  }
});
