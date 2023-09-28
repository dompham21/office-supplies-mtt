import React from 'react'

function PosterListRight({items}) {
  return (
    <>
        {
            items?.map(i => (
                <div className='bg-black overflow-hidden rounded-md flex-1 last:mt-1.5' key={i?.id}>
                    <div className='w-full h-full bg-cover bg-no-repeat' style={{backgroundImage:`url(${i?.image})`}}/>
                </div>
            ))
        }
    </>
    
    
  )
}

export default PosterListRight