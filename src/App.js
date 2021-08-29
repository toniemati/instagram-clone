import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import Post from './components/Post/Post';
import { db, auth } from './firebase';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    // width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleSignUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) =>  alert(error.message));
    
      setOpen(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //* user logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //* dont update username
        } else {
          //* if we just created someone
          return authUser.updateProfile({
            displayName: username
          });
        }
      } else {
        //* user logged out...
        setUser(null);
      }
    });

    return () =>  {
      //* perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);
  
  //* Getting all posts from firebase 🔥
  useEffect(() => {
    db.collection('posts')
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })));
      });
  }, []);

  return (
    <div className="app">

      {/* signup modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <center>
            <h1>Signup Instagram clone 📸</h1>
          </center>
          <form className="app__signup" onSubmit={handleSignUp}>
            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit">Sing up</Button>
          </form>
        </div>
      </Modal>

      {/* login modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <center>
            <h1>Login Instagram clone 📸</h1>
          </center>
          <form className="app__signup" onSubmit={handleLogin}>
            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit">Login</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram logo" />
      </div>

      {user 
        ? <Button onClick={() => auth.signOut()} variant="contained" color="primary">Logout</Button>
        : (
          <div className="login__container">
            <Button style={{ backgroundColor: 'green' }} onClick={() => setOpen(true)} variant="contained" color="primary">Log in</Button>
            <Button onClick={() => setOpenSignIn(true)} variant="contained" color="primary">Sign up</Button>
          </div>
        )
      }

      <div className="app__posts">
        {
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        }
      </div>
    </div>
  );
}

export default App;
