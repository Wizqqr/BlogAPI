import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index", { posts: response.data });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.get("/new", (req, res) => {
  res.render("modify", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, req.body);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

app.post("/api/posts/:id", async (req, res) => {
  try {
    await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
    res.redirect("/");
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Frontend server is running on http://localhost:${port}`);
});
