import React from 'react'

function Description({
    title,
    details,
    className,
    ...props
  }) {
  return (
    <div className={className} {...props}>
        {title && (
        <h4 className="text-base font-semibold text-body-dark mb-2">{title}</h4>
        )}
        {details && <p className="text-sm text-body">{details}</p>}
    </div>
  )
}

export default Description