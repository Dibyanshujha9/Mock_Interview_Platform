import React from 'react'
import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'


const page = async () => {

const user = await getCurrentUser();

  return (

<>

<Agent userName = "You" userId="user1" type = "generate" />

</>  

)

}

export default page