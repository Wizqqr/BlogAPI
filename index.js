import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 4000;

let posts = [];
let lastIdPosts = 0;

function loadData(fileName, dataArray) {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    if (data.trim()) {
      const parsedData = JSON.parse(data);
      dataArray.splice(0, dataArray.length, ...parsedData);
      return dataArray.length ? dataArray[dataArray.length - 1].id : 0;
    } else {
      dataArray.length = 0;
      return 0;
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      dataArray.length = 0;
    } else {
      console.error(`Error reading ${fileName}:`, error);
      dataArray.length = 0;
    }
    return 0;
  }
}

function saveData(fileName, dataArray) {
  try {
    fs.writeFileSync(fileName, JSON.stringify(dataArray, null, 2));
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
  }
}

lastIdPosts = loadData('posts.json', posts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

app.post('/posts', (req, res) => {
  const newId = lastIdPosts + 1;
  const newPost = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  posts.push(newPost);
  lastIdPosts = newId;
  saveData('posts.json', posts);
  res.json(newPost);
});

app.patch('/posts/:id', (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  saveData('posts.json', posts);
  res.json(post);
});

app.delete('/posts/:id', (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  saveData('posts.json', posts);
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
