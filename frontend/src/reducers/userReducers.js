import {
    USER_SIGNIN_FAIL,
    USER_SIGNIN_REQUEST,
    USER_SIGNIN_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_SIGNOUT,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_RESET,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_DELETE_RESET,
    USER_PROFILE_RESET,
    USER_ADMIN_UPDATE_REQUEST,
    USER_ADMIN_UPDATE_SUCCESS,
    USER_ADMIN_UPDATE_FAIL,
    USER_ADMIN_UPDATE_RESET,
    USER_REVIEW_REQUEST,
    USER_REVIEW_SUCCESS,
    USER_REVIEW_FAIL,
    USER_REVIEW_RESET,
    USER_SHIPPING_ADDRESS
} from "../constanst/userConstants";

export const userSigninReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_SIGNIN_REQUEST:
            return { loading: true }
        case USER_SIGNIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_SIGNIN_FAIL:
            return { loading: false, error: action.payload }
        case USER_SIGNOUT:
            return {}
        default:
            return state;
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}

export const userProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { loading: true }
        case USER_PROFILE_SUCCESS:
            return { loading: false, user: action.payload }
        case USER_PROFILE_FAIL:
            return { loading: false, error: action.payload }
        case USER_PROFILE_RESET:
            return {}
        default:
            return state;
    }
}

export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true }
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true, user: action.payload }
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case USER_UPDATE_RESET:
            return {}
        default:
            return state;
    }
}

export const userListReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true }
        case USER_LIST_SUCCESS:
            return { loading: false, users: action.payload }
        case USER_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}

export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true }
        case USER_DELETE_SUCCESS:
            return { loading: false, success: true, message: action.payload }
        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload }
        case USER_DELETE_RESET:
            return {}
        default:
            return state;
    }
}

export const userAdminUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_ADMIN_UPDATE_REQUEST:
            return { loading: true }
        case USER_ADMIN_UPDATE_SUCCESS:
            return { loading: false, success: true, user: action.payload }
        case USER_ADMIN_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case USER_ADMIN_UPDATE_RESET:
            return {}
        default:
            return state;
    }
}

export const userReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REVIEW_REQUEST:
            return { loading: true }
        case USER_REVIEW_SUCCESS:
            return { loading: false, success: true, user: action.payload }
        case USER_REVIEW_FAIL:
            return { loading: false, error: action.payload }
        case USER_REVIEW_RESET:
            return {}
        default:
            return state;
    }
}

export const userShippingAddressReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_SHIPPING_ADDRESS:
            return { ...state, mapShippingAddress: action.payload }
        default:
            return state;
    }
}