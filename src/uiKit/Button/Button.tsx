import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: 'primary' | 'danger';
}

interface ButtonProps extends PropsWithChildren<Props> {}

const Button = (props: ButtonProps) => {
  const { appearance, children, ...restProps } = props;

  return (
    <button className={styles[appearance || 'primary']} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
