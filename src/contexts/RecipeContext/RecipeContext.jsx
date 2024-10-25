import { createContext, useEffect, useContext, useState } from "react";

import { defaultCategoryRecipe, defaultSearchRecipe } from "../../utils/categoryData";
import { db } from "../../config/firebase"; // Import your Firestore instance
import { getDocs, doc, addDoc, setDoc, collection } from "firebase/firestore";
export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [category, setCategory] = useState(defaultCategoryRecipe);
  const [searchRecipe, setSearchRecipe] = useState(defaultSearchRecipe);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipeCount, setRecipeCount] = useState(0);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <RecipeContext.Provider
      value={{ category, setCategory, setRecipes, recipes, searchRecipe, setSearchRecipe, recipeCount }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

const useRecipeContext = () => useContext(RecipeContext);
export default useRecipeContext;
