import "../styles/blog.css";

function Blog(props) {
  const timestamp = new Date(props.date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date =
    monthNames[timestamp.getMonth()] +
    " " +
    timestamp.getDate() +
    ", " +
    timestamp.getFullYear();

  return (
    <div className="blog-container">
      <div className="blog-title">{props.title}</div>
      <div className="blog-content">{props.content}</div>
      <div className="blog-date">{date}</div>
    </div>
  );
}
export default Blog;
