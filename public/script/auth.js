document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("signup");
  const loginForm = document.getElementById("login");
  // const currentURL = window.location.pathname;

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
});
