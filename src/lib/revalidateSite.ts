import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSite() {
  revalidateTag("works", "max");
  revalidateTag("studio", "max");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin");
  revalidatePath("/admin/works");
  revalidatePath("/admin/banner");
}
