import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/create-blog.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const blog = { title: "", content: "" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill the reqired fields.");
      return;
    }
    blog.title = title;
    blog.content = content;
    console.log(blog);
    const response = await axios.post("http://localhost:5000/", blog);
    console.log(response.data);
    navigate("/view");
  };

  function handleTitle(event) {
    setTitle(event.target.value);
    // console.log(event);
  }
  function handleContent(event) {
    setContent(event.target.value);
    // console.log(content);
  }
  return (
    <div className="blog-creator-container">
      <h1>Create your blog</h1>
      <form onSubmit={handleSubmit} className="create-blog-form" action="post">
        <input
          onChange={handleTitle}
          className="create-title"
          type="text"
          placeholder="Title here"
          value={title}
        />
        <textarea
          onChange={handleContent}
          className="create-blog"
          placeholder="Content here"
          noresize="noresize"
          value={content}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{ marginLeft: "auto", borderColor: "black", color: "black" }}
          className="post-button"
        >
          Post
        </Button>
      </form>
    </div>
  );
}

export default CreateBlog;
