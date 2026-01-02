export default function EmptyTable({
  title,
  colSpan,
}: {
  title: string;
  colSpan: number;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-8 text-center text-sm text-muted-foreground">
        {title}
      </td>
    </tr>
  );
}

