import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import likesReducer from './likes';
import plansReducer from './plans';
import placesReducer from "./places";
import storiesReducer from "./stories";
import expensesReducer from "./expenses";
import placeimagesReducer from "./placeimages";
import storyimagesReducer from "./storyimages";

const rootReducer = combineReducers({
  session: sessionReducer,
  plans: plansReducer,
  places: placesReducer,
  stories: storiesReducer,
  expenses: expensesReducer,
  placeimages: placeimagesReducer,
  storyimages: storyimagesReducer,
  likes: likesReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
