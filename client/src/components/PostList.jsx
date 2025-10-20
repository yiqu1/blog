import axios from "axios";
import { useEffect, useState } from "react";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get("http://posts.com/posts");

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {Object.values(posts).map((post) => (
        <div
          key={post.postId}
          className="card"
          style={{ widows: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{post.title}</h3>

            <CommentList comments={post.comments} />

            <CommentCreate postId={post.postId} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
