"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminOrganizationForm } from "./admin-organization-form";
import { getToken } from "@/lib/admin/mock-auth";
import { getAdminOrganization } from "@/lib/organization/api";
import type { Organization } from "@/lib/organization/types";

type AdminOrganizationEditPageProps = {
  params: Promise<{ id: string }>;
};

export function AdminOrganizationEditPage({ params }: AdminOrganizationEditPageProps) {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    getAdminOrganization(id)
      .then(setOrganization)
      .catch(() => router.push("/admin/organizations"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!organization) return null;

  return <AdminOrganizationForm organization={organization} />;
}
