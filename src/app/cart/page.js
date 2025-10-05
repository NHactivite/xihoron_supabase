import { getCharges } from '@/action'
import Cart from '@/components/cart'
import { redirect } from 'next/navigation'

const CartPage = async() => {
    const chargesData=await getCharges();
    chargesData.success?null:(
      redirect('/')
    )
   
  return (
    <div><Cart charges={chargesData}/></div>
  )
}

export default CartPage