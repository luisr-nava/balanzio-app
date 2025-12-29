export const Loading = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{text}</p>
    </div>
  );
};
