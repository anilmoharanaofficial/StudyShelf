document.addEventListener("DOMContentLoaded", () => {
  ///////////////////////ELEMENTS////////////////////
  const loginBtn = document.querySelector(".login-button");
  const userProfile = document.querySelector(".user");

  const bookContainer = document.querySelector(".card-container");
  const pageLoadBtn = document.querySelector(".more-btn");

  //////////////FETCH USER DETAILS///////////////////
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
        loginBtn.classList.remove("hide");
      }

      if (response.ok) {
        //Hide Login Button on Header
        userProfile.classList.remove("hide");

        // Display User Profile on Header
        document.getElementById("user-avatar").src = userData.avatar.secure_url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchUserDetails();

  //////////////FETCH BOOKS/////////////////////

  let currentPage =
    new URLSearchParams(window.location.search).get("page") || 1;
  const limit = 12;

  // Show Fetching Status
  // ProgressStatus("Loading...");

  const fetchBooks = async (page, limit) => {
    try {
      const response = await fetch(`/api/v1/book?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const bookData = responseData.data;

      if (page === 1) {
        bookContainer.innerHTML = "";
      }

      bookData.forEach((book) => {
        bookContainer.innerHTML += `<div class="card">
          <a href="/book/${book.slug}"><img
            class="card-img view-book" slug-data="${book.slug}"
            src="${book.coverImage.secure_url}"
          /></a>
          <div class="card-info">
            <button class="class-name">${book.className}</button>
            <button class="publisher-name">${book.publisher}</button>
          </div>
          <a href="/book/${book.slug}"><p class="card-titlt view-book" slug-data="${book.slug}">${book.bookName}</p> </a>
        </div>`;
      });

      if (response.ok) {
        // Hide Fetching Status
        closeProgressStatus();
      }

      // Hide Load More Buttom
      if (limit > bookData.length) {
        pageLoadBtn.classList.add("disable-more-btn");
        pageLoadBtn.disabled = true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (currentURL === "/") {
    fetchBooks(currentPage, limit);

    // CHNAGE PAGE
    pageLoadBtn.addEventListener("click", () => {
      currentPage++;
      fetchBooks(currentPage, limit);
      updateURL(currentPage);
    });

    // Update URL *Add Currect Page on URL
    const updateURL = (page) => {
      const url = new URL(window.location);
      url.searchParams.set("page", page);
      window.history.pushState({}, "", url);
    };
  }

  //////////////////VIEW BOOK////////////////////////

  // Extract The Slug From URL
  const path = window.location.pathname;
  const slug = path.replace("/", "").replace("book/", "");

  // Fetch Book Data
  const viewBook = async () => {
    const response = await fetch(`/api/v1/book/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    const book = responseData.data;

    // Display Book Content
    document.querySelector(".book-title").innerHTML = book.bookName;
    document.getElementById("date").innerHTML = normalizeDate(book.updatedAt);
    document.querySelector(".description").innerHTML = book.description;
    document.getElementById("view-book-image").src = book.coverImage.secure_url;
    document.getElementById("className").innerHTML = book.className;
    document.getElementById("bookLang").innerHTML = book.moreDetails.language;
    document.getElementById("pubYear").innerHTML = book.moreDetails.publishYear;
    document.getElementById("Publisher").innerHTML = book.publisher;

    // DOWNLOAD BOOK FILE *PDF *ZIP
    const downloadBtn = document.querySelector(".download-book");
    downloadBtn.addEventListener("click", () => {
      const file = book.bookFiles.secure_url;
      window.location.href = file;
    });
  };

  if (currentURL === `/book/${slug}`) {
    viewBook();
  }

  //////////////////////NAV//////////////////////////
  const navLink = document.querySelectorAll(".nav-link");

  // navLink.forEach((link) => {
  //   link.addEventListener("click", async (e) => {
  //     e.preventDefault();

  //     const page = link.getAttribute("view");

  //     try {
  //       const response = await fetch(`/${page}`);
  //       if (!response.ok) {
  //         throw new Error(
  //           `Network response was not ok: ${response.statusText}`
  //         );
  //       }
  //       const html = await response.text();
  //       document.getElementById("content").innerHTML = html;
  //     } catch (error) {
  //       console.error("Error loading page:", error);
  //     }
  //   });
  // });

  ////////////////VIEW BOOK/////////////////////////
});
