import './ManageStories.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStories } from '../../redux/stories';
import StoryIndexItem from '../StoryIndexItem';
// import MenuLibrary from '../MenuLibrary';
import { getAllStoryimages } from '../../redux/storyimages';

const ManageStories = () => {
    const dispatch = useDispatch();
    const stories = useSelector((state) => Object.values(state.stories));
    const storyimages = useSelector((state)=>state.storyimages);
    const [isLoading, setIsLoading] = useState(true);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        if (sessionUser) {
            dispatch(getAllStories()).then(()=>dispatch(getAllStoryimages())).then(() => setIsLoading(false));
        }
    }, [dispatch, sessionUser]);

    if (isLoading) return <>Loading...</>;


    const storiesByUser = stories ? stories.filter(story => {
        return story.user_id === sessionUser?.id;
    }) : [];

    // console.log("storiesByUser:", storiesByUser);

    const hasStories = storiesByUser.length > 0;

    return (
        <div className='manageStorywrapper'>
            {/* <div className='manageStoryitem-1'>
                <MenuLibrary />
            </div> */}
            <div className='manageStoryitem-2'>
            <p className='title'>Manage My Stories</p>
            {!hasStories && <Link to={'/stories/new'}><button className='createStoryButton'>Create a New Story</button></Link>}
            {hasStories && <ul className='manageStoryIndex'>
                {storiesByUser.map((story) => (
                    <ul className='manageEachStory' key={String(story.id)}>
                        {story && <StoryIndexItem story={story} storyimages={storyimages}/>}
                    </ul>
                ))}
             </ul>}
            </div>
        </div>
    );
};

export default ManageStories;
