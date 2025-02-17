'use client';
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import MarkdownIt from "markdown-it";
import markdownItHighlight from "markdown-it-highlightjs";
import markdownItMark from "markdown-it-mark";
import markdownItFootnote from "markdown-it-footnote";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import markdownItDeflist from "markdown-it-deflist";
import markdownItAbbr from "markdown-it-abbr";
import DOMPurify from "dompurify";
import { TbMarkdown, TbMarkdownOff } from "react-icons/tb";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdEdit, MdSaveAs } from "react-icons/md";
import { TiCancel } from "react-icons/ti";

interface MarkdownNotesProps {
    user: User;
}

interface MarkdownNote {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
}

export default function MarkdownNotes({ user }: MarkdownNotesProps) {
    const [notes, setNotes] = useState<MarkdownNote[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [editingNote, setEditingNote] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<string>("");
    const [originalContent, setOriginalContent] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Track preview state per note
    const [previewStates, setPreviewStates] = useState<Map<string, boolean>>(new Map());

    const supabase = createClient();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Initialize markdown-it with all features
    const mdParser = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
    })
        .use(markdownItHighlight)
        .use(markdownItMark)
        .use(markdownItFootnote)
        .use(markdownItSub)
        .use(markdownItSup)
        .use(markdownItDeflist)
        .use(markdownItAbbr);

    useEffect(() => {
        if (user) fetchNotes();
    }, [user]);

    async function fetchNotes() {
        const { data, error } = await supabase
            .from("markdown_notes")
            .select("*")
            .filter("user_id", "eq", user.id)
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error);
            setNotes([]); // In case of error, fallback to an empty array
        } else {
            setNotes(data || []); // Ensure data is always an array
        }
    }

    async function addNote() {
        if (!newTitle.trim() || !newContent.trim()) return;
        const { error } = await supabase
            .from("markdown_notes")
            .insert([{ title: newTitle, content: newContent, user_id: user.id }]);
        if (error) console.error(error);
        else {
            setNewTitle("");
            setNewContent("");
            fetchNotes();
        }
    }

    async function updateNote(id: string, content: string) {
        if (content === originalContent) return; // Prevent unnecessary updates

        const { error } = await supabase.from("markdown_notes").update({ content }).eq("id", id);
        if (error) console.error(error);
        else {
            setEditingNote(null);
            setIsEditing(false);
            fetchNotes();
        }
    }

    async function deleteNote(id: string) {
        const { error } = await supabase.from("markdown_notes").delete().eq("id", id);
        if (error) console.error(error);
        else fetchNotes();
    }

    // Convert Markdown to sanitized HTML
    const renderMarkdown = (content: string) => {
        const formattedContent = content.replace(/\n/g, "  \n");
        return DOMPurify.sanitize(mdParser.render(formattedContent || ""));
    };

    const togglePreview = (id: string) => {
        setPreviewStates((prevState) => {
            const newState = new Map(prevState);
            newState.set(id, !newState.get(id));
            return newState;
        });
    };

    return (
        <div className="max-w-xs mx-auto p-4 sm:p-6 relative md:max-w-sm lg:max-w-3xl">
            <h1 className="text-xl font-bold">Markdown Notes</h1>

            {/* Create New Note */}
            <div className="border p-4 rounded mb-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 border rounded mt-2"
                />
                <textarea
                    placeholder="Write your markdown here..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-2 border rounded mt-2 min-h-[150px] sm:min-h-[200px]"
                />
                <button
                    data-testid="add-note-button"
                    disabled={!newTitle.trim() || !newContent.trim()}
                    onClick={addNote}
                    className={`${!newTitle.trim() || !newContent.trim() ? "bg-gray-500 text-white px-4 py-2 rounded mt-2 text-sm sm:text-base cursor-not-allowed" : "bg-green-500 text-white px-4 py-2 rounded mt-2 text-sm sm:text-base hover:bg-green-600"}`}
                >
                    Add Note
                </button>
            </div>

            {/* Display Notes */}
            <div data-testid="markdown-notes" className="mt-4">
                {notes.length === 0 ? (
                    <p className="text-gray-500 text-center">No markdown notes yet. Create one above!</p>
                ) : (
                    notes.map((note) => (
                        <div data-testid={`note-container-${note.id}`} key={note.id} className="border p-4 rounded mb-4 relative flex flex-col md:flex-row md:gap-4">
                            <div className="flex-1 w-full mb-4 md:mb-0 overflow-x-auto">
                                <h2 className="font-bold text-lg">{note.title}</h2>
                                {editingNote === note.id ? (
                                    <textarea
                                        ref={textareaRef}
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        className="w-full p-2 border rounded mt-2 min-h-[150px] md:min-h-[200px] resize-none"
                                    />
                                ) : previewStates.get(note.id) ? (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
                                        className="prose prose-sm md:prose-base lg:prose-lg max-w-none overflow-x-auto"
                                    />
                                ) : (
                                    <pre className="whitespace-pre-wrap p-2 border rounded min-h-[150px] md:min-h-[200px] w-full overflow-x-auto">
                                        {note.content}
                                    </pre>
                                )}
                            </div>

                            {/* Floating Buttons */}
                            <div className="absolute right-2 top-2 md:sticky md:top-24 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 justify-end md:justify-start self-start">
                                {editingNote === note.id ? (
                                    <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                                        <button
                                            disabled={editedContent === originalContent}
                                            onClick={() => updateNote(note.id, editedContent)}
                                        >
                                            <MdSaveAs
                                                size={24}
                                                className={`${isEditing && editedContent === originalContent ? "cursor-not-allowed text-gray-500" : "cursor-pointer text-green-500 hover:text-green-700"}`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingNote(null);
                                                setEditedContent(originalContent);
                                                setIsEditing(false);
                                            }}
                                        >
                                            <TiCancel size={27} className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            data-testid={`edit-button-${note.id}`}
                                            onClick={() => {
                                                setOriginalContent(note.content);
                                                setEditedContent(note.content);
                                                setEditingNote(note.id);
                                                setIsEditing(true);
                                            }}
                                        >
                                            <MdEdit size={24} className="text-gray-500 hover:text-gray-700" />
                                        </button>

                                        {/* Delete & Markdown Toggle Buttons - Hidden When Editing */}
                                        {!isEditing && (
                                            <>
                                                <button onClick={() => deleteNote(note.id)}>
                                                    <RiDeleteBin5Fill size={20} className="text-red-500 hover:text-red-700" />
                                                </button>
                                                <button onClick={() => togglePreview(note.id)}>
                                                    {previewStates.get(note.id) ? (
                                                        <TbMarkdownOff size={26} className="text-purple-500 hover:text-purple-700" />
                                                    ) : (
                                                        <TbMarkdown size={26} className="text-purple-500 hover:text-purple-700" />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
