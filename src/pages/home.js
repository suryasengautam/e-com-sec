import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { ACTION, useDispatch, useSelector } from '../store';
import "./home.css"
import {StarRating} from "../component/star-rating"

function Home() {
    const [searchParams,] = useSearchParams();
    const selectedCategory = searchParams.get("category");
    const searchTerm = searchParams.get("searchterm");
    const dispatch = useDispatch();
    const products = useSelector(state => state.products);

    let filteredProducts = selectedCategory ? products.filter(prod => prod.category === selectedCategory) : products;
    filteredProducts = searchTerm ? filteredProducts.filter(prod => prod.title.toLowerCase().includes(searchTerm.toLowerCase())) : filteredProducts;
    const filteredCategories = Array.from(new Set(filteredProducts?.map(prod => prod.category)));

    async function fetchAllProducts() {

        const result = await fetch('https://fakestoreapi.com/products');
        dispatch({ type: ACTION.ADD_PRODUCTS, payload: await result.json() });
    }
    if (!products?.length) {
        fetchAllProducts()
    }

    return (<div>
        {filteredCategories?.length ? filteredCategories?.map(category => (<Category key={category} title={category}>
            {filteredProducts.filter(prod => prod.category === category)?.map(prod => <Product key={prod.id} product={prod} />)}
        </Category>)) : "No Products Found"}
    </div>
    )
}

// const StarRating = ({ rating }) => Array(Math.round(rating)).fill(0).map(rating => <span>⭐️</span>)

function Category({ title, children }) {
    return <div className="category">
        <h2 className='category__title'>{title}</h2>
        <div className='category__row'>{children}</div>
    </div>
}

function Product({ product }) {
    const { image, title, rating, price } = product;
    const dispatch = useDispatch()
    const addProductToCart =  () => {
        dispatch({type : ACTION.ADD_TO_CART,payload : {product}})

    }
    return (<div className='product'>
        <img src={image} alt={title} loading="lazy" />
        <div className='product__info'>

            <h3 className='product__title lineclamp'>{title}</h3>
            {/* <p><StarRating rating={rating.rate} /> out of {rating.count} ratings</p> */}
            <StarRating rating = {rating}/>
            <p>
                <strong>$</strong> {price}
            </p>
            <p className='product__add' onClick={addProductToCart}>
                <button>Add to cart</button>
            </p>
        </div>
    </div>)
}

export default Home