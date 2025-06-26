import { useRating } from "6pp"
import { FaRegStar, FaStar } from "react-icons/fa"

const Rating = ({value=0}) => {
    const {Ratings}=useRating({IconFilled:<FaStar/>,IconOutline:<FaRegStar/>,value,styles:{fontSize:"1.5rem",color:"coral" ,justifyContent:"flex-start"}})
  return (
    <div>
     <Ratings/>
    </div>
  )
}

export default Rating
