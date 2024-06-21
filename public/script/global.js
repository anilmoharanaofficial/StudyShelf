///////////////////// TOAST MESSAGE/////////////////////////////
const message = document.querySelector(".toast-message");
const toast = document.querySelector(".toast");

const ToastMessage = () => {
  toast.classList.add("showToast");
  setTimeout(() => toast.classList.remove("showToast"), 3000);
};

//////////////DISABLE SOCIAL AUTH MESSAGE/////////////
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

//////////////NORMALIZE DATE/////////////
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

/////////////////NORMALIZE NAME///////////
const normalizeName = (name) => {
  const userName = name.toLowerCase().split(" ");
  // const normalize = userName[0].toUpperCase() + userName.slice(1);
  const normalize = userName.map(
    (part) => part.charAt(0).toUpperCase() + part.slice(1)
  );
  return normalize.join(" ");
};

///////////ACTIVE PATH HIGHLIGHTER////////////
const activePath = (element, url, path) => {
  if (element && url === path) {
    element.classList.add("active-menu");
  }
};
