import { Metadata } from 'next';
import Heros from './HerosDetails'
import { getHeros } from '@/actions/herosActions'

export const metadata: Metadata = {
  title: 'Heros - Saifurs Publications',
  description: 'Saifurs Publications',
}

const Page = async () => {
  const res = await getHeros();

  return (
    <Heros heros={res.data} />
  )
}

export default Page
