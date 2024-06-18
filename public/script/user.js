document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const avatar = document.querySelectorAll(".avatar");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const date = document.getElementById("date");

  const currentURL = window.location.pathname;
  const logoutUser = document.getElementById("logout");

  // Fetch User Details
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

      if (currentURL === "/profile") {
        const userName = responseData.data.name.toString();
        name.value = normalizeName(userName);
        email.value = responseData.data.email;
        date.value = normalizeDate(responseData.data.createdAt);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  userDetails("/api/v1/user/profile/");

  // Logout USER
  if (logoutUser) {
    logoutUser.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/v1/user/logout/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          window.location.href = "/";
        }
      } catch (error) {
        message.textContent = error || "Filed";
        ToastMessage();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Change Password
  const chnagePassword = document.getElementById("chnage-password");
  const handleChnagePassword = async (form, url) => {
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

          if (responseData.redirect || responseData.redirectUrl) {
            const redirectUrl =
              responseData.redirect || responseData.redirectUrl;
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 2000);
          } else {
            return;
          }
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

  if (chnagePassword) {
    handleChnagePassword(chnagePassword, "/api/v1/user/change-password");
  }
});
