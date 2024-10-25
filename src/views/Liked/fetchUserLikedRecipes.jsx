import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const FetchUserLikedRecipes = async (userId) => {
  try {
    const likedRecipesQuery = query(collection(db, 'recipes'), where('likes', 'array-contains', userId));
    const likedRecipesSnapshot = await getDocs(likedRecipesQuery);
    const likedRecipesData = likedRecipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return likedRecipesData;
  } catch (error) {
    console.error('Error fetching liked recipes:', error);
    return [];
  }
};

export default FetchUserLikedRecipes;
