import type { Organization } from "@/lib/organization/types";
import { slugify } from "@/shared/lib/slugify";

export type OrganizationFormValues = {
  name: string;
  slug: string;
  image: string;
  history: string;
  isVisible: boolean;
};

export function createEmptyOrganizationFormValues(): OrganizationFormValues {
  return {
    name: "",
    slug: "",
    image: "",
    history: "",
    isVisible: true,
  };
}

export function mapOrganizationToFormValues(
  organization: Organization,
): OrganizationFormValues {
  return {
    name: organization.name,
    slug: organization.slug ?? "",
    image: organization.image ?? "",
    history: organization.history ?? "",
    isVisible: organization.isVisible ?? true,
  };
}

export function resolveOrganizationSlug(
  values: OrganizationFormValues,
  options: { isEdit: boolean; slugManuallyEdited: boolean; existingSlug?: string },
): string {
  if (options.slugManuallyEdited) {
    return values.slug.trim();
  }
  if (options.isEdit) {
    return options.existingSlug ?? values.slug.trim();
  }
  return slugify(values.name);
}
