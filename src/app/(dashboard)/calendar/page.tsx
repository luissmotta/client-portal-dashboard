import { GlassCard } from "@/components/ui/glass-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEvents } from "@/app/actions/events";

export const revalidate = 0;

const eventStyles = {
    meeting: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    deadline: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    milestone: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export default async function CalendarPage() {
    // Generate current month days (simplified for now, using mock November 2026 logic to match design, but powered by data)
    // In a real app we would use url params ?month=11&year=2026

    const dbEvents = await getEvents();

    const days = Array.from({ length: 35 }, (_, i) => {
        const day = i - 2; // Offset to start month correctly
        return {
            day: day > 0 && day <= 30 ? day : null,
            events: [] as any[]
        };
    });

    // Map DB events to days
    // This assumes events are in the current month for simplicity of this view
    if (dbEvents.length > 0) {
        dbEvents.forEach((event: any) => {
            const date = new Date(event.date);
            const dayOfMonth = date.getDate();

            // Find the slot in 'days' array
            // This is a rough mapping for visual verification. 
            // Production calendar would need proper date logic (date-fns etc).
            const slotIndex = dayOfMonth + 2;
            if (days[slotIndex]) {
                days[slotIndex].events.push({
                    ...event,
                    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                });
            }
        });
    }

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-white">Novembro 2026</h1>
                <div className="flex gap-2">
                    <button className="rounded-lg bg-white/5 p-2 hover:bg-white/10 transition-colors">
                        <ChevronLeft className="h-5 w-5 text-white/70" />
                    </button>
                    <button className="rounded-lg bg-white/5 p-2 hover:bg-white/10 transition-colors">
                        <ChevronRight className="h-5 w-5 text-white/70" />
                    </button>
                </div>
            </div>

            <GlassCard className="flex-1 p-0 overflow-hidden flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-white/10 bg-white/2">
                    {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"].map((day) => (
                        <div key={day} className="py-3 text-center text-xs font-semibold text-white/40">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-white/10">
                    {days.map((d, i) => (
                        <div key={i} className={cn("relative p-2 min-h-[100px]", !d.day && "bg-black/20")}>
                            {d.day && (
                                <>
                                    <span className={cn(
                                        "absolute top-2 left-2 text-sm font-medium",
                                        d.day === 14 ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white" : "text-white/60"
                                    )}>
                                        {d.day}
                                    </span>
                                    <div className="mt-8 space-y-1.5">
                                        {d.events.map((event, idx) => (
                                            <div
                                                key={idx}
                                                className={cn("rounded px-2 py-1 text-[10px] font-medium border truncate", eventStyles[event.type as keyof typeof eventStyles] || eventStyles.meeting)}
                                            >
                                                {event.time && <span className="opacity-70 mr-1">{event.time} •</span>}
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
