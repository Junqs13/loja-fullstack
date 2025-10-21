import { THEME_CHANGE } from '../constants/themeConstants';

export const themeReducer = (state = { theme: 'light' }, action) => {
    switch (action.type) {
        case THEME_CHANGE:
            return { theme: action.payload };
        default:
            return state;
    }
};