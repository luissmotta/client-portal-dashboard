"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitFeedback(pageId: string, feedbackItems: { category: string; content: string }[]) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("feedback_items")
        .insert(
            feedbackItems.map(item => ({
                page_id: pageId,
                category: item.category,
                content: item.content,
                status: "pending"
            }))
        );

    if (error) {
        console.error("Error submitting feedback:", error);
        return { success: false, error: error.message };
    }

    // Update page status to 'changes_requested'
    await supabase
        .from("pages")
        .update({ status: "changes_requested", last_updated: new Date().toISOString() })
        .eq("id", pageId);

    revalidatePath(`/projects/[id]/pages/${pageId}`);
    return { success: true };
}

export async function approvePage(pageId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("pages")
        .update({ status: "approved", last_updated: new Date().toISOString() })
        .eq("id", pageId);

    if (error) {
        console.error("Error approving page:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/projects/[id]/pages/${pageId}`);
    return { success: true };
}
