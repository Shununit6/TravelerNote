import './ManagePlaces.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaces } from '../../redux/places';
import PlaceIndexItem from '../PlaceIndexItem';
// import MenuLibrary from '../MenuLibrary';
import { getAllPlaceimages } from '../../redux/placeimages';
import loading from '../../../src/images/loading.mp4';

const ManagePlaces = () => {
    const dispatch = useDispatch();
    const places = useSelector((state) => Object.values(state.places));
    const placeimages = useSelector((state)=>state.placeimages);
    const [isLoading, setIsLoading] = useState(true);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        if (sessionUser) {
            dispatch(getAllPlaces()).then(()=>dispatch(getAllPlaceimages())).then(() => setIsLoading(false));
        }
    }, [dispatch, sessionUser]);

    if (isLoading) {
        return (
          <div className="loadingcontainer">
            <div className='loadingmp4'><video autoPlay><source src={loading} type="video/mp4"></source></video></div>
          </div>
        );
    }


    const placesByUser = places ? places.filter(place => {
        return place.user_id === sessionUser?.id;
    }) : [];

    // console.log("placesByUser:", placesByUser);

    const hasPlaces = placesByUser.length > 0;

    return (
        <div className='managePlacewrapper'>
            <div className='managePlaceitem-1'>
                <h1 className='title'>My Places</h1>
                <Link id="plansIsNotActive" to="/plans/current" > My Plans </Link>
                <Link id="placesIsActive" to="/places/current" > My Places </Link>
                <Link id="storiesIsNotActive" to="/stories/current" > My Stories </Link><br></br>
            </div>
            <div className='managePlaceitem-2'>
            {!hasPlaces && <Link to={'/places/new'}><button className='createPlaceButton'>Create a New Place</button></Link>}
            {hasPlaces && <div className='managePlaceIndex'>
                {placesByUser.map((place) => (
                    <div className='manageEachPlace' key={String(place.id)}>
                        {place && <PlaceIndexItem place={place} placeimages={placeimages}/>}
                    </div>
                ))}
                <Link to={'/places/new'}><button className='createPlaceButton1'>Create a New Place</button></Link>
             </div>}
            </div>
        </div>
    );
};

export default ManagePlaces;
