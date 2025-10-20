import { useState, useEffect } from "react";
import axios from "axios";
import Blog from "./Blog";

import "../styles/view-blog.css";

function ShowBlogs() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axios.get("http://localhost:5000/getBlogs", {
          withCredentials: true,
        });
        console.log(response);
        setBlogs(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBlogs();
  }, []);

  console.log(blogs[0]);

  return (
    <div className="showblog-container">
      {blogs.map((blog) => {
        return (
          <Blog
            key={blog.blog_id}
            title={blog.title}
            content={blog.content}
            date={blog.date}
          />
        );
      })}
    </div>
  );
}
export default ShowBlogs;
