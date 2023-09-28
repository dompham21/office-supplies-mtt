

export const Error = ({ message }) => {
  return <p className="my-2 text-xs text-start text-red-500">{message ? message : null}</p>;
};

const ErrorMessage = ({ message }) => {
  return (
    <p className="bg-red-400 p-5 mt-16 mx-auto max-w-sm min-w-min text-center text-lg text-light font-semibold rounded">
      {message ? message : null}
    </p>
  );
};

export default ErrorMessage;
