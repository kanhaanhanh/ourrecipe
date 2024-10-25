import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import CardComponent from '../components/Card/HomeCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import './cardList.scss';
import AppLayout from '../Layout/AppLayout/AppLayout';
import { useUserAuth } from '../contexts/UserContext/UserContext';
import { RecipeContext } from '../contexts/RecipeContext/RecipeContext';

const CardsPerPage = 8;

const CardList = ({selectedCategory}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const { recipes, searchRecipe } = useContext(RecipeContext);

  useEffect(() => {
    // If recipes are not loaded yet, set loading to true
    if (recipes.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [recipes]);

  // Filter recipes based on search keyword and selected category
  const filteredRecipes = recipes.filter(recipe => {
    const titleMatch = recipe.title.toLowerCase().includes(searchRecipe.toLowerCase());
    const categoryMatch = !selectedCategory || recipe.category === selectedCategory;
    return titleMatch && categoryMatch;
  });

  // Calculate the index range for the current page
  const indexOfLastCard = currentPage * CardsPerPage;
  const indexOfFirstCard = indexOfLastCard - CardsPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstCard, indexOfLastCard);

  // Change page
  const handlePageChange = (page) => {
    console.log('Page changed to:', page);
    setCurrentPage(page);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredRecipes.length / CardsPerPage);

  // Render loading state if recipes are still being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render the actual content once loading is complete
  return (
    <>
      <AppLayout isUserLoggedIn={user != null ? true : false}>
        <Container>
          <Row>
            {currentRecipes.map((recipe) => (
              <Col key={recipe.id} md={3}>
                <CardComponent {...recipe} />
              </Col>
            ))}
          </Row>
          <Row className="pagination-center">
            <Col>
              <Pagination className='text-center'>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Col>
          </Row>
        </Container>
      </AppLayout>
    </>
  );
};

export default CardList;
