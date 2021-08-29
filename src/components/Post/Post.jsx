import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import firebase from 'firebase';

const Post = ({ user, post }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const postComment = (e) => {
    e.preventDefault();
    if (!comment.length) return;

    db.collection('posts').doc(post.id).collection('comments').add({
      username: user.displayName,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  };

  useEffect(() => {
    let unsubscribe;
    if (!post?.id) return;

    unsubscribe = db
      .collection('posts')
      .doc(post.id)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })));
      });

    return () => {
      unsubscribe();
    }
  }, [post.id]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src="" alt="user-image" />
        <h3><code>{post.username}</code></h3>
      </div>

      <img className="post__image" src={post.imageUrl} alt={post.username} />

      <h4 className="post__text">
        <strong>{post.username}: </strong>
        {post.caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
            <p key={comment.id}>
              <strong>{comment.username}: </strong>{comment.text}
            </p>
          ))}
      </div>

      {user &&
        <form className="post__commentBox" onSubmit={postComment}>
          <input className="post__input" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} type="text" />
          <button className="post__button" disabled={!comment.trim()} type="submit">Post</button>
        </form>
      }
    </div>
  )
}

export default Post
