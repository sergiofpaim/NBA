import { Season } from '../models/Season';
import { useApi } from '../utils/UtilContext';

export const LOAD_SEASONS = 'LOAD_SEASONS';
export const LOAD_SEASONS_SUCCESS = 'LOAD_SEASONS_SUCCESS';
export const LOAD_SEASONS_FAILURE = 'LOAD_SEASONS_FAILURE';

const initialState = {
    seasons: [],
    loading: false,
    error: null,
};

export const loadSeasons = () => async (dispatch: any) => {

    const api = useApi();

    dispatch({ type: LOAD_SEASONS });

    const response = await api.get<Array<Season>>(`/transaction/seasons`);

    if (response.Code === 200) {
        dispatch({ type: LOAD_SEASONS_SUCCESS, payload: response.PayLoad });
    } else {
        dispatch({ type: LOAD_SEASONS_FAILURE, payload: response.Message });
    }
};

export default function seasonReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_SEASONS:
            return { ...state, loading: true };
        case LOAD_SEASONS_SUCCESS:
            return { ...state, loading: false, seasons: action.payload };
        case LOAD_SEASONS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

