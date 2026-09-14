import TmmcPage from "@/app/tmmc/page";
import EditRoot from "@/components/edit/EditRoot";

export default function AdminEditTmmcPage() {
  return (
    <EditRoot>
      <div className="bg-[#141115] text-[#e9e1cd]">
        <TmmcPage />
      </div>
    </EditRoot>
  );
}
