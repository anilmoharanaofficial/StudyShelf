const clients = (app) => {
  app.get("/", (req, res) => {
    res.send("Hi World");
  });
};

export default clients;
