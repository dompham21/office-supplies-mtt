import React from 'react'
import styles from "./radio.module.css";

const Radio = React.forwardRef(
    ({ className, label, name, id, error, ...rest }, ref) => {
      return (
        <div className={className}>
          <div className="flex items-center">
            <input
              id={id}
              name={name}
              type="radio"
              ref={ref}
              className={styles.radio_input}
              {...rest}
            />
  
            <label htmlFor={id} className="text-body text-sm">
              {label}
            </label>
          </div>
  
          {error && <p className="my-2 text-xs text-end text-red-500">{error}</p>}
        </div>
      );
    }
  );

Radio.displayName = "MyRadio"


export default Radio