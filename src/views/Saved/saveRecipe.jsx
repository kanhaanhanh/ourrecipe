import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CardComponent from '../../components/Card/HomeCard';
import '../cardList.scss';
import AppLayout from '../../Layout/AppLayout/AppLayout';
import { useUserAuth } from '../../contexts/UserContext/UserContext';
import { db } from '../../config/firebase'; // Import your Firestore database instance
import { collection, query, where, getDocs } from 'firebase/firestore';

const CardsPerPage = 4;

const SavedRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedCurrentPage, setSavedCurrentPage] = useState(1);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        // Query the recipes collection
        const recipesQuerySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData = recipesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter recipes based on saves by the current user
        const userSavedRecipes = [];

        for (const recipe of recipesData) {
          const savedQuerySnapshot = await getDocs(collection(db, `recipes/${recipe.id}/saved`));
          const userSaved = savedQuerySnapshot.docs.some(savedDoc => savedDoc.data().userId === user.uid);

          if (userSaved) {
            userSavedRecipes.push(recipe);
          }
        }

        setSavedRecipes(userSavedRecipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  // Pagination handling for saved recipes
  const handleSavedPageChange = (page) => {
    setSavedCurrentPage(page);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <AppLayout isUserLoggedIn={false}>
        <Container>
          <p>Please log in to view saved recipes.</p>
        </Container>
      </AppLayout>
    );
  }

  // Slice recipes based on pagination
  const paginatedSavedRecipes = savedRecipes.slice((savedCurrentPage - 1) * CardsPerPage, savedCurrentPage * CardsPerPage);

  return (
    <AppLayout isUserLoggedIn={true}>
      <Container>
        <div className="recipe-section">
          <h2 className='p-3'>Your Saved Recipes</h2>
          {paginatedSavedRecipes.length > 0 ? (
            <div className="recipe-list">
              <Row md={4} className="align-items-center">
                <Col md={11}>
                  <Row>
                    {paginatedSavedRecipes.map(recipe => (
                      <Col key={recipe.id} md={3}>
                        <CardComponent {...recipe} />
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col md={1} className="d-flex justify-content-end">
                  {/* Pagination Links */}
                  <div>
                    {savedCurrentPage > 1 && (
                      <a href="#" className="next-link fs-2 me-3" onClick={() => setSavedCurrentPage(savedCurrentPage - 1)}>««</a>
                    )}
                    {savedCurrentPage < Math.ceil(savedRecipes.length / CardsPerPage) && (
                      <a href="#" className="next-link fs-2" onClick={() => setSavedCurrentPage(savedCurrentPage + 1)}>»»</a>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <p>You have no saved recipes.</p>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default SavedRecipes;
