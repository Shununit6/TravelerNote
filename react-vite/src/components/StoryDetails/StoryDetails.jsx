import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { getStoryDetails} from '../../redux/stories';
import "./StoryDetails.css";
import DeleteModal from "../DeleteModal";
import DeleteStoryModal from "../DeleteStoryModal";
const StoryDetails = () => {
    const dispatch = useDispatch();
    let { storyId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);
    const storyData = useSelector((state) => state.stories[storyId]);

    useEffect(() => {
        dispatch(getStoryDetails(storyId)).then(()=>setIsLoaded(true))
    }, [dispatch, storyId])
    if(isLoaded && !storyData){
        return (<Navigate to="/stories"/>);
    }
    if(!isLoaded) {
        return (<div>Loading...</div>);
    }
    // const { id, user_id, place_id, title, description, article_url, shorts_url, created_at, updated_at} = storyData;
    const { title, user_id, description, article_url, shorts_url} = storyData;
    let isStoryCreator=false;
    if(sessionUser && storyData && user_id === sessionUser.id){
        isStoryCreator=true;
    }

    if(isLoaded){
        return(
            <div id="items">
                {/* <div id="items-2"></div> */}
                <div id="item1">
                    <Link to={"/stories"}> <p>Stories</p> </Link>
                </div>
                {/* <div id="item2">
                    <img id="images" src={imageUrl} alt="story"/>
                </div> */}
                <div id="item3">
                    <h1>{title}</h1>
                    <p>{description}</p>
                    <p>{article_url}</p>
                    <p>{shorts_url}</p>
                </div>
                    {sessionUser && isStoryCreator ?
                        <div id="item4" className="buttons-container">
                        <Link to={`/stories/${storyId}/edit`}>
                            <button id="updatestorydetails" >Update</button>
                        </Link>
                        <DeleteModal id="deletedstorydetails"
                                itemText="Delete"
                                modalComponent={<DeleteStoryModal story={storyData}/>}
                                />
                        </div>
                        : null}
            </div>
        );
    }

};

export default StoryDetails;
