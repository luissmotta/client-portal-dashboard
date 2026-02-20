"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProjects() {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    return projects;
}

export async function getProjectById(id: string) {
    const supabase = await createClient();
    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }

    return project;
}
