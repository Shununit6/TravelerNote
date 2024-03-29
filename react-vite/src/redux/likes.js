// /** Action Type Constants: */
export const LOAD_LIKES = "likes/LOAD_LIKES";
export const LOAD_STORY_LIKES = "likes/LOAD_STORY_LIKES";
export const RECEIVE_LIKE = "likes/RECEIVE_LIKE";
export const REMOVE_LIKE = "likes/REMOVE_LIKE";

// /**  Action Creators: */
export const loadLikes = (likes) => ({
    type: LOAD_LIKES,
    likes,
});

export const loadStoryLikes = (likes) => ({
    type: LOAD_STORY_LIKES,
    likes,
});

export const receiveLike = (like) => ({
    type: RECEIVE_LIKE,
    like,
});

export const removeLike = (like) => ({
    type: REMOVE_LIKE,
    like,
});

// /** Thunk Action Creators: */
export const getAllLikes = () => async (dispatch) => {
    const res = await fetch(`/api/stories/likes`);

    if (res.ok) {
        const data = await res.json();
        // console.log("data", data);
        dispatch(loadLikes(data));
        return data;
    }
    return res;
};

export const getStoryLikes = (storyId) => async (dispatch) => {
    const res = await fetch(`/api/stories/${storyId}/likes`);

    if (res.ok) {
        const data = await res.json();
        // console.log("likedata", data);
        dispatch(loadStoryLikes(data));
        return data;
    }
    return res;
};


export const createLike = (payload, storyId) => async (dispatch) => {
    const res = await fetch(`/api/stories/${storyId}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(receiveLike(data));
        return data;
    }
    return res;
};

export const deleteLike = (likeId, storyId) => async (dispatch) => {
    const res = await fetch(`/api/stories/${storyId}/likes`, {
        method: "DELETE",
    });

    if (res.ok) {
        const data = await res.json();
        // console.log("likeIddletelike", data);
        dispatch(removeLike(data.id));
        return data;
    }
    return res;
};

const likesReducer = (state = { }, action) => {
    switch (action.type) {
        case LOAD_LIKES:{
            const likesState = {...state}
            action.likes.likes.forEach((like) => {
                if(!likesState[like.id]) {likesState[like.id] = like;}
            });
            return {...likesState}}
        case LOAD_STORY_LIKES:{
            return { ...state, ...action.likes }
        }
        case RECEIVE_LIKE:{
            // console.log("actionhereisthe", action)
            // console.log("actionhereisthe", action.like.id)
            // console.log("state", {...state})
            return { ...state, [action.like.id]: action.like}}
        case REMOVE_LIKE:{
            // console.log("deleteaction", action)
            // console.log("deleteactionhereisthe", action)
            // console.log("deleteactionhereisthe", action.like.id)
            const likeState = { ...state, ...action.likes};
            // console.log("state", likeState)
            // console.log("statelikeState[likes]", likeState.likes)
            // console.log("statelikeState[likes]", likeState.likes[0].id)
            delete likeState[action.like];
            return likeState;
        }
        default:
            return state;
    }
};

export default likesReducer;
