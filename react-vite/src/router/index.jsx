import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Home from '../components/Home';
import HomePixel from '../components/Home/HomePixel';
import Plans from '../components/Plans';
import Layout from './Layout';
import PlanDetails from '../components/PlanDetails';
import EditPlanForm from '../components/EditPlanForm';
import CreatePlanForm from '../components/CreatePlanForm';
import ManagePlans from '../components/ManagePlans/ManagePlans';
import Places from '../components/Places/Places';
import EditPlaceForm from '../components/EditPlaceForm';
import CreatePlaceForm from '../components/CreatePlaceForm';
import PlaceDetails from '../components/PlaceDetails';
import ManagePlaces from '../components/ManagePlaces/ManagePlaces';
import Stories from '../components/Stories';
import StoryDetails from '../components/StoryDetails';
import EditStoryForm from '../components/EditStoryForm';
import CreateStoryForm from '../components/CreateStoryForm';
import ManageStories from '../components/ManageStories';
// import FrontPage from '../components/FrontPage/FrontPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "plans/new",
        element: <CreatePlanForm />,
      },
      {
        path: "places/new",
        element: <CreatePlaceForm />,
      },
      {
        path: "stories/new",
        element: <CreateStoryForm />,
      },
      {
        path: "plans/current",
        element: <ManagePlans />,
      },
      {
        path: "places/current",
        element: <ManagePlaces />,
      },
      {
        path: "stories/current",
        element: <ManageStories />,
      },
      {
        path: "plans/:planId/edit",
        element: <EditPlanForm />,
      },
      {
        path: "places/:placeId/edit",
        element: <EditPlaceForm />,
      },
      {
        path: "stories/:storyId/edit",
        element: <EditStoryForm />,
      },
      {
        path: "plans/:planId",
        element: <PlanDetails />,
      },
      {
        path: "places/:placeId",
        element: <PlaceDetails />,
      },
      {
        path: "stories/:storyId",
        element: <StoryDetails />,
      },
      {
        path: "plans",
        element: <Plans />,
      },
      {
        path: "places",
        element: <Places />,
      },
      {
        path: "stories",
        element: <Stories />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/preview/pixel",
        element: <HomePixel />,
      },
      // {
      //   path: "/",
      //   element: <FrontPage />,
      // },
    ],
  },
]);
