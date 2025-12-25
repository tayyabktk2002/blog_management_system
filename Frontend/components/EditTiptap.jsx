"use client";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Heading1, Heading2, Copy, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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

const EditTiptap = ({ blogId }) => {
  const { updateBlog } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[300px] prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-li:text-foreground",
      },
    },
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/post/details/${blogId}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({ title: data.data.title });
          if (editor) {
            editor.commands.setContent(data.data.content);
          }
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (blogId && editor) {
      fetchBlog();
    }
  }, [blogId, editor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const payload = { ...formData, content };

    try {
      setSubmitting(true);
      const response = await updateBlog(blogId, payload);
      if (response.status === 200) {
        toast.success("Blog updated successfully!");
        router.push("/user-blog");
      }
    } catch (err) {
      console.error("Update blog failed", err);
      toast.error("Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !editor) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="animate-pulse bg-muted rounded-2xl h-96"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Edit Blog</h1>
          <p className="text-muted-foreground mt-1">Update your blog post</p>
        </div>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={submitting}
          className={`bg-primary hover:bg-primary/90 rounded-xl py-3 px-8 text-primary-foreground font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 ${
            submitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Updating…" : "Update Blog"}
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <input
            type="text"
            placeholder="Enter your blog title..."
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-0 py-2 bg-transparent text-3xl font-display font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none border-none"
          />
        </div>

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
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
              <span className="hidden sm:inline">H1</span>
            </ControlButton>

            <ControlButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
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
        </div>

        <div className="p-6 min-h-100">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default EditTiptap;