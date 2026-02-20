"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPage(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const projectId = formData.get("project_id") as string;

    const { error } = await supabase
        .from("pages")
        .insert({
            name,
            url,
            project_id: projectId,
            status: "pending_review"
        });

    if (error) {
        console.error("Error creating page:", error);
        return;
    }

    revalidatePath(`/admin/projects/${projectId}`);
}

export async function deletePage(formData: FormData) {
    const supabase = await createClient();
    const pageId = formData.get("page_id") as string;
    const projectId = formData.get("project_id") as string;

    const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", pageId);

    if (error) {
        console.error("Error deleting page:", error);
        return;
    }

    revalidatePath(`/admin/projects/${projectId}`);
}
