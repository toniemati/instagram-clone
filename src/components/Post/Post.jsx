import './Post.css';
import Avatar from '@material-ui/core/Avatar';

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src="" alt="user-image" />
        <h3>{post.username}</h3>
      </div>

      {/* image */}
      <img className="post__image" src={post.imageUrl} alt={post.username} />

      {/* username + caption */}
      <h4 className="post__text">
        <strong>{post.username}: </strong>
        {post.caption}
      </h4>
    </div>
  )
}

export default Post
