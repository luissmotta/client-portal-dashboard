"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const clientEmail = formData.get("client_email") as string;
    const deadline = formData.get("deadline") as string;
    const projectType = formData.get("project_type") as string;
    const responsibleDev = formData.get("responsible_dev") as string;

    // 1. Get Client ID from email (optional step if we strictly link to users table)
    // For now, we will just create the project. In a real app, you'd look up the user.

    const { data: project, error } = await supabase
        .from("projects")
        .insert({
            name,
            description,
            deadline: deadline || null,
            project_type: projectType,
            responsible_dev: responsibleDev,
            status: "active",
            progress: 0
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin");
    redirect("/admin");
}
