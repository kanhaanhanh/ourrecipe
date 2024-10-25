import { useState } from "react";
import { FormControl } from "react-bootstrap";
import searchIcon from "../../assets/search-button.png"; // Renamed the variable to searchIcon to better reflect its purpose
import useRecipeContext from "../../contexts/RecipeContext/RecipeContext";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { setSearchRecipe } = useRecipeContext();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchRecipe(searchValue.toLowerCase());
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <form className="input-group" onSubmit={handleSearch}>
      <FormControl
        type="text"
        className="form-control search-bar"
        placeholder="Search"
        aria-label="Search"
        aria-describedby="basic-addon1"
        value={searchValue}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        className="input-group-text"
        id="basic-addon1"
        onClick={handleSearch}
      >
        <img src={searchIcon} alt="Search Button" className="search-icon" /> {/* Updated the class name to match the CSS */}
      </button>
    </form>
  );
};

export default SearchBar;
