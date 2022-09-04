import React from "react";

const UPDATE_SELECTED_CATEGORY = "UPDATE_SELECTED_CATEGORY";
const ADD_PRODUCTS = "ADD_PRODUCTS";
const ADD_CATEGORIES = "ADD_CATEGORIES";
const ADD_TO_CART = "ADD_TO_CART"
const REMOVE_FROM_CART = "REMOVE_FROM_CART"
const ACTION = {
    UPDATE_SELECTED_CATEGORY,
    ADD_PRODUCTS,
    ADD_CATEGORIES,
    ADD_TO_CART ,
    REMOVE_FROM_CART

}

const initialState = {
    products: [],
    categories: [],
    cart : []
}



function reducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case ACTION.UPDATE_SELECTED_CATEGORY:
            {
                return { ...state, selectedCategory: payload }
            }
        case ACTION.ADD_PRODUCTS: {
            return { ...state, products: payload }
        }
        case ACTION.ADD_CATEGORIES: {
            return { ...state, categories: payload }
        }
        case ACTION.ADD_TO_CART : {
            const {product: {id}} = payload

            const index = state.cart.findIndex(item => item.product.id === id)
            if (index > -1){
                const clonedItems = structuredClone(state.cart)
                clonedItems[index].quantity +=1
                return { ...state,cart : [...clonedItems]}



            }
            else {
                return { ...state,cart : [...state.cart,{...payload,quantity:1}]}
            }
        }
        case ACTION.REMOVE_FROM_CART : {
            const {product: {id}} = payload

            const index = state.cart.findIndex(item => item.product.id === id)
            if (index > -1){
                const clonedItems = structuredClone(state.cart)
                const reducedQuantity = clonedItems[index].quantity -1
                reducedQuantity ? clonedItems.splice(index,1,{...clonedItems[index],quantity : reducedQuantity}) : clonedItems.splice(index,1)
                return { ...state,cart : [...clonedItems]}
            }
            else {
                return { ...state,cart : [...state.cart,{...payload,quantity:1}]}
            }
        }
    }

    return state
}

const StateContext = React.createContext();
const StateProvider = ({ children }) => {
    const reducerContext = React.useReducer(reducer, initialState);
    // 1. state variable => initialState;
    // 2. dispatch function => dispatch actions
    return <StateContext.Provider value={reducerContext}>
        {children}
    </StateContext.Provider>
}
// custom hooks
const useSelector = (fn) => fn(React.useContext(StateContext)[0]);
const useDispatch = () => React.useContext(StateContext)[1]

export { StateProvider, useSelector, useDispatch, ACTION }