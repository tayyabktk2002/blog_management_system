import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";

const ActionBtn = ({ blog_id, onDelete }) => {
  const { removeBlog } = useAuth();
  const deleteBlog = async (blog_id) => {
    await removeBlog(blog_id, onDelete);
  };
  return (
    <div className="flex justify-end flex-row gap-3">
      <div className="">
        <button
          onClick={() => deleteBlog(blog_id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Delete
        </button>
      </div>
      <div className="flex justify-end">
        <Link href={`/edit-blog/${blog_id}`}>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ActionBtn;
