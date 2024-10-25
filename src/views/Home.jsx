import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CardComponent from '../components/Card/HomeCard';
import './cardList.scss';
import AppLayout from '../Layout/AppLayout/AppLayout';
import { useUserAuth } from '../contexts/UserContext/UserContext';
import { RecipeContext } from '../contexts/RecipeContext/RecipeContext';
import { Timestamp } from 'firebase/firestore';

const CardsPerPage = 4;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [popularCurrentPage, setPopularCurrentPage] = useState(1);
  const [newestCurrentPage, setNewestCurrentPage] = useState(1);
  const { user } = useUserAuth();
  const { recipes, searchRecipe } = useContext(RecipeContext);

  useEffect(() => {
    if (recipes.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [recipes]);

  const convertToDate = (timestamp) => {
    return timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  };

  const filterAndSortRecipes = (recipes, criteria) => {
    const filteredRecipes = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
    );

    if (criteria === 'popular') {
      return filteredRecipes.sort((a, b) => b.numLikes - a.numLikes);
    } else if (criteria === 'new') {
      return filteredRecipes.sort((a, b) => 
        convertToDate(b.timestamp).getTime() - convertToDate(a.timestamp).getTime()
      );
    }

    return filteredRecipes;
  };

  // Pagination handling for popular recipes
  const handlePopularPageChange = (page) => {
    setPopularCurrentPage(page);
  };

  // Pagination handling for newest recipes
  const handleNewestPageChange = (page) => {
    setNewestCurrentPage(page);
  };

  // Slice recipes based on pagination
  const popularRecipes = filterAndSortRecipes(recipes, 'popular')
    .slice((popularCurrentPage - 1) * CardsPerPage, popularCurrentPage * CardsPerPage);

  const newRecipes = filterAndSortRecipes(recipes, 'new')
    .slice((newestCurrentPage - 1) * CardsPerPage, newestCurrentPage * CardsPerPage);

  return (
    <AppLayout isUserLoggedIn={!!user}>
      <Container>
        <div className="recipe-section">
          <h2 className='p-3'>Most Popular</h2>
          {popularRecipes.length > 0 && (
            <div className="recipe-list">
              <Row md={4} className="align-items-center">
                <Col md={11}>
                  <Row>
                    {popularRecipes.map(recipe => (
                      <Col key={recipe.id} md={3}>
                        <CardComponent {...recipe} />
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col md={1} className="d-flex justify-content-end">
                  {/* Pagination Links */}
                  <div>
                    {popularCurrentPage > 1 && (
                      <a href="#" className="next-link fs-2 me-3" onClick={() => setPopularCurrentPage(popularCurrentPage - 1)}>««</a>
                    )}
                    {popularCurrentPage < Math.ceil(recipes.length / CardsPerPage) && (
                      <a href="#" className="next-link fs-2" onClick={() => setPopularCurrentPage(popularCurrentPage + 1)}>»»</a>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
        <div className="recipe-section">
          <h2 className='p-3'>Newest</h2>
          {newRecipes.length > 0 && (
            <div className="recipe-list">
              <Row md={4} className="align-items-center">
                <Col md={11}>
                  <Row>
                    {newRecipes.map(recipe => (
                      <Col key={recipe.id} md={3}>
                        <CardComponent {...recipe} />
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col md={1} className="d-flex justify-content-end">
                  <div className="text-right">
                    {/* "<<" link */}
                    {newestCurrentPage > 1 && (
                      <a href="#" className="next-link fs-2" onClick={() => setNewestCurrentPage(newestCurrentPage - 1)}>««</a>
                    )}
                    {/* ">>" link */}
                    {newestCurrentPage < Math.ceil(recipes.length / CardsPerPage) && (
                      <a href="#" className="next-link fs-2" onClick={() => setNewestCurrentPage(newestCurrentPage + 1)}>»»</a>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default Home;
