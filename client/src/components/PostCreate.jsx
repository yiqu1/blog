import { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://posts.com/posts/create", {
      title,
    });

    setTitle("");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          className="form-control my-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default PostCreate;
