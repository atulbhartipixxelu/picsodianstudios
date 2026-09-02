import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSite() {
  revalidateTag("works");
  revalidateTag("studio");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin");
  revalidatePath("/admin/works");
  revalidatePath("/admin/banner");
}
