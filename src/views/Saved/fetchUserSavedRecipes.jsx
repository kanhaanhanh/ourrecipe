import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const FetchUserSavedRecipes = async (userId) => {
  try {
    const recipeQuery = query(collection(db, 'recipes'));
    const recipeSnapshot = await getDocs(recipeQuery);
    const savedRecipesData = recipeSnapshot.docs
      .filter((doc) => {
        if (doc.data() && Array.isArray(doc.data().saved) && doc.data().saved.includes(userId)) {
          return true;
        }
        return false;
      })
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return savedRecipesData;
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    return [];
  }
};

export default FetchUserSavedRecipes;
