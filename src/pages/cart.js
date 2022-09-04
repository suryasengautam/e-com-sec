import React from 'react'
import "./cart.css";
import {ACTION, useDispatch, useSelector} from '../store'
import { StarRating } from '../component/star-rating';
import { getSubtotal } from '../utils';

function Cart() {
  const cartItems = useSelector(state => state.cart)
  // const itemCount = getItemCount(cartItems)
  const  subTotal = getSubtotal(cartItems)
  const dispatch = useDispatch()
  const handleQuantityChange = (e,{product,quantity}) => {
    const updatedQuantity = (e.target.value)
    console.log(updatedQuantity);
    if (updatedQuantity<quantity){
      //reducing quantity
      dispatch({type : ACTION.REMOVE_FROM_CART, payload : {product} })

    }
    else {
      dispatch({type : ACTION.ADD_TO_CART , payload : {product}})
    }
 

  }

  return (
    <div className='cart'>
      <section className='cart__items'>
       <h2> shopping cart </h2>
       {cartItems?.map(({product,quantity}) => {
        const {title,price,rating,image,id} = product
        return (
          <>
        <div className='cart__item'>
          <section>
            <img loading='lazy' src={image}/>
          </section>
          <section>
            <h3>{title}</h3>
            <StarRating rating = {rating}/>
            <div>
            <label htmlFor={`$quantity_{id}`}>qty</label>
            <input min={0} max={10} type="number" name={`$quantity_{id}`} id={`$quantity_{id}`} value={quantity} onChange={(e) => handleQuantityChange(e, { product, quantity })} />
            </div>
          </section>
          <section className='cart__items__price'>
            <small>$</small><strong>{getSubtotal([{product,quantity}])}</strong>
          </section>
        </div>
        <hr/>
        </>)
       })}
        </section>
      <section className='cart__subtotal'>
        <h2>Subtotal</h2>
        {subTotal}
      </section>

    </div>
  )
}

export default Cart