export const Empty = ({ description }: { description: string }) => {
  return (
    <div className="text-muted-foreground text-sm">
      <p>{description}</p>
    </div>
  );
};

