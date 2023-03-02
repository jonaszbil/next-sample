import React, { FC } from "react";

const Button: FC<React.ComponentProps<"button">> = (props) => {
  const { className, children, ...restProps } = props;
  return (
    <button
      className={`w-40 rounded-full border-2 border-white bg-white py-3 px-8 font-lexend text-black mix-blend-lighten transition-all hover:bg-transparent hover:text-white ${className ?? ''}`}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
