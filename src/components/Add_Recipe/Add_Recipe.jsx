import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../../contexts/UserContext/UserContext';
import Select from 'react-select';
import {
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, db } from '../../config/firebase';
import './Add_Recipe.scss'; // Import the CSS file\
import AppLayout from '../../Layout/AppLayout/AppLayout';

function RecipeCRUD() {
  const { user } = useUserAuth();
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    category: '',
    description: '',
    preparationTime: '',
    cookTime: '',
    ingredients: '',
    directions: '',
    images: [], // An array to store image URLs
  });
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateRecipeId, setUpdateRecipeId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from Firestore or any other source
        const categoriesData = [
          'Vegetarian/Vegan', 'Low-Carb/Keto', 'Paleo', 'Dairy-Free', 'Heart-Healthy', 'Weight Management',
          'Khmer Cuisine', 'Asian Cuisine', 'European Cuisine', 'American Cuisine', 'South American Cuisine',
          'Summer', 'Spring', 'Fall', 'Winter', 'Bread', 'Cake', 'Pastry', 'Cookie', 'Other'
        ]; // Dummy data for example
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (selectedOption) => {
    setNewRecipe({
      ...newRecipe,
      category: selectedOption ? selectedOption.value : '' // Set the category value in state
    });
  };

  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  const filteredOptions = categories.filter((option) =>
    option.toLowerCase().startsWith(inputValue.toLowerCase())
  ).map((category) => ({ label: category, value: category }));

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, 'recipes');
        const recipesSnapshot = await getDocs(recipesCollection);
        const recipesData = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching recipes:', error.message);
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const handleRecipeChange = (e) => {
    setNewRecipe({
      ...newRecipe,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    const imageUrls = [];

    for (const file of files) {
      const imageId = Date.now().toString();
      const storageRef = ref(storage, `recipe-images/${imageId}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      imageUrls.push(imageUrl);
    }

    setNewRecipe({
      ...newRecipe,
      images: imageUrls,
    });
  };

  const handleCreateRecipe = async () => {
    try {
      const userInformationDocRef = doc(db, 'userinformation', user.uid);
      const userInformationDocSnap = await getDoc(userInformationDocRef);

      if (!userInformationDocSnap.exists()) {
        console.error('User information not found for userId:', user.uid);
        return;
      }

      const userData = userInformationDocSnap.data();
      if (!userData.firstname || !userData.lastname) {
        console.error('Invalid user information.');
        return;
      }

      const newRecipeData = {
        ...newRecipe,
        userId: user.uid,
        authorFirstName: userData.firstname,
        authorLastName: userData.lastname,
        numLikes: 0,
        numComments: 0,
        timestamp: serverTimestamp(),
      };

      const recipesCollection = collection(db, 'recipes');
      const newRecipeRef = await addDoc(recipesCollection, newRecipeData);

      setRecipes([...recipes, { id: newRecipeRef.id, ...newRecipeData }]);
      setNewRecipe({
        title: '',
        category: '',
        description: '',
        preparationTime: '',
        cookTime: '',
        ingredients: '',
        directions: '',
        images: [],
      });
    } catch (error) {
      console.error('Error creating recipe:', error.message);
    }
  };

  const handleUpdateRecipe = async (recipeId) => {
    try {
      const recipeToUpdate = recipes.find((recipe) => recipe.id === recipeId);
      if (!recipeToUpdate) {
        console.error('Recipe not found for update.');
        return;
      }

      setUpdateRecipeId(recipeId);
      setNewRecipe(recipeToUpdate);
      setShowUpdateForm(true);
    } catch (error) {
      console.error('Error setting up recipe for update:', error.message);
    }
  };

  const handleSaveUpdateRecipe = async () => {
    try {
      const recipeDocRef = doc(db, 'recipes', updateRecipeId);
      await updateDoc(recipeDocRef, newRecipe);

      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === updateRecipeId ? { ...recipe, ...newRecipe } : recipe
      );

      setRecipes(updatedRecipes);
      setNewRecipe({
        title: '',
        category: '',
        description: '',
        preparationTime: '',
        cookTime: '',
        ingredients: '',
        directions: '',
        images: [],
      });
      setShowUpdateForm(false);
      setUpdateRecipeId(null);
    } catch (error) {
      console.error('Error updating recipe:', error.message);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');

      if (confirmDelete) {
        const recipeDocRef = doc(db, 'recipes', recipeId);
        const recipeDocSnap = await getDoc(recipeDocRef);
        const recipeData = recipeDocSnap.data();

        for (const imageUrl of recipeData.images) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }

        await deleteDoc(recipeDocRef);

        const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
        setRecipes(updatedRecipes);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error.message);
    }
  };

  return (
    <AppLayout isUserLoggedIn={user != null ? true : false}>
      <div className="container">
        <h2>Recipes</h2>
        <button className="create-button" onClick={() => setShowCreateForm((prevShow) => !prevShow)}>
          {showCreateForm ? 'Cancel' : 'Create New Recipe'}
        </button>
        {showCreateForm && (
          <div className="form-container">
            <h2>Create New Recipe</h2>
            <label>
              Title:
              <input type="text" name="title" value={newRecipe.title} onChange={handleRecipeChange} />
            </label>
            <label>
              Category:
              <Select
                onChange={handleCategoryChange}
                options={filteredOptions}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                placeholder="Search or select a category..."
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newRecipe.description}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Preparation Time:
              <input
                type="text"
                name="preparationTime"
                value={newRecipe.preparationTime}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Cook Time:
              <input type="text" name="cookTime" value={newRecipe.cookTime} onChange={handleRecipeChange} />
            </label>
            <label>
              Ingredients:
              <textarea
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Directions:
              <textarea
                name="directions"
                value={newRecipe.directions}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Images:
              <input type="file" name="images" onChange={handleImageChange} multiple />
            </label>
            <button className="create-button" onClick={handleCreateRecipe}>Create Recipe</button>
          </div>
        )}
        {showUpdateForm && (
          <div className="form-container">
            <h2>Update Recipe</h2>
            <label>
              Title:
              <input type="text" name="title" value={newRecipe.title} onChange={handleRecipeChange} />
            </label>
            <label>
              Category:
              <Select
                onChange={handleCategoryChange}
                options={filteredOptions}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                placeholder="Search or select a category..."
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newRecipe.description}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Preparation Time:
              <input
                type="text"
                name="preparationTime"
                value={newRecipe.preparationTime}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Cook Time:
              <input type="text" name="cookTime" value={newRecipe.cookTime} onChange={handleRecipeChange} />
            </label>
            <label>
              Ingredients:
              <textarea
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Directions:
              <textarea
                name="directions"
                value={newRecipe.directions}
                onChange={handleRecipeChange}
              />
            </label>
            <label>
              Images:
              <input type="file" name="images" onChange={handleImageChange} multiple />
            </label>
            <button className="update-button" onClick={handleSaveUpdateRecipe}>Update Recipe</button>
          </div>
        )}
        <table className="recipe-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Ingredients</th>
              <th>Directions</th>
              <th>Preparation Time</th>
              <th>Cook Time</th>
              <th>Images</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes
              .filter((recipe) => user && recipe.userId === user.uid)
              .map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.title}</td>
                  <td>{recipe.ingredients}</td>
                  <td>{recipe.directions}</td>
                  <td>{recipe.preparationTime}</td>
                  <td>{recipe.cookTime}</td>
                  <td className="recipe-images">
                    {recipe.images.map((imageUrl, index) => (
                      <img key={index} src={imageUrl} alt={`Image ${index + 1}`} />
                    ))}
                  </td>
                  <td>{recipe.category}</td>
                  <td>
                    <button className="update-button" onClick={() => handleUpdateRecipe(recipe.id)}>Update</button>
                    <button className="delete-button" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

export default RecipeCRUD;
