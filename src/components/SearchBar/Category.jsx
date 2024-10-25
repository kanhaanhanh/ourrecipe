import { useState } from "react";
import { FormControl } from "react-bootstrap";
import useRecipeContext from "../../contexts/RecipeContext/RecipeContext";


export default function Category() {
    const [searchValue, setSearchValue] = useState("");
    const { setCategory } = useRecipeContext();
  
    const handleCategoty = (e) => {
      e.preventDefault();
      // Set the category based on the search value
      setCategory(searchValue.toLowerCase());
    };
  
    const handleInputChange = (e) => {
      setSearchValue(e.target.value);
    };
  
    return (
      <form className="input-group" onSubmit={handleCategoty}>
        <FormControl
          type="text"
          className="form-control search-bar"
          placeholder="Search Category"
          aria-label="Search Category"
          aria-describedby="basic-addon1"
          value={searchValue}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="input-group-text"
          id="basic-addon1"
          onClick={handleCategoty}
        >
          Search
        </button>
      </form>
    );
};
