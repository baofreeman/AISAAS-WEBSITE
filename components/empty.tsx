interface EmptyProps {
  label?: string;
}

const Empty: React.FC<EmptyProps> = ({ label }) => {
  return (
    <div className="w-full h-full flex items-center justify-self-center">
      <span className="flex-1 text-center">{label}</span>
    </div>
  );
};

export default Empty;
