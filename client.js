const client = (app) => {
  app.get("/", (req, res) => {
    res.send("Hi World");
  });
};

export default client;
