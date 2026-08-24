import HomePage from "@/app/(site)/home/page";
import AdminSitePreview from "@/components/edit/AdminSitePreview";

export default function AdminEditHomePage() {
  return (
    <AdminSitePreview>
      <HomePage />
    </AdminSitePreview>
  );
}
