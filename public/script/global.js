///////////////////// TOAST MESSAGE/////////////////////////////
const message = document.querySelector(".toast-message");
const toast = document.querySelector(".toast");

const ToastMessage = () => {
  toast.classList.add("showToast");
  setTimeout(() => toast.classList.remove("showToast"), 3000);
};

// ////////////DISABLE SOCIAL AUTH MESSAGE/////////////
const socialAuth = document.querySelectorAll(
  ".social-auth-google, .social-auth-apple, .social-auth-facebook"
);

socialAuth.forEach((i) => {
  i.addEventListener("click", () => {
    ToastMessage();
    message.textContent =
      "Social login and sign-up are currently disabled. Please try again later.";
  });
});
