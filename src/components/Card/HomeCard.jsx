import React, { useState, useEffect, useContext } from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaClock } from 'react-icons/fa';
import { getDoc, doc, updateDoc, increment, getDocs, collection, where, query, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import './Card.scss';
import { db } from '../../config/firebase'; // Import your Firestore database instance
import { userAuthContext } from '../../contexts/UserContext/UserContext.jsx';

const CardComponent = ({ id, title, authorFirstName, authorLastName, images, numLikes, numComments, timestamp, category }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useContext(userAuthContext); // Get the current authenticated user

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        // Query the likes collection to check if the user has liked this card
        const docRef = doc(db, 'recipes', id);
        const likeQuery = await getDocs(query(collection(docRef, 'likes'), where('userId', '==', user.uid)));
        console.log(likeQuery);
        const hasLiked = likeQuery.size > 0;

        // If there is at least one like document, set isLiked to true
        setIsLiked(hasLiked);
      } catch (error) {
        console.error('Error checking if liked:', error);
      }
    };

    // Call the function to check if the current user has liked this card
    if (user) {
      checkIfLiked();
    }
  }, [user, id]);

  // Convert Firebase timestamp to JavaScript Date object
  const dateObject = timestamp.toDate();

  // Format the date to a human-readable string
  const formattedDate = dateObject.toLocaleString();

  return (
    <Col md={6} className="mb-6">
      <Link to={`/card-detail/${id}`} className="link-text">
        <Card style={{ width: '17rem', height: '365px' }} className="card">
          <Card.Img variant="top" src={images} alt={`Card ${id}`} className='home-img' />
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{category}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <div className="author-info">
              <span>{`${authorFirstName} ${authorLastName}`}</span>
            </div>
            <FaHeart style={{ color: isLiked ? 'red' : 'black' }} /> {numLikes} Likes | <FaComment /> {numComments} Comments | <FaClock /> {formattedDate}
          </Card.Footer>
        </Card>
      </Link>
    </Col>
  );
};

export default CardComponent;
