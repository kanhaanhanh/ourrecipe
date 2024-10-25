import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../../contexts/UserContext/UserContext';
import { db, storage } from '../../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { Container, Button, Row, Col } from 'react-bootstrap';
import CardComponent from '../Card/HomeCard';
import './Profile.scss';
import AppLayout from '../../Layout/AppLayout/AppLayout';

function UserProfile() {
  const { user } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]); // State for user recipes
  const [editImage, setEditImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState({
    firstname: '',
    lastname: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'userinformation', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const { firstname, lastname, displayName } = userDocSnapshot.data();
          setUserData({ ...userDocSnapshot.data(), firstname, lastname });
          setNewName({ firstname, lastname, displayName });
        }

        const postsQuery = query(collection(db, 'posts'), where('userId', '==', user.uid));
        const postsSnapshot = await getDocs(postsQuery);

        const postsData = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserPosts(postsData);

        // Fetch user recipes
        const recipesQuery = query(collection(db, 'recipes'), where('userId', '==', user.uid));
        const recipesSnapshot = await getDocs(recipesQuery);

        const recipesData = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserRecipes(recipesData);

      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleImageUpload = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage);
  
      const userImageRef = ref(storageRef, `user-images/${user.uid}`);
      const uploadTask = await uploadBytes(userImageRef, newImage);
      const imageUrl = await getDownloadURL(uploadTask.ref);
  
      await updateDoc(doc(db, 'userinformation', user.uid), {
        profileImage: imageUrl,
      });
  
      setUserData({ ...userData, profileImage: imageUrl });
      setEditImage(false);
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleNameUpdate = async () => {
    try {
      await updateDoc(doc(db, 'userinformation', user.uid), {
        displayName: `${newName.firstname} ${newName.lastname}`,
        firstname: newName.firstname,
        lastname: newName.lastname,
      });

      setUserData({
        ...userData,
        displayName: `${newName.firstname} ${newName.lastname}`,
        firstname: newName.firstname,
        lastname: newName.lastname,
      });
      setEditName(false);
    } catch (error) {
      console.error('Error updating name:', error.message);
    }
  };

  if (!user || !userData) {
    return <p>Loading...</p>;
  }

  return (
    <AppLayout isUserLoggedIn={user != null ? true : false}>
      <Container>
        <h1 className='text-center'>Profile</h1>
        <div className="user-profile-card">
          <div className="profile-image-container">
            {editImage ? (
              <div>
                <input type="file" onChange={handleImageChange} />
                <Button variant="primary" onClick={handleImageUpload}>Upload Image</Button>
              </div>
            ) : (
              <img
                src={userData?.profileImage || 'default-image-url'}
                alt="Profile"
                className="profile-image"
                onClick={() => setEditImage(true)}
              />
            )}
          </div>
          <h5>
            {editName ? (
              <div>
                <input
                  type="text"
                  value={newName.firstname}
                  onChange={(e) => setNewName({ ...newName, firstname: e.target.value })}
                />
                <input
                  type="text"
                  value={newName.lastname}
                  onChange={(e) => setNewName({ ...newName, lastname: e.target.value })}
                />
                <Button variant="primary" onClick={handleNameUpdate}>Update Name</Button>
              </div>
            ) : (
              <span onClick={() => setEditName(true)}>{userData?.firstname} {userData?.lastname}</span>
            )}
          </h5>
          <div className="follow-info">
            <p>Followers: {userData?.followersCount}</p>
            <p>Following: {userData?.followingsCount}</p>
          </div>
          <p>Email: {user?.email}</p>
          <h2 className='p-3'>Posts</h2>
          <Row>
            {userRecipes.map((recipe) => (
              <Col key={recipe.id} md={4} className="mb-4">
                <CardComponent {...recipe} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </AppLayout>
  );
}

export default UserProfile;
