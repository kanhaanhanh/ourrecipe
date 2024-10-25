import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { getDoc, doc, updateDoc, increment, getDocs, collection, where, query, addDoc, serverTimestamp, deleteDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { userAuthContext } from '../../contexts/UserContext/UserContext.jsx';
import AppLayout from '../../Layout/AppLayout/AppLayout.jsx';
import FetchUserSavedRecipes from '../Saved/fetchUserSavedRecipes.jsx';
import CardComponent from '../../components/Card/HomeCard'; // Ensure you have the correct import path
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaUserPlus, FaUserCheck } from 'react-icons/fa'; // Add this line

const fetchUserInfo = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'userinformation', userId));
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user information:', error);
    return null;
  }
};

const CardDetailComponent = () => {
  const { id } = useParams();
  const [cardDetails, setCardDetails] = useState({});
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const { user } = useContext(userAuthContext);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCardDetails(data);

          if (user) {
            const likeQuery = await getDocs(query(collection(docRef, 'likes'), where('userId', '==', user.uid)));
            const hasLiked = likeQuery.size > 0;
            setIsLiked(hasLiked);

            const saveQuery = await getDocs(query(collection(docRef, 'saved'), where('userId', '==', user.uid)));
            const hasSaved = saveQuery.size > 0;
            setIsSaved(hasSaved);

            // Check if the user is already following the author
            const userRef = doc(db, 'userinformation', user.uid);
            const followingQuery = await getDocs(collection(userRef, 'following'));
            const isAlreadyFollowing = followingQuery.docs.some(doc => doc.id === data.userId);
            setFollowing(isAlreadyFollowing);
          }

          // Fetch similar recipes if the category is defined
          if (data.category && id) {
            const similarRecipesQuery = query(
              collection(db, 'recipes'),
              where('category', '==', data.category),
              where('__name__', '!=', id) // Ensure this aligns with your index settings
            );
            const similarRecipesSnapshot = await getDocs(similarRecipesQuery);
            const similarRecipesData = similarRecipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSimilarRecipes(similarRecipesData);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchCardDetails();
  }, [id, user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'recipes', id, 'comments'), async (snapshot) => {
      const commentsData = [];
      for (const doc of snapshot.docs) {
        const commentData = doc.data();
        const userInfo = await fetchUserInfo(commentData.userId);
        commentsData.push({ id: doc.id, ...commentData, userInfo });
      }
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      // Redirect to login if user is not logged in
      return <Link to="/login" />;
    }

    try {
      const docRef = doc(db, 'recipes', id);
      const likeQuery = await getDocs(query(collection(docRef, 'likes'), where('userId', '==', user.uid)));
      const hasLiked = likeQuery.size > 0;

      setLikes((prevLikes) => (hasLiked ? (prevLikes === 1 ? prevLikes : prevLikes - 1) : prevLikes + 1));
      setIsLiked((prevIsLiked) => !prevIsLiked);

      if (hasLiked) {
        const likeDoc = likeQuery.docs[0];
        await deleteDoc(doc(collection(docRef, 'likes'), likeDoc.id));
      } else {
        await addDoc(collection(docRef, 'likes'), {
          userId: user.uid,
          timestamp: serverTimestamp(),
          recipeId: id,
        });
      }

      await updateDoc(docRef, {
        numLikes: hasLiked ? increment(-1) : increment(1),
      });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleComment = async () => {
    if (!user) {
      // Redirect to login if user is not logged in
      return <Link to="/login" />;
    }

    if (commentText.trim() !== '') {
      const newComment = {
        userId: user.uid,
        text: commentText,
        timestamp: serverTimestamp()
      };
      setComments((prevComments) => [...prevComments, newComment]);

      try {
        const docRef = doc(db, 'recipes', id);
        await addDoc(collection(docRef, 'comments'), newComment);
        await updateDoc(docRef, {
          numComments: increment(1),
        });
      } catch (error) {
        console.error('Error adding comment:', error);
      }

      setCommentText('');
      setShowCommentBox(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      // Redirect to login if user is not logged in
      return <Link to="/login" />;
    }

    try {
      const docRef = doc(db, 'recipes', id);
      const saveQuery = await getDocs(query(collection(docRef, 'saved'), where('userId', '==', user.uid)));
      const hasSaved = saveQuery.size > 0;

      setIsSaved((prevIsprevSaved) => !prevIsprevSaved);

      if (hasSaved) {
        const saveDoc = saveQuery.docs[0];
        await deleteDoc(doc(collection(docRef, 'saved'), saveDoc.id));
      } else {
        await addDoc(collection(docRef, 'saved'), {
          userId: user.uid,
          timestamp: serverTimestamp(),
          recipeId: id,
        });
      }

      const updatedSavedRecipes = await FetchUserSavedRecipes(user.uid);
      console.log('Updated saved recipes:', updatedSavedRecipes);
    } catch (error) {
      console.error('Error updating saves:', error);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      // Redirect to login if user is not logged in
      return <Link to="/login" />;
    }

    try {
      const userRef = doc(db, 'userinformation', user.uid);
      const ownerRef = doc(db, 'userinformation', cardDetails.userId);
      const userFollowingRef = doc(collection(userRef, 'following'), cardDetails.userId);
      const ownerFollowersRef = doc(collection(ownerRef, 'followers'), user.uid);
      const followingDoc = await getDoc(userFollowingRef);
      const isAlreadyFollowing = followingDoc.exists();
      setFollowing((isFollowing) => !isFollowing);
      if (!isFollowing && !isAlreadyFollowing) {
        await Promise.all([
          setDoc(userFollowingRef, { timestamp: serverTimestamp() }),
          setDoc(ownerFollowersRef, { timestamp: serverTimestamp() }),
          updateDoc(userRef, { followingsCount: increment(1) }),
          updateDoc(ownerRef, { followersCount: increment(1) })
        ]);
      } else {
        await Promise.all([
          deleteDoc(userFollowingRef),
          deleteDoc(ownerFollowersRef),
          updateDoc(userRef, { followingsCount: increment(-1) }),
          updateDoc(ownerRef, { followersCount: increment(-1) })
        ]);
      }

    } catch (error) {
      console.error('Error handling follow:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleComment();
    }
  };

  return (
    <AppLayout isUserLoggedIn={user != null}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex">
          <div className="d-flex flex-column align-items-center mx-2">
            <Button variant="link" className="p-0" onClick={handleLike} disabled={!user}>
              {isLiked ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
            </Button>
            <span style={{ color: isLiked ? 'red' : 'inherit' }}>Like</span>
          </div>
          <div className="d-flex flex-column align-items-center mx-2">
            <Button variant="link" className="p-0" onClick={() => setShowCommentBox(true)} disabled={!user}>
              <FaComment size={24} />
            </Button>
            <span>Comment</span>
          </div>
          <div className="d-flex flex-column align-items-center mx-2">
            <Button variant="link" className="p-0" onClick={handleSave} disabled={!user}>
              {isSaved ? <FaBookmark color="green" size={24} /> : <FaRegBookmark size={24} />}
            </Button>
            <span style={{ color: isSaved ? 'green' : 'inherit' }}>Save</span>
          </div>
          <div className="d-flex flex-column align-items-center mx-2">
            <Button variant="link" className="p-0" onClick={handleFollow} disabled={!user}>
              {isFollowing ? (
                <>
                  <FaUserCheck size={24} /> <span>{`Followed ${cardDetails.authorFirstName} ${cardDetails.authorLastName}`}</span>
                </>
              ) : (
                <>
                  <FaUserPlus size={24} /> <span>{`Follow ${cardDetails.authorFirstName} ${cardDetails.authorLastName}`}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {showCommentBox && (
        <Form.Group controlId="commentForm">
          <Form.Control
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button variant="outline-secondary" onClick={handleComment}>
            Post
          </Button>
        </Form.Group>
      )}

      <div className='text-center'>
        <h2>{cardDetails.title}</h2>
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ flexBasis: '60%' }}>
            <img src={cardDetails.images} alt={`Card ${id}`} style={{ maxWidth: '100%' }} />
            <p>{cardDetails.description}</p>
          </div>
          <div style={{ flexBasis: '30%' }}>
            <p>Category: {cardDetails.category}</p>
            <p>Prep time: {cardDetails.preparationTime}</p>
            <p>Cook time: {cardDetails.cookTime}</p>
            <p>Ingredients: {cardDetails.ingredients}</p>
            <p>Directions: {cardDetails.directions}</p>
            <div>
              <h3>Comments</h3>
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index}>
                    <p><strong>{comment.userInfo ? `${comment.userInfo.firstname} ${comment.userInfo.lastname}` : 'Unknown'}</strong>: {comment.text} </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className='p-3'>Similar Recipes</h3>
        <Row>
          {similarRecipes.length === 0 ? (
            <p>No similar recipes found.</p>
          ) : (
            similarRecipes.map(recipe => (
              <Col key={recipe.id} md={3}>
                <CardComponent {...recipe} />
              </Col>
            ))
          )}
        </Row>
      </div>
    </AppLayout>
  );
};

export default CardDetailComponent;
