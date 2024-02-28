import axios from "axios";
const renderUrl = "https://socialmedia-aap.onrender.com";
const localurl = "http://localhost:4000";
export const loginUser = (email, password) => async (dispatch) => {
  try {
    console.log(email, password);
    dispatch({
      type: "LoginRequest",
    });

    const { data } = await axios.post(
      `${localurl}/api/v1/login`,
      { email, password },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", JSON.stringify(data.token));
    dispatch({
      type: "LoginSuccess",
      payload: data.user,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LoginFailure",
      payload: error.response.data.message,
    });
  }
};
export const LogoutUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LogoutRequest",
    });

    await axios.get(`${localurl}/api/v1/logout`, {
      withCredentials: true,
    });

    dispatch({
      type: "LogoutSuccess",
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: "LogoutFailure",
      payload: error.response.data.message,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });

    const { data } = await axios.get(`${localurl}/api/v1/me`, {
      withCredentials: true,
    });
    console.log(data);

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFailure",
      payload: error.response.data.message,
    });
  }
};

export const getFollowingPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: "postOfFollowingRequest",
    });

    const { data } = await axios.get(`${localurl}/api/v1/post`, {
      withCredentials: true,
    });
    dispatch({
      type: "postOfFollowingSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "postOfFollowingFailure",
      payload: error.response.data.message,
    });
  }
};
export const getMyPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: "myPostsRequest",
    });

    const { data } = await axios.get(`${localurl}/api/v1/my/posts`, {
      withCredentials: true,
    });
    dispatch({
      type: "myPostsSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "myPostsFailure",
      payload: error.response.data.message,
    });
  }
};

export const getAllusers =
  (name = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: "allUsersRequest",
      });

      const { data } = await axios.get(
        `${localurl}/api/v1/users?name=${name}`,
        { withCredentials: true }
      );
      dispatch({
        type: "allUsersSuccess",
        payload: data.users,
      });
    } catch (error) {
      dispatch({
        type: "allUsersFailure",
        payload: error.response.data.message,
      });
    }
  };

export const registerUser =
  (name, email, password, avatar) => async (dispatch) => {
    try {
      dispatch({
        type: "RegisterRequest",
      });

      const { data } = await axios.post(
        `${localurl}/api/v1/register`,
        { name, email, password, avatar },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "RegisterSuccess",
        payload: data.user,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "RegisterFailure",
        payload: error.response.data.message,
      });
    }
  };
export const updateProfile = (name, email, avatar) => async (dispatch) => {
  try {
    dispatch({
      type: "updateProfileRequest",
    });

    const { data } = await axios.put(
      `${localurl}/api/v1/update/profile`,
      { name, email, avatar },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "updateProfileSuccess",
      payload: data.message,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: "updateProfileFailure",
      payload: error.response.data.message,
    });
  }
};
export const deleteMyProfile = () => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProfileRequest",
    });

    const { data } = await axios.delete(`${localurl}/api/v1/delete/me`, {
      withCredentials: true,
    });
    dispatch({
      type: "deleteProfileSuccess",
      payload: data.message,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: "deleteProfileFailure",
      payload: error.response.data.message,
    });
  }
};

export const getUserProfile = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "UserProfileRequest",
    });

    const { data } = await axios.get(`${localurl}/api/v1/user/${id}`, {
      withCredentials: true,
    });
    dispatch({
      type: "UserProfileSuccess",

      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "UserProfileFailure",
      payload: error.response.data.message,
    });
  }
};
export const getUserPosts = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "userPostsRequest",
    });

    const { data } = await axios.get(`${localurl}/api/v1/userposts/${id}`, {
      withCredentials: true,
    });
    console.log("all posts : ", data);
    dispatch({
      type: "userPostsSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "userPostsFailure",
      payload: error.response.data.message,
    });
  }
};
export const followAndUnfollowUser = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "followUserRequest",
    });

    const { data } = await axios.get(`${localurl}/api/v1/follow/${id}`, {
      withCredentials: true,
    });
    dispatch({
      type: "followUserSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "followUserFailure",
      payload: error.response.data.message,
    });
  }
};
