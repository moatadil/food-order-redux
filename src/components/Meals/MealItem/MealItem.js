import MealItemForm from './MealItemForm';
import classes from './MealItem.module.css';
import { cartAction } from '../../../store/cartSlice'
import { useDispatch } from 'react-redux';

const MealItem = (props) => {
  const dispatch = useDispatch()

  const price = `$${props.price.toFixed(2)}`;
  const addToCartHandler = (amount) => {
    dispatch(cartAction.addItem({
      id: props.id,
      name: props.name,
      price: props.price,
      amount: amount
    }))

  }
  return (
    <li className={ classes.meal }>
      <div>
        <h3>{ props.name }</h3>
        <div className={ classes.description }>{ props.description }</div>
        <div className={ classes.price }>{ price }</div>
      </div>
      <div>
        <MealItemForm onAddCartItem={ addToCartHandler } id={ props.id } />
      </div>
    </li>
  );
};

export default MealItem;
