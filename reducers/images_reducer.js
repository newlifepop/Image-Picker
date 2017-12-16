import { PICK_IMAGE } from '../actions/types';

const INITIAL_STATE = {
    photos: []
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case PICK_IMAGE:
            return { photos: action.payload };
        default:
            return state;
    }
};