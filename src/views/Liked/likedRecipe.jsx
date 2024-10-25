import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CardComponent from '../../components/Card/HomeCard';
import '../cardList.scss';
import AppLayout from '../../Layout/AppLayout/AppLayout';
import { useUserAuth } from '../../contexts/UserContext/UserContext';
import { db } from '../../config/firebase'; // Import your Firestore database instance
import { collection, query, where, getDocs, doc } from 'firebase/firestore';

const CardsPerPage = 4;

const LikedRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [likedCurrentPage, setLikedCurrentPage] = useState(1);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        // Query the recipes collection
        const recipesQuerySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData = recipesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter recipes based on likes by the current user
        const userLikedRecipes = [];

        for (const recipe of recipesData) {
          const likesQuerySnapshot = await getDocs(collection(db, `recipes/${recipe.id}/likes`));
          const userLiked = likesQuerySnapshot.docs.some(likeDoc => likeDoc.data().userId === user.uid);

          if (userLiked) {
            userLikedRecipes.push(recipe);
          }
        }

        setLikedRecipes(userLikedRecipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching liked recipes:', error);
      }
    };

    if (user) {
      fetchLikedRecipes();
    }
  }, [user]);

  // Pagination handling for liked recipes
  const handleLikedPageChange = (page) => {
    setLikedCurrentPage(page);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <AppLayout isUserLoggedIn={false}>
        <Container>
          <p>Please log in to view liked recipes.</p>
        </Container>
      </AppLayout>
    );
  }

  // Slice recipes based on pagination
  const paginatedLikedRecipes = likedRecipes.slice((likedCurrentPage - 1) * CardsPerPage, likedCurrentPage * CardsPerPage);

  return (
    <AppLayout isUserLoggedIn={true}>
      <Container>
        <div className="recipe-section">
          <h2 className='p-3'>Your Favorite</h2>
          {paginatedLikedRecipes.length > 0 ? (
            <div className="recipe-list">
              <Row md={4} className="align-items-center">
                <Col md={11}>
                  <Row>
                    {paginatedLikedRecipes.map(recipe => (
                      <Col key={recipe.id} md={3}>
                        <CardComponent {...recipe} />
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col md={1} className="d-flex justify-content-end">
                  {/* Pagination Links */}
                  <div>
                    {likedCurrentPage > 1 && (
                      <a href="#" className="next-link fs-2 me-3" onClick={() => setLikedCurrentPage(likedCurrentPage - 1)}>««</a>
                    )}
                    {likedCurrentPage < Math.ceil(likedRecipes.length / CardsPerPage) && (
                      <a href="#" className="next-link fs-2" onClick={() => setLikedCurrentPage(likedCurrentPage + 1)}>»»</a>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <p>You have no liked recipes.</p>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default LikedRecipes;
