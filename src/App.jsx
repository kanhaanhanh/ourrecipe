import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import CardList from "./views/cardList";
import { UserAuthContextProvider } from "./contexts/UserContext/UserContext";
import Signup from "./components/Login/Signup";
import UserProfile from "./components/Profile/Profile";
import RecipeCRUD from "./components/Add_Recipe/Add_Recipe";
import CardDetailComponent from "./views/cardDetail/cardDetail";
import { RecipeProvider } from "./contexts/RecipeContext/RecipeContext";
import Home from './views/Home';
import LikedRecipes from './views/Liked/likedRecipe';
import SavedRecipes from './views/Saved/saveRecipe';
import UserFollowingRecipes from './views/followed/UserFollowingRecipes';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    // Wrapping the entire application with RecipeProvider to provide recipe-related context data
    <RecipeProvider>
      {/* Wrapping the application with UserAuthContextProvider to provide user authentication context data */}
      <UserAuthContextProvider>
        {/* Setting up routing using React Router */}
        <Router>
          <Routes>
            {/* Route for the homepage */}
            <Route path="/" element={<Home />} />
            {/* Route for the login page */}
            <Route path="/login" element={<Login />} />
            {/* Route for the signup page */}
            <Route path="/signup" element={<Signup />} />
            {/* Route for the user profile page */}
            <Route path="/user-profile" element={<UserProfile/>} />
            <Route path="/My-Drive" element={<SavedRecipes/>} />
            <Route path="/favourite" element={<LikedRecipes/>} />
            {/* Route for adding a new recipe */}
            <Route path="/addRecipe" element={<RecipeCRUD/>} />
            {/* Route for displaying details of a specific recipe */}
            <Route path="/card-detail/:id" element={<CardDetailComponent/>} />
            <Route path="/followed" element={<UserFollowingRecipes/>} />
            <Route path="/bakery1" element={<CardList selectedCategory="Bread" />} />
            <Route path="/bakery2" element={<CardList selectedCategory="Cake" />} />
            <Route path="/bakery3" element={<CardList selectedCategory="Patry" />} />
            <Route path="/bakery4" element={<CardList selectedCategory="Cookie" />} />

            <Route path="/cuisine1" element={<CardList selectedCategory="Khmer Cuisine" />} />
            <Route path="/cuisine2" element={<CardList selectedCategory="Asian Cuisine" />} />
            <Route path="/cuisine3" element={<CardList selectedCategory="European Cuisine" />} />
            <Route path="/cuisine4" element={<CardList selectedCategory="American Cuisine" />} />
            <Route path="/cuisine5" element={<CardList selectedCategory="South American Cuisine" />} />

            <Route path="/health_1" element={<CardList selectedCategory="Vegetarian/Vegan" />} />
            <Route path="/health_2" element={<CardList selectedCategory="Low-Carb/Keto" />} />
            <Route path="/health_3" element={<CardList selectedCategory="Paleo" />} />
            <Route path="/health_4" element={<CardList selectedCategory="Dairy-Free" />} />
            <Route path="/health_5" element={<CardList selectedCategory="Heart-Healthy" />} />
            <Route path="/health_6" element={<CardList selectedCategory="Weight Management" />} />

            <Route path="/seasonal1" element={<CardList selectedCategory="Summer" />} />
            <Route path="/seasonal2" element={<CardList selectedCategory="Spring" />} />
            <Route path="/seasonal3" element={<CardList selectedCategory="Fall" />} />
            <Route path="/seasonal4" element={<CardList selectedCategory="Winter" />} />

            <Route path="/other" element={<CardList selectedCategory="Other" />} />
            <Route path="/followed" element={<CardList selectedCategory="Followed" />} />
          </Routes>
        </Router>
      </UserAuthContextProvider>
    </RecipeProvider>
  );
}

export default App;
