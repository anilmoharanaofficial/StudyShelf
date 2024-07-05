/*

const client = (app) => {
  // HOME
  app.get("/", (req, res) => {
    res.render("client/index");
  });

  // AUTH
  app.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

  app.get("/login", (req, res) => {
    res.render("auth/login");
  });

  // USER
  app.get("/profile", (req, res) => {
    res.render("user/profile");
  });

  app.get("/profile/change-password", (req, res) => {
    res.render("user/changepassword");
  });

  // DASHBOARD
  app.get("/dashboard", (req, res) => {
    res.render("dashboard/dashboard");
  });

  app.get("/dashboard/add", (req, res) => {
    res.render("dashboard/add");
  });

  app.get("/dashboard/books", (req, res) => {
    res.render("dashboard/books");
  });

  app.get("/dashboard/:id/update", (req, res) => {
    res.render("dashboard/update");
  });

  // GENERIC SLUG ROUTE
  app.get("/:slug", (req, res, next) => {
    const specificPaths = ["about", "signup", "login", "profile", "dashboard"];

    // Check specific paths
    if (specificPaths.includes(req.params.slug)) {
      return next();
    }

    res.render("client/book");
  });

  // PAGE NOT FOUND
  app.all("*", (req, res, next) => {
    res.status(404).render("error/pageNotFound");
  });
};

export default client;

*/

const client = (app) => {
  // HOME
  app.get("/", (req, res) => {
    res.render("client/index");
  });

  app.get("/about", (req, res) => {
    res.render("client/about");
  });

  // AUTH
  app.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

  app.get("/login", (req, res) => {
    res.render("auth/login");
  });

  // USER
  app.get("/profile", (req, res) => {
    res.render("user/profile");
  });

  app.get("/profile/change-password", (req, res) => {
    res.render("user/changepassword");
  });

  // DASHBOARD
  app.get("/dashboard", (req, res) => {
    res.render("dashboard/dashboard");
  });

  app.get("/dashboard/add", (req, res) => {
    res.render("dashboard/add");
  });

  app.get("/dashboard/books", (req, res) => {
    res.render("dashboard/books");
  });

  app.get("/dashboard/:id/update", (req, res) => {
    res.render("dashboard/update");
  });

  app.get("/book/:slug", (req, res) => {
    res.render("client/book");
  });

  // PAGE NOT FOUND
  app.all("*", (req, res, next) => {
    res.render("error/pageNotFound");
  });
};

export default client;
