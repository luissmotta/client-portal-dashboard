"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTasks() {
    const supabase = await createClient();
    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*, assignee:assignee_id(full_name)")
        .order("due_date", { ascending: true });

    if (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }

    // Transform to match UI needs if necessary, but returning raw is usually fine if types match
    return tasks.map(task => ({
        ...task,
        assignee: task.assignee?.full_name || "Unassigned"
    }));
}
