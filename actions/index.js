import { PICK_IMAGE } from './types';

export const pickImage = (uriArray) => {
    return {
        type: PICK_IMAGE,
        payload: uriArray
    };
};