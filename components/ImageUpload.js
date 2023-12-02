// components/ImageUpload.js
import { useState, useEffect } from 'react';
// import { storage, ref, uploadBytes, getDownloadURL, listAll, getMetadata } from '../firebase';
import { useDropzone } from 'react-dropzone';
import { FaSpinner } from 'react-icons/fa';
import { addDoc, collection, getDocs, limit, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, getDownloadURL, ref, storage, uploadBytes } from '../firebase';
import { getMetadata, listAll } from '@firebase/storage';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0 && !uploading) {
      setImage(acceptedFiles[0]);
    }
  };

  const removeImage = () => {
    if (!uploading) {
      setImage(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', disabled: uploading });

  const handleUpload = async () => {
    if (!image || uploading) {
      console.error('No image selected or upload in progress');
      return;
    }
  
    try {
      setUploading(true);
      const storageRef = ref(storage, `UploadedImages/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image, (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      });
  
      const url = await getDownloadURL(snapshot.ref);
  
      // Get all documents from Firestore
      const querySnapshot = await getDocs(collection(db, 'ImageFiles'));
  
      // Find the highest index number
      let highestIndexNumber = 0;
      querySnapshot.forEach((doc) => {
        const indexNumber = doc.data().indexNumber;
        highestIndexNumber = Math.max(highestIndexNumber, indexNumber);
      });
  
      console.log('Current highestIndexNumber:', highestIndexNumber);
  
      // Add information to Firestore with a new index number
      const newDocRef = await addDoc(collection(db, 'ImageFiles'), {
        imageUrl: url,
        indexNumber: highestIndexNumber + 1,
        imageId: snapshot.metadata.customMetadata?.imageId || null,
        publishedDate: serverTimestamp(),
      });
  
      console.log('Image information added to Firestore with ID:', newDocRef.id);
      console.log('New indexNumber:', highestIndexNumber + 1);
    } catch (error) {
      console.error(error.message);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer relative ${isDragActive ? 'bg-blue-100' : ''}`}>
        <input {...getInputProps()} />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded">
            <FaSpinner className="text-white animate-spin" size={30} />
          </div>
        )}
        {image && (
          <div className="relative">
            <img src={URL.createObjectURL(image)} alt="Selected" className="max-w-full max-h-48 mt-4" />
            <button onClick={removeImage} className="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-red-500 text-xl" title="Remove Image">
              &times;
            </button>
          </div>
        )}
        {!image && !uploading && <p>Drag 'n' drop an image here, or click to select one</p>}
      </div>
      <button onClick={handleUpload} className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded ${uploading ? 'cursor-not-allowed opacity-50' : ''}`} disabled={uploading}>
        Upload
      </button>
      <div className="mt-2">{uploading ? `${progress.toFixed(2)}% Uploaded` : null}</div>
    </div>
  );
};

export default ImageUpload;
