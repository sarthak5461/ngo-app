"use client";
import { useEffect, useState } from "react";
import RichTextEditor from "@/components/admin/rich-text-editor";
import MediaPicker from "@/components/admin/media-picker";
import { makeSlug } from "@/lib/utils/csv";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BlogEditor({ params }) {
  const [blog, setBlog] = useState(null);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/blogs/${params.id}`)
      .then((r) => r.json())
      .then(setBlog);
  }, [params.id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      <Button
        type='button'
        onClick={() => window.open(`/blog/preview/${blog.id}`, "_blank")}
      >
        Preview
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='destructive'>Delete</Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. The blog will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                const res = await fetch(`/api/admin/blogs/${params.id}`, {
                  method: "DELETE",
                });

                if (!res.ok) {
                  toast.error("Failed to delete blog");
                  return;
                }

                toast.success("Blog deleted successfully");

                window.location.href = "/admin/blogs";
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <input
        className='w-full border rounded p-3'
        placeholder='Blog Title'
        value={blog.hero?.title || ""}
        onChange={(e) => {
          const title = e.target.value;

          setBlog({
            ...blog,
            hero: {
              ...blog.hero,
              title,
            },
            pageHeader: {
              ...blog.pageHeader,
              slug:
                !blog.pageHeader?.slug ||
                blog.pageHeader.slug === makeSlug(blog.hero?.title || "")
                  ? makeSlug(title)
                  : blog.pageHeader.slug,
            },
          });
        }}
      />
      <input
        className='w-full border rounded p-3'
        placeholder='Slug'
        value={blog.pageHeader?.slug || ""}
        onChange={(e) =>
          setBlog({
            ...blog,
            pageHeader: {
              ...blog.pageHeader,
              slug: e.target.value,
            },
          })
        }
      />

      <RichTextEditor
        value={blog.content || ""}
        onChange={(html) =>
          setBlog({
            ...blog,
            content: html,
          })
        }
      />

      <textarea
        className='w-full border rounded p-3'
        rows={3}
        placeholder='Excerpt'
        value={blog.hero?.excerpt || ""}
        onChange={(e) =>
          setBlog({
            ...blog,
            hero: {
              ...blog.hero,
              excerpt: e.target.value,
            },
          })
        }
      />

      <div className='space-y-3'>
        <label className='block text-sm font-medium text-heading'>
          Cover Image
        </label>

        {blog.hero?.coverImage && (
          <img
            src={blog.hero.coverImage}
            alt='Cover'
            className='w-full max-w-md rounded-lg border'
          />
        )}

        <button
          type='button'
          onClick={() => setCoverPickerOpen(true)}
          className='cursor-pointer bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base block w-full shadow-xs px-4 py-2 text-left'
        >
          Select from Media Library
        </button>

        <p className='text-sm text-gray-500'>
          Upload a new image or choose an existing one.
        </p>

        <select
          className='w-full border rounded p-3'
          value={blog.hero?.category || ""}
          onChange={(e) =>
            setBlog({
              ...blog,
              hero: {
                ...blog.hero,
                category: e.target.value,
              },
            })
          }
        >
          <option value=''>Select Category</option>

          <option value='education'>Education</option>
          <option value='healthcare'>Healthcare</option>
          <option value='environment'>Environment</option>
          <option value='csr'>CSR</option>
          <option value='disaster-relief'>Disaster Relief</option>
          <option value='women-empowerment'>Women Empowerment</option>
          <option value='news'>News</option>
        </select>
      </div>

      <MediaPicker
        open={coverPickerOpen}
        onClose={() => setCoverPickerOpen(false)}
        onChange={(imageUrl) => {
          setBlog({
            ...blog,
            hero: {
              ...blog.hero,
              coverImage: imageUrl,
            },
          });
        }}
      />

      <input
        className='w-full border rounded p-3'
        placeholder='SEO Title'
        value={blog.pageHeader?.seoTitle || ""}
        onChange={(e) =>
          setBlog({
            ...blog,
            pageHeader: {
              ...blog.pageHeader,
              seoTitle: e.target.value,
            },
          })
        }
      />

      <textarea
        className='w-full border rounded p-3'
        rows={3}
        placeholder='SEO Description'
        value={blog.pageHeader?.seoDescription || ""}
        onChange={(e) =>
          setBlog({
            ...blog,
            pageHeader: {
              ...blog.pageHeader,
              seoDescription: e.target.value,
            },
          })
        }
      />

      <select
        className='mx-auto w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body'
        value={blog.status}
        onChange={(e) =>
          setBlog({
            ...blog,
            status: e.target.value,
          })
        }
      >
        <option value='draft'>Draft</option>
        <option value='published'>Published</option>
        <option value='scheduled'>Scheduled</option>
      </select>
      {blog.status === "scheduled" && (
        <div>
          <label className='block mb-2 font-medium'>Publish Date</label>

          <input
            type='datetime-local'
            className='w-full border rounded p-3'
            value={
              blog.publishedAt
                ? new Date(blog.publishedAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setBlog({
                ...blog,
                publishedAt: new Date(e.target.value).toISOString(),
              })
            }
          />
        </div>
      )}

      <div className='flex items-center mb-4'>
        <label className='select-none ms-2 text-sm font-medium text-heading'>
          <input
            className='w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft'
            type='checkbox'
            checked={blog.featured}
            onChange={(e) =>
              setBlog({
                ...blog,
                featured: e.target.checked,
              })
            }
          />
          Featured
        </label>

        <label className='select-none ms-2 text-sm font-medium text-heading'>
          <input
            className='w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft'
            type='checkbox'
            checked={blog.popular}
            onChange={(e) =>
              setBlog({
                ...blog,
                popular: e.target.checked,
              })
            }
          />
          Popular
        </label>
      </div>
      <button
        className='px-4 py-2 bg-blue-600 text-white rounded'
        onClick={async () => {
          const res = await fetch(`/api/admin/blogs/${params.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(blog),
          });

          if (!res.ok) {
            toast.error("Failed to save blog");
            return;
          }

          toast.success("Blog updated successfully!");
        }}
      >
        Save
      </button>
    </div>
  );
}
