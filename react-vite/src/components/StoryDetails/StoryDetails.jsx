import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { getStoryDetails} from '../../redux/stories';
import { getAllLikes, getStoryLikes } from "../../redux/likes";
import "./StoryDetails.css";
import DeleteModal from "../DeleteModal";
import DeleteStoryModal from "../DeleteStoryModal";
import LikeStory from "../LikeStory";
import { getStoryimageDetails } from '../../redux/storyimages';
import noImg from '../../images/noimage.png';
// import DeleteImageModal from "../DeleteImageModal";
import StoryForm from "../StoryForm/StoryForm";
import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
import loading from '../../../src/images/loading.mp4';

const StoryDetails = () => {
    const dispatch = useDispatch();
    let { storyId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);
    const storyData = useSelector((state) => state.stories[storyId]);
    const storyimageData = useSelector((state) => state.storyimages.storyImage);

    // useEffect(() => {
    //     dispatch(getStoryDetails(storyId)).then(()=>setIsLoaded(true))
    // }, [dispatch, storyId])
    useEffect(() => {
        dispatch(getStoryDetails(storyId)).then(()=>dispatch(getAllLikes()))
        .then(()=>dispatch(getStoryLikes(storyId))).then(()=>dispatch(getStoryimageDetails(storyId))).then(() => setIsLoaded(true));
      }, [dispatch, storyId]);
    if(isLoaded && !storyData){
        return (<Navigate to="/stories"/>);
    }
    if (!isLoaded) {
        return (
        <div className="loadingcontainer">
            <div className='loadingmp4'><video autoPlay><source src={loading} type="video/mp4"></source></video></div>
        </div>
        );
    }
    // const { id, user_id, place_id, title, description, article_url, shorts_url, created_at, updated_at} = storyData;
    const { title, user_id, description, article_url, shorts_url} = storyData;

    let isStoryCreator=false;
    if(sessionUser && storyData && user_id === sessionUser.id){
        isStoryCreator=true;
    }

    let storyimageurl = Object.values(storyimageData);
    if(!storyimageurl || !storyimageurl.length){
        storyimageurl = noImg;
    }

    if(isLoaded){
        return(
            <div id="items">
                {/* <div id="items-2"></div> */}
                <div id="item1">
                    <Link id="storytext" to={"/stories"}> <p>Stories</p> </Link>
                </div>
                {/* <div id="item2">
                    <img id="images" src={imageUrl} alt="story"/>
                </div> */}
                <div id="item2">
                {storyimageurl == noImg && <img id="nostoryimages" src={storyimageurl} alt="storyimage" key="noimg"/>}
                {storyimageurl != noImg && storyimageurl.length == 1 && (storyimageurl).map((image, index) => (
                  <img className={`storyimageitem${index}`} src={image.image_url} alt="storyimage" key={index}/>
                ))}
                {storyimageurl != noImg && storyimageurl.length > 1 &&
                <Carousel useKeyboardArrows={true}>
                    {storyimageurl.map((URL, index) => (
                    <div className="slide" key={index}>
                        <img className={`storyimageitem${index}`} alt="storyimages" src={URL.image_url} key={index} />
                    </div>
                    ))}
                </Carousel>}
                </div>
                <div id="item3">
                    <h1>{title}</h1>
                    {sessionUser && <LikeStory userId={user_id} storyId={storyId}/>}
                    <p>{description}</p>
                    {/* <p>{article_url}</p> */}
                    <a target='_blank' rel='noopener noreferrer' href={article_url}>Read Original Content</a>
                    <p>Available URL of Shorts: {shorts_url}</p>
                </div>
                    {sessionUser && isStoryCreator ?
                        <div id="item4" className="buttons-container">
                        {/* <Link to={`/stories/${storyId}/edit`}>
                            <button id="updatestorydetails" >Update My Story</button>
                        </Link> */}
                        <div className="updatestorybutton"><DeleteModal id="updatestorydetails"
                                    itemText="Update Story"
                                    modalComponent={<StoryForm formType="Update Story" story={storyData}/>}
                                    />
                        </div>
                        <div className="deletestorybutton">
                        <DeleteModal id="deletedstorydetails"
                                itemText="Delete Story"
                                modalComponent={<DeleteStoryModal story={storyData}/>}
                                />
                        </div>
                        </div>
                        : null}
                    {/* {sessionUser && <LikeStory userId={user_id} storyId={storyId}/>} */}
            </div>
        );
    }

};

export default StoryDetails;
