import SuccessPage from "@/app/success/page";
import EditRoot from "@/components/edit/EditRoot";

export default function AdminEditSuccessPage() {
  return (
    <EditRoot>
      <SuccessPage searchParams={Promise.resolve({})} />
    </EditRoot>
  );
}
