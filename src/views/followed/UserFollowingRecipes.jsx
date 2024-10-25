import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useUserAuth } from '../../contexts/UserContext/UserContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import AppLayout from '../../Layout/AppLayout/AppLayout';
import CardComponent from '../../components/Card/HomeCard';
import '../cardList.scss';

const UserFollowingRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [followingRecipes, setFollowingRecipes] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchFollowingRecipes = async () => {
      try {
        // Fetch the users the current user is following
        const followingSnapshot = await getDocs(collection(db, `userinformation/${user.uid}/following`));
        const followingUserIds = followingSnapshot.docs.map(doc => doc.id);

        if (followingUserIds.length > 0) {
          // Fetch recipes from followed users, ordered by timestamp (newest first)
          const recipesQuery = query(
            collection(db, 'recipes'),
            where('userId', 'in', followingUserIds),
            orderBy('timestamp', 'desc')
          );
          const recipesSnapshot = await getDocs(recipesQuery);
          const recipesData = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setFollowingRecipes(recipesData);
        } else {
          setFollowingRecipes([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching following recipes:', error);
      }
    };

    if (user) {
      fetchFollowingRecipes();
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <AppLayout isUserLoggedIn={false}>
        <Container>
          <p>Please log in to view recipes from users you follow.</p>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout isUserLoggedIn={true}>
      <Container>
        <div className="recipe-section">
          <h2 className='p-3'>Recipes from Users You Follow</h2>
          {followingRecipes.length > 0 ? (
            <div className="recipe-list">
              <Row md={4} className="align-items-center">
                {followingRecipes.map(recipe => (
                  <Col key={recipe.id} md={3}>
                    <CardComponent {...recipe} />
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <p>No recipes found from users you follow.</p>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default UserFollowingRecipes;
