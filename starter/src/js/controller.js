import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// import icons from '../img/icons.svg'; // Parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//*** Browsers don't understand sass - parcel will make it readable */

// Steps //
// 1. npm init - start project by creating json file
// 2. npm i parcel@next -D - install parcel as dev dependency
// 3. npm run start - start parcel

console.log('Test');

///////////////////////////////////////////////////////////////////////////////////////
// 288. Loading a Recipe from API
///////////////////////////////////////////////////////////////////////////////////////

// Jonas' prorpietory API
// https://forkify-api.herokuapp.com/v2

// GET RECIPE API
// https://forkify-api.herokuapp.com/api/v2/recipes/:id
// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //1) Loading Recipe
    await model.loadRecipe(id);

    //2) Rendering Recipe
    // The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);

    //1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search results
    await model.loadSearchResults(query);

    //3) Render results
    resultsView.render(model.getSearchResultsPage(1));

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  //1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render new pagination buttons
  paginationView.render(model.state.search);
};

// controlSearchResults();

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();

///////////////////////////////////////////////////////////////////////////////////////
// 289. Rendering the Recipe
///////////////////////////////////////////////////////////////////////////////////////
//1) Go to html to get the right elements - the recipe class
//  > there is the message
//  > spinner

///////////////////////////////////////////////////////////////////////////////////////
// 290. Listening for load and hashchange Events
///////////////////////////////////////////////////////////////////////////////////////
