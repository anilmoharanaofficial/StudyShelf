const client = (app) => {
  app.get("/", (req, res) => {
    res.send("Hi World");
  });

  // AUTH
  app.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

  app.get("/login", (req, res) => {
    res.render("auth/login");
  });

  // PAGE NOT FOUND
  app.all("*", (req, res, next) => {
    res.render("pageNotFound");
  });
};

export default client;
