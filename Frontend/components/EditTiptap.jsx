"use client";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../styles/editor.css";
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Heading1, Heading2, Copy, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const ControlButton = ({ onClick, active, title, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  
  return (
    <button
      onClick={handleClick}
      title={title}
      aria-pressed={active}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300"
      }`}
    >
      {children}
    </button>
  );
};

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/';
        const response = await fetch(`${apiUrl}post/details/${blogId}`, {
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
        } else {
          toast.error("Failed to load blog - Server not responding");
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        toast.error("Backend server is not running. Please start the backend server.");
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

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Enter your blog title..."
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-0 py-2 bg-transparent text-3xl font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none border-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleBold().run();
              }}
              active={editor?.isActive("bold") || false}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
              <span className="hidden sm:inline">Bold</span>
            </ControlButton>

            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleItalic().run();
              }}
              active={editor?.isActive("italic") || false}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
              <span className="hidden sm:inline">Italic</span>
            </ControlButton>

            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleStrike().run();
              }}
              active={editor?.isActive("strike") || false}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ControlButton>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              }}
              active={editor?.isActive("heading", { level: 1 }) || false}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
              <span className="hidden sm:inline">H1</span>
            </ControlButton>

            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              }}
              active={editor?.isActive("heading", { level: 2 }) || false}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
              <span className="hidden sm:inline">H2</span>
            </ControlButton>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleBulletList().run();
              }}
              active={editor?.isActive("bulletList") || false}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </ControlButton>

            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleOrderedList().run();
              }}
              active={editor?.isActive("orderedList") || false}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ControlButton>

            <ControlButton
              onClick={() => {
                if (!editor) return;
                editor.chain().focus().toggleBlockquote().run();
              }}
              active={editor?.isActive("blockquote") || false}
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