"use client";
import React, { use, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const ControlButton = ({ onClick, active, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    aria-pressed={active}
    type="button"
    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
      active
        ? "bg-primary text-primary-foreground border-primary shadow-sm"
        : "bg-card text-foreground border-border hover:bg-accent hover:border-primary/30"
    }`}
  >
    {children}
  </button>
);

const TiptapEditor = () => {
  const { createBlog } = useAuth();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<h2>Your story starts here</h2><p>Write something amazing...</p>",
    immediatelyRender: false,
  });

  const [formData, setFormData] = useState({ title: "" });
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const text = (editor.getText() || "").trim();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      setWordCount(words);
    };

    update();
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const payload = {
      ...formData,
      content,
    };

    try {
      setSubmitting(true);
      const response = await createBlog(payload);
      if (response.status === 201) {
        setFormData({ title: "" });
        editor.commands.clearContent();
        toast.success("Blog published successfully!");
      }
    } catch (err) {
      console.error("Create blog failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!editor) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 ">
        <div className="animate-pulse bg-muted rounded-2xl h-96"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-500 p-4 rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Create New Blog
          </h1>
          <p className="text-muted-foreground mt-1">
            Share your thoughts with the world
          </p>
        </div>
        <button
          type="button"
          onClick={handlePublish}
          disabled={submitting}
          className={`bg-primary hover:bg-primary/90 rounded-xl py-3 px-8 text-primary-foreground font-semibold transition-all duration-300 shadow-lg shadow-white hover:shadow-xl hover:shadow-white text-white ${
            submitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Publishing…" : "Publish Blog"}
        </button>
      </div>

      {/* Editor Card */}
      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Title Input */}
        <div className="p-6 border-b border-border">
          <input
            type="text"
            placeholder="Enter your blog title..."
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-0 py-2 bg-transparent text-3xl font-display font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none border-none placeholder:text-white"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-editor-toolbar border-b border-border p-4">
          <div className="flex flex-wrap gap-2">
            <ControlButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
              <span className="hidden sm:inline">Bold</span>
            </ControlButton>

            <ControlButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
              <span className="hidden sm:inline">Italic</span>
            </ControlButton>

            <ControlButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ControlButton>

            <div className="w-px h-8 bg-border mx-1" />

            <ControlButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
              <span className="hidden sm:inline">H1</span>
            </ControlButton>

            <ControlButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
              <span className="hidden sm:inline">H2</span>
            </ControlButton>

            <div className="w-px h-8 bg-border mx-1" />

            <ControlButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </ControlButton>

            <ControlButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ControlButton>

            <ControlButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
              <span className="hidden sm:inline">Quote</span>
            </ControlButton>
          </div>
          <button
            type="button"
            onClick={() => {
              const html = editor.getHTML();
              navigator.clipboard.writeText(html);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted border border-border text-sm hover:bg-accent transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            type="button"
            onClick={() => editor.commands.clearContent()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Editor Content */}
        <div className="p-6 min-h-100">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
