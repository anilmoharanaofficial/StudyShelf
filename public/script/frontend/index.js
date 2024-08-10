document.addEventListener("DOMContentLoaded", () => {
  ///////////////////////////////////////////
  //ELEMENTS
  const bookContainer = document.querySelector(".card-container");
  const pageLoadBtn = document.querySelector(".more-btn");

  const shareBtn = document.getElementById("share");
  const bookMarkBtn = document.getElementById("bookmark");
  const bookMarkedBtn = document.getElementById("bookmarked");

  /////////////////////////////////////////////
  //FETCH BOOKS *HomePage *Category
  let currentPage =
    new URLSearchParams(window.location.search).get("page") || 1;
  const limit = 12;

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

  /////////////////////////////////////////////////
  /////////VIEW BOOK

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

    // BookMark
    const bookid = book._id;
    bookMarkBtn.addEventListener("click", () => {
      bookMark(bookid);
    });
    bookMarked(bookid);

    // Remove BookMark
    bookMarkedBtn.addEventListener("click", () => {
      removeBookMark(bookid);
    });

    // SHARE MODEL
    shareModel(shareBtn);
  };

  if (currentURL === `/book/${slug}`) {
    viewBook();
  }

  ////////////////////////////////////////////////
  //////HANDEL BOOKMARK
  const bookMark = async (id) => {
    const bookId = {
      bookId: id,
    };

    try {
      const response = await fetch("/api/v1/readingList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookId),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.redirect) {
          window.location.href = responseData.redirect;
        }
        return;
      }

      if (response.ok) {
        bookMarkBtn.classList.add("removeBookMarkButton");
        bookMarkedBtn.classList.remove("removeBookMarkButton");
      } else {
        console.error(responseData.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //////////////////////////////////////////////
  //HIGHLIGH *IF BOOKMARKED
  const bookMarked = (bookId) => {
    if (!localStorage.getItem("userData")) {
      fetchUserDetails();
    }

    let data = JSON.parse(localStorage.getItem("userData"));

    if (data.readingList.includes(bookId)) {
      bookMarkBtn.classList.add("removeBookMarkButton");
      bookMarkedBtn.classList.remove("removeBookMarkButton");
    }
  };

  //////////////////////////////////////////////////
  //REMOVE BOOKMARK
  const removeBookMark = async (id) => {
    const response = await fetch(`/api/v1/readingList/remove/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (response.ok) {
      bookMarkBtn.classList.remove("removeBookMarkButton");
      bookMarkedBtn.classList.add("removeBookMarkButton");
    } else {
      console.log(responseData.message);
    }
  };
});
