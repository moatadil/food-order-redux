import { useState } from 'react'
import useHttp from '../../hooks/use-http'
import Modal from '../UI/Modal';
import classes from './Cart.module.css';
import CartItem from './CartItem';
import Checkout from './Checkout';
import { cartAction } from '../../store/cartSlice'
import { useSelector, useDispatch } from 'react-redux';

const Cart = (props) => {
  const [showCheckout, setShowCheckout] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const { error, isLoading, sendRequest: fetchData } = useHttp()
  const dispatch = useDispatch()
  const items = useSelector(state => state.cart.items)
  let totalAmount = useSelector(state => state.cart.totalAmount)

  totalAmount = `$${totalAmount.toFixed(2)}`
  const hasItems = items.length > 0
  const cartItemAddHandler = item => {
    dispatch(cartAction.addItem({ ...item, amount: 1 }))
  }
  const showCheckoutHandler = () => {
    setShowCheckout(true)
  }
  const cartItemRemoveHandler = id => {
    dispatch(cartAction.removeItem(id))
  }
  const cartItems = (
    <ul className={ classes['cart-items'] }>
      { items.map((item) => (
        <CartItem key={ item.id } name={ item.name } amount={ item.amount } price={ item.price }
          onAdd={ cartItemAddHandler.bind(null, item) }
          onRemove={ cartItemRemoveHandler.bind(null, item.id) }
        />
      )) }
    </ul>
  );
  const submitOrderHandler = userData => {
    const data = {
      user: userData,
      orderItems: items
    }
    fetchData({
      url: 'https://react-test-6108b-default-rtdb.firebaseio.com/orders.json',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }, () => {
      setIsSubmit(true)
      dispatch(cartAction.Clear())
    })
  }
  const ModalData = () => {
    if (isLoading)
      return <p>Loading...</p>
    if (error)
      return <div>{ error }</div>
    if (!isLoading && !error && !isSubmit) {
      return <>
        { cartItems }
        <div className={ classes.total }>
          <span>Total Amount</span>
          <span>{ totalAmount }</span>
        </div>
        { showCheckout && <Checkout onSubmit={ submitOrderHandler } onCancel={ props.onClose } /> }
        { !showCheckout &&
          <div className={ classes.actions }>
            <button className={ classes['button--alt'] } onClick={ props.onClose }>Close</button>
            { hasItems && <button onClick={ showCheckoutHandler } className={ classes.button }>Order</button> }
          </div>
        }
      </>
    }
    if (isSubmit) {

      return <>
        <p>the order is submitted</p>
        <div className={ classes.actions }>
          <button className={ classes.button } onClick={ props.onClose }>Close</button>
        </div>
      </>
    }
  }
  return (
    <Modal onClose={ props.onClose }>
      { ModalData() }
    </Modal>
  );
};

export default Cart;
