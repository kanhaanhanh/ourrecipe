export const defaultCategoryRecipe = "all";
export const defaultSearchRecipe = "all";
export const categoryData = (
  recipes,
  recipeCategory = defaultCategoryRecipe,
  searchRecipe = defaultSearchRecipe
) => {
  if (recipeCategory !== "all") { // process of category search
    return recipes.filter((recipe) =>
      recipe.category.toLowerCase().includes(recipeCategory.toLowerCase())
    );
  } else if (searchRecipe !== "all") { // process of tittle search
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
    );
  } else {
    return recipes;
  }
};

export default categoryData;
