import React from 'react'
import Agent from "@/components/agent";
import { getCurrentUser } from '@/lib/actions/auth.action';

const page = async () => {
    const user = await getCurrentUser();

  return (
    <>
<section className='mt-10'>
        <Agent userName={user?.name} userId={user?.id}  type="generate" />
        
        </section>
    </>
  )
}

export default page