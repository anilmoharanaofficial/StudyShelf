//////////////////////////////////
//ELEMENTS
const currentURL = window.location.pathname;
const href = window.location.href;

//////////////////////////////////////////////////
//TOAST MESSAGE
const message = document.querySelector(".toast-message");
const toast = document.querySelector(".toast");

const ToastMessage = () => {
  toast.classList.add("showToast");
  setTimeout(() => toast.classList.remove("showToast"), 3000);
};

//////////////////////////////////////
//PROGRESS STATUS
const progressStatus = document.querySelector(".progress-status");
const progressMessage = document.querySelector(".progress-message");

const ProgressStatus = (message) => {
  progressStatus.classList.add("showProgress");
  progressMessage.innerHTML = message;
};

//////////////////////////////////////////
//STOP PROGRESS STATUS
const closeProgressStatus = () => {
  progressStatus.classList.remove("showProgress");
};

//////////////////////////////////////////
//DISABLE SOCIAL AUTH MESSAGE
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

///////////////////////////////////////////
//NORMALIZE DATE
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

/////////////////////////////////////////
//NORMALIZE NAME
const normalizeName = (name) => {
  const userName = name.toLowerCase().split(" ");
  const normalize = userName.map(
    (part) => part.charAt(0).toUpperCase() + part.slice(1)
  );
  return normalize.join(" ");
};

//////////////////////////////////////////
//ACTIVE PATH HIGHLIGHTER
const activePath = (element, url, path) => {
  if (element && url === path) {
    element.classList.add("active-menu");
  }
};

//////////////////////////////////////////////////
//FEATURED IMAGE PREVIEW
function previewImage(event) {
  const input = event.target;
  const reader = new FileReader();

  reader.onload = function () {
    const preview = document.getElementById("featuredImagePreview");
    preview.src = reader.result;
    preview.style.opacity = "1";
  };

  if (input.files && input.files[0]) {
    reader.readAsDataURL(input.files[0]);
  }
}

//////////////////////////////////////////////
//SHARE MODEL

const shareModel = (el) => {
  el.addEventListener("click", () => {
    // MODEL ELEMNETS
    const shareModel = document.querySelector(".share-model");
    const overlay = document.querySelector(".overlay");
    const closeModel = document.querySelector(".closeShareModel");

    // Display Model
    shareModel.classList.add("active");
    overlay.classList.add("active");

    // Close share model
    closeModel.addEventListener("click", () => {
      shareModel.classList.remove("active");
      overlay.classList.remove("active");
    });

    // SOCIAL MEDIA ELEMENTS
    const socialMediaButtons = {
      copyLink: "Copy Link",
      facebook: "https://www.facebook.com/sharer.php?u=",
      whatsapp: "https://api.whatsapp.com/send?text=",
      telegram: "https://t.me/share/url?url=",
      linkedin: "https://www.linkedin.com/shareArticle?mini=true&url=",
      tumblr: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=",
      reddit: "https://www.reddit.com/submit?url=",
      email: "mailto:?subject=Check this out&body=",
    };

    const handelSocialMedia = (key, value) => {
      const button = document.getElementById(key);

      button.addEventListener("click", () => {
        if (key === "copyLink") {
          const textarea = document.createElement("textarea");
          textarea.value = href;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          alert("Link copied to clipboard");
        } else if (key === "email") {
          window.location.href = `${value}${href}`;
        } else {
          window.open(`${value}${href}`, "_blank");
        }
      });
    };

    Object.entries(socialMediaButtons).forEach(([key, value]) => {
      handelSocialMedia(key, value);
    });
  });
};
