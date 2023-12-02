// components/DisplayImageGallery.js
import { useState, useEffect } from 'react';
import { storage, ref, listAll, getDownloadURL } from '../firebase';
import Modal from 'react-modal';
import { useDrag, useDrop } from 'react-dnd';
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

Modal.setAppElement('#__next'); // Set the app root element for accessibility

const DisplayImage = ({ imageUrl, onImageClick, index, moveImage }) => {
  const [, ref] = useDrag({
    type: 'IMAGE',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover(item) {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drop(ref(node))} onClick={onImageClick} className="cursor-pointer">
      <img src={imageUrl} alt="Image" className="w-full h-32 object-cover rounded" />
    </div>
  );
};

const DisplayImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Query images from Firestore ordered by indexNumber
        const querySnapshot = await getDocs(query(collection(db, 'ImageFiles'), orderBy('indexNumber')));
        const imageUrls = [];

        // Extract image URLs from the documents
        querySnapshot.forEach((doc) => {
          const imageUrl = doc.data().imageUrl;
          imageUrls.push({ imageUrl, id: doc.id, indexNumber: doc.data().indexNumber });
        });

        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error.message);
      }
    };

    fetchImages();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const moveImage = async (from, to) => {
    const reorderedImages = [...images];
    const movedImage = reorderedImages[from];
    reorderedImages.splice(from, 1);
    reorderedImages.splice(to, 0, movedImage);

    // Update the indexNumber values in Firestore
    const batch = [];
    reorderedImages.forEach((image, index) => {
      batch.push(updateDoc(doc(db, 'ImageFiles', image.id), { indexNumber: index + 1 }));
    });

    await Promise.all(batch);
    setImages(reorderedImages);
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-3 gap-4">
        {images.map(({ imageUrl, id }, index) => (
          <DisplayImage
            key={id}
            imageUrl={imageUrl}
            onImageClick={() => openModal(imageUrl)}
            index={index}
            moveImage={moveImage}
          />
        ))}
      </div>
      <Modal
        isOpen={!!selectedImage}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modal absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-md rounded p-4 z-50"
        overlayClassName="overlay fixed inset-0 bg-black opacity-50"
      >
        <div className="modal-content relative">
          <img src={selectedImage} alt="Selected" className="w-full h-auto" />
          <button onClick={closeModal} className="close-button absolute top-4 right-4 text-3xl text-gray-700">
            &times;
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DisplayImageGallery;
