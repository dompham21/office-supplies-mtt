import cn from 'classnames';
import { useTranslation } from 'next-i18next';


const Badge = ({
  className,
  color: colorOverride,
  textColor: textColorOverride,
  text,
  style,
}) => {
  const { t } = useTranslation();

  const classes = {
    root: 'px-2.5 py-1 rounded-full text-sm',
    default: 'bg-accent',
    text: 'text-light',
  };

  return (
    <span
      className={cn(
        classes.root,
        {
          [classes.default]: !colorOverride,
          [classes.text]: !textColorOverride,
        },
        colorOverride,
        textColorOverride,
        className
      )}
      style={style}
    >
      {text? text : null}
    </span>
  );
};

export default Badge;
