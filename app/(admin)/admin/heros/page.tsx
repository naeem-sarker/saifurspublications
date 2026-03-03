import React from 'react'
import Heros from './HerosDetails'
import { getHeros } from '@/actions/herosActions'

const Page = async () => {
  const res = await getHeros();

  return (
    <div>
      <Heros heros={res.data}/>
    </div>
  )
}

export default Page
