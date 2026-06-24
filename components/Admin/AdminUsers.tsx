"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FaPlus,
  FaPenToSquare,
  FaTrash,
  FaUserShield,
  FaCircleNotch,
  FaXmark,
} from "react-icons/fa6";
import LoadingRipple from "../Loading/LoadingRipple";

interface AdminUserRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  package_id: number | null;
  is_admin: number;
  allow_email: number;
  email_verified_at: string | null;
  created_at: string | null;
}

interface Stats {
  total: number;
  admins: number;
  verified: number;
  emailable: number;
}

interface FormState {
  id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_admin: boolean;
  allow_email: boolean;
  package_id: string;
}

const emptyForm: FormState = {
  id: null,
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  is_admin: false,
  allow_email: true,
  package_id: "",
};

const AdminUsers = ({ currentAdminId }: { currentAdminId: number }) => {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, admins: 0, verified: 0, emailable: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [flash, setFlash] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
        search,
        sortBy: "id",
        orderBy: "DESC",
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setRows(data.data || []);
        setStats(data.stats || stats);
        setLastPage(data.last_page || 1);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 3500);
    return () => clearTimeout(t);
  }, [flash]);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (u: AdminUserRow) => {
    setForm({
      id: u.id,
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      email: u.email || "",
      password: "",
      is_admin: Number(u.is_admin) === 1,
      allow_email: Number(u.allow_email) === 1,
      package_id: u.package_id == null ? "" : String(u.package_id),
    });
    setFormError("");
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        is_admin: form.is_admin,
        allow_email: form.allow_email,
        package_id: form.package_id === "" ? null : Number(form.package_id),
        ...(form.password ? { password: form.password } : {}),
      };

      const isEdit = form.id != null;
      const res = await fetch(isEdit ? `/api/admin/users/${form.id}` : "/api/admin/users", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
        return;
      }
      setModalOpen(false);
      setFlash(
        isEdit
          ? "User updated."
          : data.welcomeSent
            ? "User created and welcome email sent."
            : "User created.",
      );
      load();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setFlash("User deleted.");
        setDeleteId(null);
        load();
      } else {
        setFlash(data.error || "Delete failed.");
        setDeleteId(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {flash ? (
        <div className="mb-4 rounded-lg border-l-4 border-meta-3 bg-meta-3/10 px-5 py-3 text-sm font-medium text-meta-3">
          {flash}
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total users", value: stats.total },
          { label: "Admins", value: stats.admins },
          { label: "Verified", value: stats.verified },
          { label: "Email opt-in", value: stats.emailable },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-stroke/70 bg-white p-5 shadow-card dark:border-strokedark/70 dark:bg-boxdark"
          >
            <div className="text-2xl font-bold text-black dark:text-white">{s.value}</div>
            <div className="mt-1 text-sm text-body dark:text-bodydark">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="panel-card">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email…"
            className="w-full max-w-xs rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 font-medium outline-none transition focus:border-primary"
          />
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>

        <div className="max-w-full overflow-x-auto px-6 pb-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="table-th-header min-w-[60px]">ID</th>
                <th className="table-th-header min-w-[180px]">Name</th>
                <th className="table-th-header min-w-[220px]">Email</th>
                <th className="table-th-header min-w-[100px]">Role</th>
                <th className="table-th-header min-w-[100px]">Email opt-in</th>
                <th className="table-th-header min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} align="center">
                    <div className="flex w-full items-center justify-center py-6 text-[#c5c5c5]">
                      <LoadingRipple />
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-body dark:text-bodydark">
                    No users found.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id}>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <span className="text-body dark:text-bodydark">{u.id}</span>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <span className="font-medium text-black dark:text-white">
                        {`${u.first_name || ""} ${u.last_name || ""}`.trim() || "—"}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <span className="text-black dark:text-white">{u.email}</span>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      {Number(u.is_admin) === 1 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 py-1 px-3 text-xs font-medium text-brand">
                          <FaUserShield className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-2 py-1 px-3 text-xs font-medium text-body dark:bg-meta-4 dark:text-bodydark">
                          User
                        </span>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      {Number(u.allow_email) === 1 ? (
                        <span className="inline-flex rounded-full bg-meta-3/10 py-1 px-3 text-xs font-medium text-meta-3">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-danger/10 py-1 px-3 text-xs font-medium text-danger">
                          No
                        </span>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openEdit(u)}
                          title="Edit"
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#eee] hover:border-primary hover:bg-primary hover:text-white"
                        >
                          <FaPenToSquare className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(u.id)}
                          disabled={u.id === currentAdminId}
                          title={u.id === currentAdminId ? "You can't delete yourself" : "Delete"}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#eee] hover:border-danger hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex w-full items-center justify-between py-4">
            <div className="text-sm font-medium text-[#666] dark:text-white">
              Page {page} of {lastPage} · {total} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white disabled:opacity-40 dark:bg-graydark dark:text-white"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white disabled:opacity-40 dark:bg-graydark dark:text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      {modalOpen ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-boxdark">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {form.id ? "Edit User" : "Add User"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-body hover:text-black dark:hover:text-white">
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            {formError ? (
              <div className="mb-4 rounded-lg border-l-4 border-danger bg-danger/10 px-4 py-2 text-sm font-medium text-danger">
                {formError}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">First name</label>
                <input
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Last name</label>
                <input
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                  {form.id ? "New password (leave blank to keep)" : "Password"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Package ID</label>
                <input
                  type="number"
                  value={form.package_id}
                  onChange={(e) => setForm({ ...form, package_id: e.target.value })}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div className="flex items-end gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={form.is_admin}
                    onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
                  />
                  Admin
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={form.allow_email}
                    onChange={(e) => setForm({ ...form, allow_email: e.target.checked })}
                  />
                  Email opt-in
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md border border-stroke py-2 px-6 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                {saving ? <FaCircleNotch className="mr-2 h-4 w-4 animate-spin" /> : null}
                {form.id ? "Save changes" : "Create user"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete confirm */}
      {deleteId != null ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-boxdark">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <FaTrash className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Delete user?</h3>
            <p className="mb-6 text-sm text-body dark:text-bodydark">
              This permanently removes the user. This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-md border border-stroke py-2 px-6 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center rounded-md bg-danger py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                {deleting ? <FaCircleNotch className="mr-2 h-4 w-4 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminUsers;
