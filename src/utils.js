export function getItemCount(cart){
    return cart.reduce((sum,cartItem) => cartItem.quantity + sum , 0)
}
export function getSubtotal(cart){
    return cart.reduce((sum,{product,quantity}) => product.price*quantity + sum,0)
}