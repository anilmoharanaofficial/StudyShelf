document.addEventListener("DOMContentLoaded", () => {
  ///////////////////////ELEMENTS////////////////////
  const loginBtn = document.querySelector(".login-button");
  const userProfile = document.querySelector(".user");

  const bookContainer = document.querySelector(".card-container");

  //////////////FETCH BOOKS/////////////////////
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/v1/book", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const bookData = responseData.data;

      // Fetching Status
      // ProgressStatus("Loading...");

      bookContainer.innerHTML = "";

      bookData.forEach((book) => {
        bookContainer.innerHTML += `<div class="card">
          <img
            class="card-img"
            src="${book.coverImage.secure_url}"
          />
          <div class="card-info">
            <button class="class-name">${book.className}</button>
            <button class="publisher-name">${book.publisher}</button>
          </div>
          <p class="card-titlt">${book.bookName}</p>
        </div>`;
      });

      // if (response.ok) {
      //   closeProgressStatus();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  fetchBooks();

  ///////////FETCH USER DETAILS///////////////////
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/v1/user/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const userData = responseData.data;

      if (!response.ok) {
        //Hide User Profile
        userProfile.classList.add("hide");
      }

      if (response.ok) {
        //Hide Login Button on Header
        loginBtn.classList.add("hide");

        // Display User Profile on Header
        document.getElementById("user-avatar").src = userData.avatar.secure_url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchUserDetails();
});
