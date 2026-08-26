import SuccessPage from "@/app/(site)/success/page";
import EditRoot from "@/components/edit/EditRoot";

export default function AdminEditSuccessPage() {
  return (
    <EditRoot>
      <SuccessPage searchParams={Promise.resolve({})} />
    </EditRoot>
  );
}
