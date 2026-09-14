import BackRoomPage from "@/app/tmmc/back-room/page";
import EditRoot from "@/components/edit/EditRoot";

export default function AdminEditTmmcBackRoomPage() {
  return (
    <EditRoot>
      <div className="bg-[#141115] text-[#e9e1cd]">
        <BackRoomPage />
      </div>
    </EditRoot>
  );
}
