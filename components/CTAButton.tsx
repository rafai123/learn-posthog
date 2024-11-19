import posthog from 'posthog-js'
import React from 'react'

type CTAButtonProps = {
  text: string
}

const CTAButton = ({text}: CTAButtonProps) => {
  return (
    <>
    <button className='px-6 py-4 rounded shadow bg-yellow-600'
      onClick={() => {
        posthog.capture('test click cta button', { property: 'CTA Button' })
      }}
    >
      {text}
    </button>
    </>
  )
}

export default CTAButton