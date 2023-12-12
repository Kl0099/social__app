import { configureStore } from "@reduxjs/toolkit"
import {
  UserProfileReducer,
  allUsersReducer,
  postOfFollowingReducer,
  userPostsReducer,
  userReducer,
} from "./Reducers/User"
import { likeReducer, myPostsReducer } from "./Reducers/Post"
// const intitialState = {};
const store = configureStore({
  reducer: {
    user: userReducer,
    postofFollowing: postOfFollowingReducer,
    allUsers: allUsersReducer,
    like: likeReducer,
    myPosts: myPostsReducer,
    userProfile: UserProfileReducer,
    userPosts: userPostsReducer,
  },
})
export default store
