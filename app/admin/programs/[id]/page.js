"use client";

import { useEffect, useState } from "react";
import MediaPicker from "@/components/admin/media-picker";
import RichTextEditor from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import Link from "next/link";

export default function EditProgramPage({ params }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/programs/${params.id}`);

    const data = await res.json();

    const row = data.row || {};

    setForm({
      ...row,

      pageHeader: {
        tagline: row.pageHeader?.tagline || "",

        slug: row.pageHeader?.slug || row.slug || "",

        seoTitle: row.pageHeader?.seoTitle || "",

        seoDescription: row.pageHeader?.seoDescription || "",
      },

      hero: {
        title: row.hero?.title || row.title || "",

        tagline: row.hero?.tagline || row.tagline || "",

        excerpt: row.hero?.excerpt || row.excerpt || "",

        coverImage: row.hero?.coverImage || row.coverImage || "",

        icon: row.hero?.icon || row.icon || "GraduationCap",
      },

      statsSection: {
        items: row.statsSection?.items || row.stats || [],
      },

      ourInitiatives: {
        title: row.ourInitiatives?.title || "",
        toptag: row.ourInitiatives?.toptag || "",
        items: row.ourInitiatives?.items || [],
      },

      galleryImages: {
        title: row.galleryImages?.title || "",
        subcontent: row.galleryImages?.subcontent || "",
        items: row.galleryImages?.items || [],
      },

      supportTiers: {
        title: row.supportTiers?.title || "",
        subtitle: row.supportTiers?.subtitle || "",
        items: row.supportTiers?.items || [],
      },

      howItWorks: {
        title: row.howItWorks?.title || "",
        items: row.howItWorks?.items || [],
      },

      VolunteerSec: {
        title: row.VolunteerSec?.title || "",
        toptag: row.VolunteerSec?.toptag || "",
        content: row.VolunteerSec?.content || "",
        image: row.VolunteerSec?.image || "",
        buttontext: row.VolunteerSec?.buttontext || "",
        buttonlink: row.VolunteerSec?.buttonlink || "",
      },
    });
  }
  async function save(status) {
    try {
      const payload = {
        ...form,

        status,
      };

      const res = await fetch(`/api/admin/programs/${params.id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        status === "published" ? "Program published" : "Draft saved",
      );
    } catch (error) {
      toast.error("Failed to save program");
    }
  }

  async function removeProgram() {
    const ok = confirm("Delete this program?");

    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/programs/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Program deleted");

      window.location.href = "/admin/programs";
    } catch (error) {
      toast.error("Delete failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (!form) return <div>Loading...</div>;

  return (
    <div className='space-y-8'>
      <div className='flex gap-3 pt-5 fixed -top-2 right-6 z-50'>
        {/* <button
          onClick={save}
          className='px-5 py-2 rounded bg-black text-white'
        >
          Save Program
        </button> */}

        <Link
          href={`/preview/programs/${params.id}`}
          target='_blank'
          className='px-5 py-3 rounded-xl bg-blue-600 text-white'
        >
          Preview
        </Link>

        <button
          type='button'
          onClick={() => save("draft")}
          className='px-5 py-3 rounded-xl bg-slate-800 text-white'
        >
          Save Draft
        </button>

        <button
          type='button'
          onClick={() => save("published")}
          className='px-5 py-3 rounded-xl bg-green-600 text-white'
        >
          Publish
        </button>

        <button
          type='button'
          onClick={removeProgram}
          className='px-5 py-3 rounded-xl bg-red-600 text-white'
        >
          Delete
        </button>
      </div>

      {/* PAGE HEADER */}
      <div className='border rounded-xl p-5 bg-white'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h2 className='text-lg font-semibold'>Page Header</h2>

            <p className='text-sm text-slate-500'>SEO and routing settings</p>
          </div>
        </div>

        <div className='space-y-5'>
          {/* PAGE TITLE */}

          <div>
            <label className='block text-sm font-medium mb-1'>Tagline</label>

            <input
              className='border rounded p-2 w-full'
              value={form.pageHeader?.tagline || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  pageHeader: {
                    ...form.pageHeader,
                    tagline: e.target.value,
                  },
                })
              }
            />
          </div>

          {/* SLUG */}

          <div>
            <label className='block text-sm font-medium mb-1'>Slug</label>

            <input
              className='border rounded p-2 w-full'
              value={form.pageHeader?.slug || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  pageHeader: {
                    ...form.pageHeader,
                    slug: e.target.value,
                  },
                })
              }
            />
          </div>

          {/* SEO TITLE */}

          <div>
            <label className='block text-sm font-medium mb-1'>SEO Title</label>

            <input
              className='border rounded p-2 w-full'
              value={form.pageHeader?.seoTitle || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  pageHeader: {
                    ...form.pageHeader,
                    seoTitle: e.target.value,
                  },
                })
              }
            />
          </div>

          {/* SEO DESCRIPTION */}

          <div>
            <label className='block text-sm font-medium mb-1'>
              SEO Description
            </label>

            <textarea
              className='border rounded p-2 w-full min-h-[120px]'
              value={form.pageHeader?.seoDescription || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  pageHeader: {
                    ...form.pageHeader,
                    seoDescription: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* PAGE HERO */}
      <div className='border rounded-xl p-5 bg-white'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h2 className='text-lg font-semibold'>Page Hero</h2>

            <p className='text-sm text-slate-500'>Main banner content</p>
          </div>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-1'>Hero Icon</label>

            <select
              className='border rounded p-2 w-full'
              value={form.hero?.icon || "GraduationCap"}
              onChange={(e) =>
                setForm({
                  hero: {
                    ...form.hero,
                    icon: e.target.value,
                  },
                })
              }
            >
              <option value='GraduationCap'>Education</option>

              <option value='Leaf'>Environment</option>

              <option value='LifeBuoy'>Disaster Relief</option>

              <option value='Stethoscope'>Healthcare</option>

              <option value='Users'>Community</option>

              <option value='Sparkles'>Empowerment</option>
            </select>
          </div>

          {/* TAGLINE */}

          <div>
            <label className='block text-sm font-medium mb-1'>Title</label>

            <input
              className='border rounded p-2 w-full'
              value={form.hero?.title || ""}
              onChange={(e) =>
                setForm({
                  ...form,

                  hero: {
                    ...form.hero,

                    title: e.target.value,
                  },
                })
              }
            />
          </div>

          {/* SHORT DESCRIPTION */}

          <div>
            <label className='block text-sm font-medium mb-1'>Subtitle</label>

            <input
              className='border rounded p-2 w-full'
              value={form.hero?.excerpt || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  hero: {
                    ...form.hero,
                    excerpt: e.target.value,
                  },
                })
              }
            />
          </div>

          {/* COVER IMAGE */}

          <div>
            <label className='block text-sm font-medium mb-2'>
              Cover Image
            </label>

            <div className='space-y-3'>
              {form.hero?.coverImage && (
                <div className='w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-slate-100'>
                  <img
                    src={form.hero?.coverImage}
                    alt='Cover'
                    className='w-full h-full object-cover'
                  />
                </div>
              )}

              <button
                type='button'
                onClick={() => setPickerOpen(true)}
                className='px-4 py-2 rounded border bg-white hover:bg-slate-50'
              >
                {form.hero?.coverImage ? "Change Image" : "Choose Image"}
              </button>
            </div>
          </div>

          <MediaPicker
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            value={form.hero?.coverImage}
            onChange={(url) => {
              if (
                typeof window !== "undefined" &&
                window.__galleryIndex !== undefined
              ) {
                const next = [...(form.galleryImages?.items || [])];

                next[window.__galleryIndex] = url;

                setForm({
                  ...form,
                  galleryImages: {
                    ...form.galleryImages,
                    items: next,
                  },
                });

                delete window.__galleryIndex;

                return;
              }

              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  coverImage: url,
                },
                VolunteerSec: {
                  ...form.VolunteerSec,
                  image: url,
                },
              });
            }}
          />
        </div>
      </div>

      <div className='border rounded-2xl bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>Gallery</h2>
          <p className='text-sm text-slate-500 mt-1'>
            Gallery Images with Title, Sub Title and Content
          </p>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-1'>Title</label>

            <input
              className='border rounded p-2 w-full'
              value={form.galleryImages?.title || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  galleryImages: {
                    ...form.galleryImages,
                    title: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Sub Title</label>

            <input
              className='border rounded p-2 w-full'
              value={form.galleryImages?.subcontent || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  galleryImages: {
                    ...form.galleryImages,
                    subcontent: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium'>Gallery Images</label>

                <button
                  type='button'
                  onClick={() =>
                    setForm({
                      ...form,
                      galleryImages: {
                        ...form.galleryImages,
                        items: [
                          ...(form.galleryImages.items || []),
                          {
                            img: "",
                          },
                        ],
                      },
                    })
                  }
                  className='px-3 py-1 rounded border text-sm'
                >
                  Add Image
                </button>
              </div>

              {(form.galleryImages?.items || []).map((img, idx) => (
                <div key={idx} className='border rounded-lg p-3 space-y-3'>
                  {img?.img && (
                    <div className='aspect-video max-w-md overflow-hidden rounded border'>
                      <img
                        src={img.img}
                        alt=''
                        className='w-full h-full object-cover'
                      />
                    </div>
                  )}

                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => {
                        setPickerOpen(true);

                        window.__galleryIndex = idx;
                      }}
                      className='px-3 py-2 rounded border'
                    >
                      Choose Image
                    </button>

                    <button
                      type='button'
                      className='text-blue-600 text-sm'
                      onClick={() => {
                        const next = [...(form.galleryImages?.items || [])];

                        next.splice(idx + 1, 0, {
                          ...img,
                        });

                        setForm({
                          ...form,

                          galleryImages: {
                            ...form.galleryImages,

                            items: next,
                          },
                        });
                      }}
                    >
                      Duplicate
                    </button>

                    <button
                      type='button'
                      onClick={() => {
                        const next = [...(form.galleryImages?.items || [])];

                        next.splice(idx, 1);

                        setForm({
                          ...form,
                          galleryImages: {
                            ...form.galleryImages,
                            items: next,
                          },
                        });
                      }}
                      className='px-3 py-2 rounded border text-red-600'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='border rounded-2xl bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Program Statistics
          </h2>

          <p className='text-sm text-slate-500 mt-1'>
            Showcase measurable impact
          </p>
        </div>

        <div className='space-y-5'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Statistics</label>

              <button
                type='button'
                className='px-3 py-1 rounded border text-sm'
                onClick={() =>
                  setForm({
                    ...form,

                    statsSection: {
                      ...form.statsSection,

                      items: [
                        ...(form.statsSection?.items || []),

                        {
                          value: "",
                          label: "",
                        },
                      ],
                    },
                  })
                }
              >
                Add Stat
              </button>
            </div>

            {(form.statsSection?.items || []).map((item, idx) => (
              <div key={idx} className='border rounded-xl p-4 space-y-3'>
                <input
                  placeholder='Value (Example: 5000+)'
                  className='border rounded p-2 w-full'
                  value={item.value || ""}
                  onChange={(e) => {
                    const next = [...(form.statsSection?.items || [])];

                    next[idx].value = e.target.value;

                    setForm({
                      ...form,

                      statsSection: {
                        ...form.statsSection,

                        items: next,
                      },
                    });
                  }}
                />

                <input
                  placeholder='Label (Example: Students Educated)'
                  className='border rounded p-2 w-full'
                  value={item.label || ""}
                  onChange={(e) => {
                    const next = [...(form.statsSection?.items || [])];

                    next[idx].label = e.target.value;

                    setForm({
                      ...form,

                      statsSection: {
                        ...form.statsSection,

                        items: next,
                      },
                    });
                  }}
                />

                <button
                  type='button'
                  className='text-red-600 text-sm'
                  onClick={() => {
                    const next = [...(form.statsSection?.items || [])];

                    next.splice(idx, 1);

                    setForm({
                      ...form,

                      statsSection: {
                        ...form.statsSection,

                        items: next,
                      },
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border rounded-2xl bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>
            About the Programme
          </h2>

          <div className='space-y-5'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                RichText Editor
              </label>

              <RichTextEditor
                value={form.aboutSection?.content || ""}
                onChange={(value) =>
                  setForm({
                    ...form,
                    aboutSection: {
                      ...form.aboutSection,
                      content: value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className='border rounded-2xl bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>Initiatives</h2>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Section Toptag
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.ourInitiatives?.toptag || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  ourInitiatives: {
                    ...form.ourInitiatives,
                    toptag: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Section Title
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.ourInitiatives?.title || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  ourInitiatives: {
                    ...form.ourInitiatives,
                    title: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Cards</label>

              <button
                type='button'
                className='px-3 py-1 rounded border text-sm'
                onClick={() =>
                  setForm({
                    ...form,
                    ourInitiatives: {
                      ...form.ourInitiatives,
                      items: [
                        ...(form.ourInitiatives?.items || []),
                        {
                          count: "",
                          labeltitle: "",
                          labelcontent: "",
                        },
                      ],
                    },
                  })
                }
              >
                Add Card
              </button>
            </div>

            {(form.ourInitiatives?.items || []).map((item, idx) => (
              <div key={idx} className='border rounded-xl p-4 space-y-3'>
                <input
                  placeholder='Label Title (Example: Bal Shiksha Scholarship)'
                  className='border rounded p-2 w-full'
                  value={item.title || ""}
                  onChange={(e) => {
                    const next = [...(form.ourInitiatives?.items || [])];

                    next[idx].title = e.target.value;

                    setForm({
                      ...form,

                      ourInitiatives: {
                        ...form.ourInitiatives,

                        items: next,
                      },
                    });
                  }}
                />

                <input
                  placeholder='Label Content (Example: Annual fees, books and uniforms...)'
                  className='border rounded p-2 w-full'
                  value={item.description || ""}
                  onChange={(e) => {
                    const next = [...(form.ourInitiatives?.items || [])];

                    next[idx].description = e.target.value;

                    setForm({
                      ...form,

                      ourInitiatives: {
                        ...form.ourInitiatives,

                        items: next,
                      },
                    });
                  }}
                />

                <button
                  type='button'
                  className='text-red-600 text-sm'
                  onClick={() => {
                    const next = [...(form.ourInitiatives?.items || [])];

                    next.splice(idx, 1);

                    setForm({
                      ...form,

                      ourInitiatives: {
                        ...form.ourInitiatives,

                        items: next,
                      },
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Tiers */}

      <div className='border rounded-2xl bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Support Tiers
          </h2>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Section Title
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.supportTiers?.title || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  supportTiers: {
                    ...form.supportTiers,
                    title: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Section Subtitle
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.supportTiers?.subtitle || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  supportTiers: {
                    ...form.supportTiers,
                    subtitle: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Cards</label>

              <button
                type='button'
                className='px-3 py-1 rounded border text-sm'
                onClick={() =>
                  setForm({
                    ...form,
                    supportTiers: {
                      ...form.supportTiers,
                      items: [
                        ...(form.supportTiers?.items || []),
                        {
                          amount: "",
                          content: "",
                        },
                      ],
                    },
                  })
                }
              >
                Add Card
              </button>
            </div>

            {(form.supportTiers?.items || []).map((item, idx) => (
              <div key={idx} className='border rounded-xl p-4 space-y-3'>
                <input
                  placeholder='Amount'
                  className='border rounded p-2 w-full'
                  value={item.amount || ""}
                  onChange={(e) => {
                    const next = [...(form.supportTiers?.items || [])];

                    next[idx].amount = e.target.value;

                    setForm({
                      ...form,

                      supportTiers: {
                        ...form.supportTiers,

                        items: next,
                      },
                    });
                  }}
                />

                <input
                  placeholder='Content'
                  className='border rounded p-2 w-full'
                  value={item.content || ""}
                  onChange={(e) => {
                    const next = [...(form.supportTiers?.items || [])];

                    next[idx].content = e.target.value;

                    setForm({
                      ...form,

                      supportTiers: {
                        ...form.supportTiers,

                        items: next,
                      },
                    });
                  }}
                />

                <button
                  type='button'
                  className='text-red-600 text-sm'
                  onClick={() => {
                    const next = [...(form.supportTiers?.items || [])];

                    next.splice(idx, 1);

                    setForm({
                      ...form,

                      supportTiers: {
                        ...form.supportTiers,

                        items: next,
                      },
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border rounded-2xl bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>How It works</h2>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Section Title
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.howItWorks?.title || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  howItWorks: {
                    ...form.howItWorks,
                    title: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Steps</label>

              <button
                type='button'
                className='px-3 py-1 rounded border text-sm'
                onClick={() =>
                  setForm({
                    ...form,
                    howItWorks: {
                      ...form.howItWorks,
                      items: [
                        ...(form.howItWorks?.items || []),
                        {
                          content: "",
                        },
                      ],
                    },
                  })
                }
              >
                Add
              </button>
            </div>

            {(form.howItWorks?.items || []).map((item, idx) => (
              <div key={idx} className='border rounded-xl p-4 space-y-3'>
                <input
                  placeholder='Steps'
                  className='border rounded p-2 w-full'
                  value={item.content || ""}
                  onChange={(e) => {
                    const next = [...(form.howItWorks?.items || [])];

                    next[idx].content = e.target.value;

                    setForm({
                      ...form,

                      howItWorks: {
                        ...form.howItWorks,

                        items: next,
                      },
                    });
                  }}
                />

                <button
                  type='button'
                  className='text-red-600 text-sm'
                  onClick={() => {
                    const next = [...(form.howItWorks?.items || [])];

                    next.splice(idx, 1);

                    setForm({
                      ...form,

                      howItWorks: {
                        ...form.howItWorks,

                        items: next,
                      },
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border rounded-2xl bg-white p-6 shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Volunteers Section
          </h2>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Section Title
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.VolunteerSec?.title || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  VolunteerSec: {
                    ...form.VolunteerSec,
                    title: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Section TopTag
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.VolunteerSec?.toptag || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  VolunteerSec: {
                    ...form.VolunteerSec,
                    toptag: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Section Content
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.VolunteerSec?.content || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  VolunteerSec: {
                    ...form.VolunteerSec,
                    content: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Left Image</label>

            <div className='space-y-3'>
              {form.VolunteerSec?.image && (
                <div className='w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-slate-100'>
                  <img
                    src={form.VolunteerSec?.image}
                    alt='Cover'
                    className='w-full h-full object-cover'
                  />
                </div>
              )}

              <button
                type='button'
                onClick={() => setPickerOpen(true)}
                className='px-4 py-2 rounded border bg-white hover:bg-slate-50'
              >
                {form.VolunteerSec?.image ? "Change Image" : "Choose Image"}
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Button Text
            </label>

            <input
              className='border rounded p-2 w-full'
              value={form.VolunteerSec?.buttontext || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  VolunteerSec: {
                    ...form.VolunteerSec,
                    buttontext: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Button Link
            </label>

            <input
              type='url'
              placeholder='https://example.com'
              className='border rounded p-2 w-full'
              value={form.VolunteerSec?.buttonlink || ""}
              onChange={(e) =>
                setForm({
                  ...form,

                  VolunteerSec: {
                    ...form.VolunteerSec,

                    buttonlink: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
