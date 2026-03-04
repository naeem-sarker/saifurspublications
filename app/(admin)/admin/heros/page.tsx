import { Metadata } from 'next';
import Heros from './HerosDetails'
import { getHeros } from '@/actions/herosActions'

export const metadata: Metadata = {
  title: 'Heros - Saifurs Publications',
  description: 'Saifurs Publications',
}

const Page = async () => {
  const res = await getHeros();

  if (!res) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">Failed to load hero data. Please refresh.</p>
      </div>
    );
  }

  const data = res.data || []

  return (
    <Heros heros={data} />
  )
}

export default Page
