import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllPlans } from '../../redux/plans';
import PlanIndexItem from '../PlanIndexItem';
import "./Plans.css";
import { getAllExpenses } from '../../redux/expenses';

function Plans({num}) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const plans = useSelector((state) => state.plans);
    const expenses = useSelector((state)=> state.expenses);
    // console.log(Object.values(expenses));
    const expense = Object.values(expenses);
    useEffect(()=>{
      dispatch(getAllExpenses()).then(()=>dispatch(getAllPlans())).then(()=>setIsLoaded(true))
    }, [dispatch]);

  if (!isLoaded) {
    return (<div>Loading...</div>);
  }
  // console.log(plans);
  if(isLoaded){
  return (
    <div id="planslistgrid">
        {num ==2 && <h2>
          <Link id="plansmainpage" to="/plans" > Plans </Link>
        </h2>}
        {num !=2 && <h2>
          <Link id="plansIsActive" to="/plans" > Plans </Link>
          <Link id="placesIsNotActive" to="/places" > Places </Link>
          <Link id="storiesIsNotActive" to="/stories" > Stories </Link>
        </h2>}
        {
          num == 2 && <div id="viewallplans">
          {Object.values(plans).slice(0, 2).map((plan, index) => (
                <PlanIndexItem plan={plan} expense={expense} key={index}/>
          ))}
       </div>
        }
        {
          num != 2 && <div id="viewallplans1">
            {Object.values(plans).map((plan, index) => (
                  <PlanIndexItem plan={plan} expense={expense} key={index}/>
            ))}
         </div>
        }
    </div>
  );}
}

export default Plans;
