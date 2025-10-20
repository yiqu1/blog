import PostCreate from "./components/PostCreate";
import PostList from "./components/PostList";

function App() {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate />

      <h1 className="mt-2">Posts</h1>
      <PostList />
    </div>
  );
}

export default App;
