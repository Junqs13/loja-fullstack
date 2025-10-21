import { THEME_CHANGE } from '../constants/themeConstants';

export const changeTheme = (theme) => (dispatch) => {
    localStorage.setItem('theme', theme);
    dispatch({
        type: THEME_CHANGE,
        payload: theme,
    });
};