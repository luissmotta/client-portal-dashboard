"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProjectPages(projectId: string) {
    const supabase = await createClient();
    const { data: pages, error } = await supabase
        .from("pages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching pages:", error);
        return [];
    }

    return pages;
}

export async function getPageById(pageId: string) {
    const supabase = await createClient();
    const { data: page, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .single();

    if (error) {
        console.error("Error fetching page:", error);
        return null;
    }

    return page;
}
