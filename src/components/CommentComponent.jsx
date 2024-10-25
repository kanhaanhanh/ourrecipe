import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { db } from '../config/firebase';
import { addDoc, collection, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { useContext } from 'react';
import { userAuthContext } from '../contexts/UserContext/UserContext';
import '../views/cardDetail/cardDetail.css';

const CommentComponent = ({ comment, fetchUserInfo, cardId }) => {
  const { user } = useContext(userAuthContext);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);

  const handleReply = async () => {
    if (replyText.trim() !== '') {
      const newReply = {
        userId: user.uid,
        text: replyText,
        timestamp: serverTimestamp(),
        parentId: comment.id
      };
      setReplies((prevReplies) => [...prevReplies, newReply]);

      try {
        const docRef = doc(db, 'recipes', cardId);
        await addDoc(collection(docRef, 'comments'), newReply);
        await updateDoc(docRef, {
          numComments: increment(1),
        });
      } catch (error) {
        console.error('Error adding reply:', error);
      }

      setReplyText('');
      setShowReplyBox(false);
    }
  };

  return (
    <div className="comment">
      <p>
        <strong>{comment.userInfo ? `${comment.userInfo.firstname} ${comment.userInfo.lastname}` : 'Unknown'}</strong>: {comment.text}
      </p>
      <Button variant="link" size="sm" onClick={() => setShowReplyBox(!showReplyBox)}>
        Reply
      </Button>
      {showReplyBox && (
        <Form.Group controlId="replyForm">
          <Form.Control
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={handleReply}>
            Post
          </Button>
        </Form.Group>
      )}
      <div className="replies">
        {replies.map((reply, index) => (
          <CommentComponent key={index} comment={reply} fetchUserInfo={fetchUserInfo} cardId={cardId} />
        ))}
      </div>
    </div>
  );
};

export default CommentComponent;
