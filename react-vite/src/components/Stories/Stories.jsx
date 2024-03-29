import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllStories } from '../../redux/stories';
import StoryIndexItem from '../StoryIndexItem';
import "./Stories.css";
import { getAllStoryimages } from '../../redux/storyimages';

function Stories({num}) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const stories = useSelector((state) => state.stories);
    const storyimages = useSelector((state)=>state.storyimages);
    useEffect(()=>{
      dispatch(getAllStories()).then(()=>dispatch(getAllStoryimages())).then(()=>setIsLoaded(true))
    }, [dispatch]);

  if (!isLoaded) {
    return (<div>Loading...</div>);
  }
  // console.log(stories);
  if(isLoaded){
  return (
    <div id="storieslistgrid">
        {num ==2 && <h2>
          <Link id="storiesmainpage" to="/stories" > Stories </Link>
        </h2>}
        {num !=2 && <h2>
          <Link id="plansIsNotActive" to="/plans" > Plans </Link>
          <Link id="placesIsNotActive" to="/places" > Places </Link>
          <Link id="storiesIsActive" to="/stories" > Stories </Link>
        </h2>}
        {
          num==2 && <div id="viewallstories">
            {Object.values(stories).slice(0,2).map((story, index) => (
                  <StoryIndexItem story={story} storyimages={storyimages} key={index}/>
            ))}
          </div>
        }
        {
          num!=2 && <div id="viewallstories">
          {Object.values(stories).map((story, index) => (
                <StoryIndexItem story={story} storyimages={storyimages} key={index}/>
          ))}
          </div>
        }
    </div>
  );}
}

export default Stories;
