"use client";
import React, { use, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../styles/editor.css";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
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

const TiptapEditor = () => {
  const { createBlog } = useAuth();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<h2>Your story starts here</h2><p>Write something amazing...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      console.log('Editor updated:', editor.getHTML());
    },
  });

  const [formData, setFormData] = useState({ title: "" });
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Debug function to test editor commands
  const testCommand = (command) => {
    console.log('Testing command:', command);
    console.log('Editor exists:', !!editor);
    console.log('Editor can:', editor?.can());
    
    if (!editor) {
      console.error('Editor not available');
      return;
    }
    
    try {
      const result = editor.chain().focus()[command]().run();
      console.log('Command result:', result);
    } catch (error) {
      console.error('Command failed:', error);
    }
  };

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
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Title Input */}
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

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <ControlButton
              onClick={() => testCommand('toggleBold')}
              active={editor?.isActive("bold") || false}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
              <span className="hidden sm:inline">Bold</span>
            </ControlButton>

            <ControlButton
              onClick={() => testCommand('toggleItalic')}
              active={editor?.isActive("italic") || false}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
              <span className="hidden sm:inline">Italic</span>
            </ControlButton>

            <ControlButton
              onClick={() => testCommand('toggleStrike')}
              active={editor?.isActive("strike") || false}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ControlButton>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            <ControlButton
              onClick={() => {
                console.log('H1 clicked');
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
                console.log('H2 clicked');
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
                console.log('Bullet list clicked');
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
                console.log('Ordered list clicked');
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
                console.log('Blockquote clicked');
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
          <ControlButton
            onClick={() => {
              if (!editor) return;
              const html = editor.getHTML();
              navigator.clipboard.writeText(html);
              toast.success("Content copied to clipboard!");
            }}
            title="Copy HTML"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </ControlButton>
          <ControlButton
            onClick={() => {
              if (!editor) return;
              editor.commands.clearContent();
              toast.info("Content cleared!");
            }}
            title="Clear Content"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </ControlButton>
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
