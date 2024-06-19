document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const avatar = document.querySelectorAll(".avatar");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const date = document.getElementById("date");

  const currentURL = window.location.pathname;
  const logoutUser = document.getElementById("logout");
  const deleteAccount = document.querySelector(".delete-account");
  const overlay = document.querySelector(".overlay");
  const deletionModel = document.querySelector(".delete-model");
  const cancelDeletion = document.querySelectorAll(
    ".closeModel, #delete-cancel"
  );
  const deleteConfirmation = document.getElementById("delete-confirm");

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

      if (currentURL === "/profile" || "/profile/") {
        const userName = responseData.data.name.toString();
        name.value = normalizeName(userName);
        email.value = responseData.data.email;
        date.value = normalizeDate(responseData.data.createdAt);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  userDetails("/api/v1/user/profile");

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

  // DELETE ACCOUNT
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
      }
    });
  };

  if (chnagePassword) {
    handleChnagePassword(chnagePassword, "/api/v1/user/change-password");
  }
});
