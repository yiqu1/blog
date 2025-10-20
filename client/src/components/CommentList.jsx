const CommentList = ({ comments }) => {
  return (
    <ul>
      {comments.map((comment) =>
        comment.status === "approved" ? (
          <li key={comment.commentId}>{comment.content}</li>
        ) : comment.status === "pending" ? (
          <li key={comment.commentId}>This comment is awaiting moderation</li>
        ) : (
          <li key={comment.commentId}>This comment has been rejected</li>
        )
      )}
    </ul>
  );
};

export default CommentList;
