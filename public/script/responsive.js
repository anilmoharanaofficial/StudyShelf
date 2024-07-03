document.addEventListener("DOMContentLoaded", function () {
  //////////////HAMBURGER MENU/////////////////
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  // toggle sidebar
  function toggleSidebar() {
    sidebar.classList.toggle("sidebar-open");
    mainContent.classList.toggle("main-content-open");
  }

  //  hamburger menu
  hamburgerMenu.addEventListener("click", function () {
    toggleSidebar();
  });

  // closing sidebar when clicking outside of it
  document.addEventListener("click", function (event) {
    const targetElement = event.target;
    if (
      !targetElement.closest(".sidebar") &&
      !targetElement.closest(".hamburger-menu")
    ) {
      if (sidebar.classList.contains("sidebar-open")) {
        toggleSidebar();
      }
    }
  });
});
