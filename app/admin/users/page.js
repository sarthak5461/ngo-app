"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MoreVertical } from "lucide-react";
import { ROLES, ROLE_LABELS, ROLE_PERMISSIONS } from "@/lib/auth/rbac";
import UserDialog from "@/components/admin/user-dialog";
import { toast } from "sonner";
import ActionMenu from "@/components/admin/action-menu";
import { useAdmin } from "@/components/admin/admin-context";
import ResetPasswordDialog from "@/components/admin/reset-password-dialog";
import DeleteUserDialog from "@/components/admin/delete-user-dialog";

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [passwordUser, setPasswordUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingSelf, setIsEditingSelf] = useState(false);

  const admin = useAdmin();
  console.log(admin);

  async function loadUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/users");

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setRows(data.rows || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-[Playfair_Display] text-3xl font-bold text-slate-900'>
            User Management
          </h1>

          <p className='text-slate-500 mt-1'>
            Admins of this dashboard and their roles.
          </p>
        </div>

        <button
          onClick={() => setDialogOpen(true)}
          className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'
        >
          + New User
        </button>
      </div>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-0'>
          <div className='p-5 border-b'>
            <h3 className='font-bold text-slate-900'>Active admins</h3>
          </div>
          <div className='overflow-x-auto'>
            {loading ? (
              <div className='py-12 flex justify-center'>
                <ShieldCheck className='w-6 h-6 animate-pulse text-slate-400' />
              </div>
            ) : (
              <table className='w-full text-sm'>
                <thead className='bg-slate-50 text-slate-600'>
                  <tr>
                    <th className='text-left font-semibold px-4 py-3'>Name</th>
                    <th className='text-left font-semibold px-4 py-3'>Email</th>
                    <th className='text-left font-semibold px-4 py-3'>Role</th>
                    <th className='text-left font-semibold px-4 py-3'>
                      Status
                    </th>
                    <th className='text-left font-semibold px-4 py-3'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => {
                    const isSelf = admin?.userId === u._id;

                    return (
                      <tr key={u._id} className='border-t'>
                        <td className='px-4 py-3'>
                          <div className='flex items-center gap-3'>
                            <div className='w-9 h-9 rounded-full gradient-trust text-white flex items-center justify-center font-bold text-xs'>
                              {(u.name || u.email)
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <span className='font-medium'>{u.name}</span>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-slate-600'>{u.email}</td>
                        <td className='px-4 py-3'>
                          <Badge className='bg-blue-100 text-blue-800 border-blue-200'>
                            {ROLE_LABELS[u.role]}
                          </Badge>
                        </td>
                        <td className='px-4 py-3'>
                          <Badge
                            className={
                              u.status === "active"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {u.status}
                          </Badge>
                        </td>
                        <td className='px-4 py-3'>
                          <ActionMenu>
                            <button
                              className='w-full text-left px-4 py-2 hover:bg-slate-100 text-sm'
                              onClick={() => {
                                setSelectedUser(u);
                                setIsEditingSelf(isSelf);
                                setDialogOpen(true);
                              }}
                            >
                              Edit User
                            </button>

                            <button
                              className='w-full text-left px-4 py-2 hover:bg-slate-100 text-sm'
                              onClick={() => {
                                setPasswordUser(u);
                                setPasswordDialogOpen(true);
                              }}
                            >
                              Reset Password
                            </button>

                            <div className='border-t my-1' />

                            {!isSelf && (
                              <button
                                className='w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm'
                                onClick={() => {
                                  setDeleteUser(u);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                Delete User
                              </button>
                            )}
                          </ActionMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className='border-0 shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <ShieldCheck className='w-5 h-5 text-blue-800' />
            <h3 className='font-bold text-slate-900'>RBAC role definitions</h3>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            {Object.values(ROLES).map((role) => (
              <div
                key={role}
                className='border border-slate-200 rounded-lg p-4'
              >
                <div className='flex items-center justify-between mb-2'>
                  <strong className='text-slate-900'>
                    {ROLE_LABELS[role]}
                  </strong>
                  <Badge variant='secondary' className='text-[10px]'>
                    {(ROLE_PERMISSIONS[role] || []).length} perms
                  </Badge>
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {(ROLE_PERMISSIONS[role] || []).slice(0, 6).map((p) => (
                    <span
                      key={p}
                      className='text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono'
                    >
                      {p}
                    </span>
                  ))}
                  {(ROLE_PERMISSIONS[role] || []).length > 6 && (
                    <span className='text-[10px] text-slate-500'>
                      +{(ROLE_PERMISSIONS[role] || []).length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UserDialog
        open={dialogOpen}
        initialData={selectedUser}
        isEditingSelf={isEditingSelf}
        onClose={() => {
          setDialogOpen(false);
          setSelectedUser(null);
        }}
        onSave={async (form, editingUser) => {
          try {
            const url = editingUser
              ? `/api/admin/users/${editingUser._id}`
              : "/api/admin/users";

            const method = editingUser ? "PUT" : "POST";

            const res = await fetch(url, {
              method,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error);
            }
            toast.success(
              editingUser
                ? "User updated successfully!"
                : "User created successfully!",
            );

            setDialogOpen(false);

            loadUsers();

            // We'll refresh the table in the next step.
          } catch (err) {
            console.error(err);
          }
        }}
      />

      <ResetPasswordDialog
        open={passwordDialogOpen}
        user={passwordUser}
        onClose={() => {
          setPasswordDialogOpen(false);
          setPasswordUser(null);
        }}
        onSave={async ({ password, user }) => {
          try {
            const res = await fetch(`/api/admin/users/${user._id}/password`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                password,
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error);
            }

            toast.success("Password reset successfully.");

            setPasswordDialogOpen(false);
            setPasswordUser(null);
          } catch (err) {
            toast.error(err.message);
            console.error(err);
          }
        }}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        user={deleteUser}
        loading={deleting}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteUser(null);
        }}
        onDelete={async (user) => {
          try {
            setDeleting(true);

            const res = await fetch(`/api/admin/users/${user._id}`, {
              method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error);
            }

            toast.success("User deleted successfully.");

            setDeleteDialogOpen(false);
            setDeleteUser(null);

            loadUsers();
          } catch (err) {
            toast.error(err.message);
            console.error(err);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}
