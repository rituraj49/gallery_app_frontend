import { createContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const authenticated = user !== null && token !== null;

const initialState = {
    isAuth: authenticated,
    user: user,
    userToken: token,
    loading: true,
    userMedia: [],
    totalRecords: 0,
    lastPage: 0
};

const addUserToLocalStorage = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
}

const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

const authenticateUser = (state, action) => {
    // console.log('auth user action:', action.payload)
    if(action.type === 'LOGIN') {
        addUserToLocalStorage(action.payload.user, action.payload.access_token);
        return {
            ...state,
            isAuth: true,
            user: action.payload.user,
            userToken: action.payload.access_token,
            // loading: true
        }
    }

    if (action.type === 'LOGOUT') {
        removeUserFromLocalStorage();
        return {
            ...state,
            isAuth: false,
            user: null,
            userToken: null,
            // loading: false
            userMedia: []
        }
    }

    if(action.type === 'STORE_USER_MEDIA') {
        console.log('files in reducer:', action.payload)
        console.log('state media in reducer:', state.userMedia)
        const existingFileIds = new Set(state.userMedia.map(file => file._id));
        const newFiles = action.payload.files.filter(file => !existingFileIds.has(file._id));
        
        return {
            ...state,
            // userMedia: [...state.userMedia, ...newFiles],
            userMedia: action.payload.files,
            totalRecords: action.payload.totalRecords,
            lastPage: action.payload.lastPage
        }
    }

    if(action.type === 'DELETE_USER_FILE') {
        return {
            ...state,
            userMedia: state.userMedia.filter(file => file._id !== action.payload.fileId)
        }
    }
    return state;
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authenticateUser, initialState);

    return (
        <AuthContext.Provider value={{
            state,
            dispatch
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;