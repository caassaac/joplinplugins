import joplin from 'api';
import { SettingItemType } from 'api/types';

interface Stats {
    words: number;
    chars: number;
    charsNoSpaces: number;
    lines: number;
    paragraphs: number;
}

joplin.plugins.register({
    onStart: async () => {
        // 1) Register hidden JSON map for note → statsNote IDs
        await joplin.settings.registerSettings({
            statsMapping: {
                value: '{}',
                type: SettingItemType.String,
                public: false,
                label: 'Stats Mapping (internal)',
            },
        });

        let currentNoteId: string | null = null;
        let intervalHandle: NodeJS.Timeout | null = null;

        // 2) On note switch, restart the 10s timer
        await joplin.workspace.onNoteSelectionChange(async () => {
            const sel = await joplin.workspace.selectedNote();
            if (!sel || sel.id === currentNoteId) return;

            console.info('NoteStats: Switched to note', sel.id);
            currentNoteId = sel.id;

            if (intervalHandle) clearInterval(intervalHandle);

            // Do one update immediately, then every 10s
            await updateStatsFor(currentNoteId);
            intervalHandle = setInterval(() => {
                updateStatsFor(currentNoteId!);
            }, 10_000);
        });

        // 3) Clean up when Joplin shuts down
        process.on('exit', () => {
            if (intervalHandle) clearInterval(intervalHandle);
        });
    },
});

/** Compute all the stats for a string */
function computeStats(text: string): Stats {
    return {
        words: text.trim() ? text.trim().split(/\s+/).length : 0,
        chars: text.length,
        charsNoSpaces: text.replace(/\s/g, '').length,
        lines: text.split('\n').length,
        paragraphs: text
            .split(/\n\s*\n/)
            .filter(p => p.trim().length > 0)
            .length,
    };
}

/**
 * Create or update the companion stats note.
 * - If the mapped stats note is missing, it will recreate it.
 * - Always updates both title and body to reflect changes.
 */
async function updateStatsFor(noteId: string) {
    // 1. Load the source note
    const note = await joplin.data.get(['notes', noteId], {
        fields: ['title', 'body', 'parent_id'],
    });
    if (!note) {
        console.warn('NoteStats: Cannot load note', noteId);
        return;
    }

    // 2. Skip stats notes themselves
    if (note.title.startsWith('Note Stats for ')) {
        return;
    }

    // 3. Compute stats and timestamp
    const stats = computeStats(note.body || '');
    const timestamp = new Date().toLocaleString();
    const statsBody = `
Word count: ${stats.words}
Character count (with spaces): ${stats.chars}
Character count (no spaces): ${stats.charsNoSpaces}
Line count: ${stats.lines}
Paragraph count: ${stats.paragraphs}

Last updated: ${timestamp}
`.trim();

    // 4. Load the mapping from settings
    const mappingJson = await joplin.settings.value('statsMapping') as string;
    const mapping = JSON.parse(mappingJson) as Record<string, string>;

    let statsNoteId = mapping[noteId];

    // 5. Check if the mapped stats note actually exists
    if (statsNoteId) {
        try {
            // Try fetching it; if this fails, we'll recreate
            await joplin.data.get(['notes', statsNoteId], { fields: ['id'] });
        } catch {
            console.warn('NoteStats: Mapped stats note missing, will recreate for', noteId);
            delete mapping[noteId];
            statsNoteId = undefined;
        }
    }

    // 6a. Create stats note if needed
    if (!statsNoteId) {
        const created = await joplin.data.post(['notes'], null, {
            title: `Note Stats for ${note.title}`,
            body: statsBody,
            parent_id: note.parent_id,
        });
        mapping[noteId] = created.id;
        await joplin.settings.setValue('statsMapping', JSON.stringify(mapping));
        console.info('NoteStats: Created stats note', created.id);
    }
    // 6b. Update existing stats note (body + title)
    else {
        await joplin.data.put(['notes', statsNoteId], null, {
            title: `Note Stats for ${note.title}`,
            body: statsBody,
        });
        console.info('NoteStats: Updated stats note', statsNoteId);
    }
}
