type InputGroupProps = {
  label: string;
  children: React.ReactNode;
};

export const InputGroup: React.FC<InputGroupProps> = ({ label, children }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label>{label}</label>
      {children}
    </div>
  );
};
