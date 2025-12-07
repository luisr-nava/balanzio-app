import { redirect } from "next/navigation";

export default function EmployeeLegacyPage() {
  return redirect("/dashboard/employees");
}
