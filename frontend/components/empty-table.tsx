import { TableCell, TableRow } from "./ui/table";

export default function EmptyTable({
  title,
  colSpan,
}: {
  title: string;
  colSpan: number;
}) {
  return (
    <TableRow key="empty-row">
      <TableCell colSpan={colSpan} className="py-6 text-center">
        {title}
      </TableCell>
    </TableRow>
  );
}
