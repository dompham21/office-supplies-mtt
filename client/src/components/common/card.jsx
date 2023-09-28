import cn from "classnames";

const Card = ({ className, ...props }) => {
  return (
    <div
      className={cn("p-5 md:p-8 bg-light shadow rounded", className)}
      {...props}
    />
  );
};

export default Card;
