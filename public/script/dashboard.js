document.addEventListener("DOMContentLoaded", () => {
  //////////// SHOW THE USER PROFILE////////////////
  const userProfileImage = document.querySelector(".user-profile");
  const userProfilePopup = document.querySelector(".user-profile-popup");

  userProfileImage.addEventListener("click", () => {
    userProfilePopup.classList.add("show-user-profile-popup");
  });

  document.addEventListener("click", (e) => {
    if (
      !userProfilePopup.contains(e.target) &&
      !userProfileImage.contains(e.target)
    ) {
      userProfilePopup.classList.remove("show-user-profile-popup");
    }
  });

  ////////////ACTIVE PATH HIGHLIGHTER//////////////////
  const navDashboard = document.querySelector(".nav-dashboard");
  const navAllItem = document.querySelector(".nav-all");
  const navAddNew = document.querySelector(".nav-add");
  const navProfile = document.querySelector(".nav-profile");

  activePath(navDashboard, currentURL, "/dashboard");
  activePath(navAllItem, currentURL, "/dashboard/books");
  activePath(navAddNew, currentURL, "/dashboard/add");
  activePath(navProfile, currentURL, "/profile");

  //////////////// SHOW THE ALL ITEMS//////////////////////////////
  const allItems = document.querySelector(".all-posts");
  const allBooks = async () => {
    try {
      const response = await fetch("/api/v1/book", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        closeProgressStatus();
      }

      const responseData = await response.json();
      const data = responseData.data;

      data.forEach((data) => {
        // Author Details
        const createdBy = data.createdBy;
        let authorsInfo = "";
        createdBy.forEach((author) => {
          authorsInfo += `
              <p class="author-name">${normalizeName(author.name)}</p>
              <img src="${author.avatar.secure_url}" alt="" />
            `;
        });

        allItems.innerHTML += `
        <div class="box">
  <div class="content">
    <img src="${data.coverImage.secure_url}" alt="Cover Image" />
    <div class="content-info">
      <h3 class="content-title">${data.bookName}</h3>
      <div>
        <p>Published &bull; ${normalizeDate(data.createdAt)}</p>
        <p>${data.publisher}</p>
      </div>
    </div>
  </div>
  <div class="content-action">
    <div class="author-info">${authorsInfo}</div>
    <div class="action-btns">
      <i class="fa-regular fa-eye view" data-url="${data.slug}"></i>
      <i class="fa-regular fa-pen-to-square"></i>
      <i class="fa-solid fa-trash delete-item" data-id="${data._id}"></i>
      <i class="fa-solid fa-share-nodes share-item"></i>
    </div>
  </div>
</div>
<!-- Delete Model -->
<div class="overlay"></div>
<div class="delete-model">
  <div class="popup">
    <div>
      <h4>Delete</h4>
      <i class="fa-solid fa-xmark" id="closeModel"></i>
    </div>
    <span
      ><h2>Are you sure you want to delete this?</h2>
      <p>This action is permanent and cannot be undone.</p></span
    >
    <div>
      <button id="delete-confirm">Delete</button>
      <button  id="delete-cancel">Cancel</button>
    </div>
  </div>
</div>
<!-- Delete Model End -->

<!-- Share Model -->
<div class="share-model">
  <div class="popup">
    <div class="header">
      <h4>Share to other apps</h4>
      <i class="fa-solid fa-xmark closeShareModel"></i>
    </div>
    <div class="share-apps">
      <div>
        <i class="fa-solid fa-link"></i>
        <p>Copy Link</p>
      </div>
      <div>
        <i class="fa-brands fa-square-facebook"></i>
        <p>Facebook</p>
      </div>
      <div>
        <i class="fa-brands fa-square-whatsapp"></i>
        <p>Whatsapp</p>
      </div>
      <div>
        <i class="fa-brands fa-telegram"></i>
        <p>Telegram</p>
      </div>
      <div>
        <i class="fa-brands fa-linkedin"></i>
        <p>Linkedin</p>
      </div>

      <div>
        <i class="fa-brands fa-square-tumblr"></i>
        <p>Tumblr</p>
      </div>

      <div>
        <i class="fa-brands fa-square-reddit"></i>
        <p>Reddit</p>
      </div>

      <div>
        <i class="fa-regular fa-envelope"></i>
        <p>Email</p>
      </div>
    </div>
  </div>
</div>
        `;
      });
      viewItem();
      shareItem();
      DeleteItem();
    } catch (error) {
      message.textContent = error || "Filed";
      ToastMessage();
    }
  };

  if (currentURL === "/dashboard/books") {
    allBooks();
    ProgressStatus("Loading....");
  }

  ////////////VIEW ITEM//////////////////
  function viewItem() {
    allItems.addEventListener("click", (e) => {
      if (e.target.classList.contains("view")) {
        const url = e.target.getAttribute("data-url");
        window.location.href = `/${url}`;
      }
    });
  }

  //////////SHARE ITEM///////////////////
  function shareItem() {
    allItems.addEventListener("click", (e) => {
      if (e.target.classList.contains("share-item")) {
        const shareModel = document.querySelector(".share-model");
        const overlay = document.querySelector(".overlay");
        shareModel.classList.add("active");
        overlay.classList.add("active");

        // Close share model
        overlay.addEventListener("click", () => {
          shareModel.classList.remove("active");
          overlay.classList.remove("active");
        });

        const closeShareModel = document.querySelector(".closeShareModel");
        closeShareModel.addEventListener("click", () => {
          shareModel.classList.remove("active");
          overlay.classList.remove("active");
        });
      }
    });
  }

  ///////////DELETE ITEM////////////
  function DeleteItem() {
    allItems.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-item")) {
        // ELEMENTS
        const overlay = document.querySelector(".overlay");
        const deleteModel = document.querySelector(".delete-model");
        const deleteConfirmation = document.getElementById("delete-confirm");
        const deleteCancellation = [
          document.getElementById("delete-cancel"),
          document.getElementById("closeModel"),
        ];
        const itemElement = e.target.closest(".box");
        const itemID = e.target.getAttribute("data-id");

        // Active Delete Model
        deleteModel.classList.add("active");
        overlay.classList.add("active");

        // Close Delete Model
        deleteCancellation.forEach((i) => {
          i.addEventListener("click", () => {
            overlay.classList.remove("active");
            deleteModel.classList.remove("active");
          });
        });

        // Final Call For Delete Item
        deleteConfirmation.addEventListener("click", async () => {
          // Close The Model
          overlay.classList.remove("active");
          deleteModel.classList.remove("active");

          // Progress Status
          ProgressStatus("Deleting....");

          try {
            // Delete Request to Database
            const response = await fetch(`/api/v1/book/${itemID}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            const responseData = await response.json();

            if (response.ok) {
              // Remove the item element
              itemElement.remove();

              // Close Progress Status
              closeProgressStatus();

              // Show success message
              message.textContent = responseData.message || "Success";
              ToastMessage();
            } else {
              // Show error message
              message.textContent = responseData.message || "Failed to delete";
              ToastMessage();
            }
          } catch (error) {
            // Show error message
            message.textContent = error.message || "Failed to delete";
            ToastMessage();
          }
        });
      }
    });
  }

  //////////////CREATE NEW ITEM///////////////
  const createNewItem = () => {};

  if (currentURL === "/dashboard/add") {
    createNewItem();
  }
});
