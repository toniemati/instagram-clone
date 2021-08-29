import { Button, Input } from '@material-ui/core';
import React from 'react'
import { useState } from 'react';
import './ImageUpload.css';
import { db, storage } from '../../firebase';
import firebase from 'firebase';

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState('');
 
  const handleChange = (e) => {
    //* If file image exist set it
    e.target.files[0] && setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //* Progress function...
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        //* Error function...
        console.log(error);
        alert(error.message);
      },
      () => {
        //* Complete function...
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //* Post image inside db
            db.collection('posts').add({
              username,
              caption,
              imageUrl: url,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setProgress(0);
            setCaption('');
            setImage('');
          });
      }
    )
  };

  return (
    <div className="imageupload">
      <progress style={{ width: '100%' }} value={progress} max="100" />
      <Input placeholder="Enter a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} type="text" />
      <input value={image} type="file" onChange={handleChange} />
      <Button style={{ color: 'orange', borderColor: 'orange' }} onClick={handleUpload} variant="outlined" color="primary">Upload</Button>
    </div>
  )
}

export default ImageUpload
