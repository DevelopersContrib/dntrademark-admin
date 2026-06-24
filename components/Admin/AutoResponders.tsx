"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FaPlus,
  FaPenToSquare,
  FaTrash,
  FaPaperPlane,
  FaFlask,
  FaCircleNotch,
  FaXmark,
  FaEnvelopeOpenText,
} from "react-icons/fa6";
import LoadingRipple from "../Loading/LoadingRipple";

type AutoTrigger = "welcome" | "manual";
type AutoAudience = "all" | "emailable" | "admins";

interface Autoresponder {
  id: number;
  name: string;
  subject: string;
  body: string;
  trigger_event: AutoTrigger;
  audience: AutoAudience;
  is_active: number;
  send_count: number;
  last_sent_at: string | null;
}

interface FormState {
  id: number | null;
  name: string;
  subject: string;
  body: string;
  trigger_event: AutoTrigger;
  audience: AutoAudience;
  is_active: boolean;
}

const emptyForm: FormState = {
  id: null,
  name: "",
  subject: "",
  body: "<p>Hi there,</p>\n<p>Welcome to DNTrademark!</p>",
  trigger_event: "manual",
  audience: "emailable",
  is_active: true,
};

const TRIGGER_LABEL: Record<AutoTrigger, string> = {
  welcome: "On new user (welcome)",
  manual: "Manual / broadcast",
};

const AUDIENCE_LABEL: Record<AutoAudience, string> = {
  all: "All users",
  emailable: "Email opt-in only",
  admins: "Admins only",
};

const AutoResponders = ({ defaultTestEmail }: { defaultTestEmail?: string | null }) => {
  const [items, setItems] = useState<Autoresponder[]>([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [testFor, setTestFor] = useState<Autoresponder | null>(null);
  const [testEmail, setTestEmail] = useState(defaultTestEmail || "");
  const [broadcastFor, setBroadcastFor] = useState<Autoresponder | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/autoresponders", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setItems(data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(t);
  }, [flash]);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (a: Autoresponder) => {
    setForm({
      id: a.id,
      name: a.name,
      subject: a.subject,
      body: a.body,
      trigger_event: a.trigger_event,
      audience: a.audience,
      is_active: Number(a.is_active) === 1,
    });
    setFormError("");
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError("");
    try {
      const isEdit = form.id != null;
      const res = await fetch(
        isEdit ? `/api/admin/autoresponders/${form.id}` : "/api/admin/autoresponders",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            subject: form.subject,
            body: form.body,
            trigger_event: form.trigger_event,
            audience: form.audience,
            is_active: form.is_active,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
        return;
      }
      setModalOpen(false);
      setFlash({ type: "ok", msg: isEdit ? "Autoresponder updated." : "Autoresponder created." });
      load();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/autoresponders/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      setFlash(
        res.ok
          ? { type: "ok", msg: "Autoresponder deleted." }
          : { type: "err", msg: data.error || "Delete failed." },
      );
      setDeleteId(null);
      if (res.ok) load();
    } finally {
      setDeleting(false);
    }
  };

  const sendTest = async () => {
    if (!testFor) return;
    setBusyId(testFor.id);
    try {
      const res = await fetch("/api/admin/autoresponders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testFor.id, mode: "test", testEmail }),
      });
      const data = await res.json();
      setFlash(
        res.ok
          ? { type: "ok", msg: `Test email sent to ${data.to}.` }
          : { type: "err", msg: data.error || "Test send failed." },
      );
      if (res.ok) setTestFor(null);
    } finally {
      setBusyId(null);
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastFor) return;
    setBusyId(broadcastFor.id);
    try {
      const res = await fetch("/api/admin/autoresponders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: broadcastFor.id, mode: "broadcast" }),
      });
      const data = await res.json();
      setFlash(
        res.ok
          ? {
              type: data.failed ? "err" : "ok",
              msg: `Broadcast complete — ${data.sent} sent${data.failed ? `, ${data.failed} failed` : ""}.`,
            }
          : { type: "err", msg: data.error || "Broadcast failed." },
      );
      setBroadcastFor(null);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {flash ? (
        <div
          className={`mb-4 rounded-lg border-l-4 px-5 py-3 text-sm font-medium ${
            flash.type === "ok"
              ? "border-meta-3 bg-meta-3/10 text-meta-3"
              : "border-danger bg-danger/10 text-danger"
          }`}
        >
          {flash.msg}
        </div>
      ) : null}

      <div className="panel-card">
        <div className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">Email Autoresponders</h3>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              Automations delivered through Amazon SES. &quot;Welcome&quot; responders fire automatically
              when a new user is created; any responder can be broadcast on demand.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            New Autoresponder
          </button>
        </div>

        <div className="px-6 pb-6">
          {loading ? (
            <div className="flex w-full items-center justify-center py-10 text-[#c5c5c5]">
              <LoadingRipple />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stroke py-12 text-center dark:border-strokedark">
              <FaEnvelopeOpenText className="mb-3 h-8 w-8 text-body/50" />
              <p className="text-sm text-body dark:text-bodydark">
                No autoresponders yet. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {items.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col rounded-xl border border-stroke/70 bg-white p-5 shadow-card dark:border-strokedark/70 dark:bg-boxdark"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">{a.name}</h4>
                      <p className="mt-0.5 text-sm text-body dark:text-bodydark">{a.subject}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full py-1 px-3 text-xs font-medium ${
                        Number(a.is_active) === 1
                          ? "bg-meta-3/10 text-meta-3"
                          : "bg-gray-2 text-body dark:bg-meta-4 dark:text-bodydark"
                      }`}
                    >
                      {Number(a.is_active) === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-brand/10 py-1 px-3 font-medium text-brand">
                      {TRIGGER_LABEL[a.trigger_event]}
                    </span>
                    <span className="rounded-full bg-gray-2 py-1 px-3 font-medium text-body dark:bg-meta-4 dark:text-bodydark">
                      {AUDIENCE_LABEL[a.audience]}
                    </span>
                    <span className="rounded-full bg-gray-2 py-1 px-3 font-medium text-body dark:bg-meta-4 dark:text-bodydark">
                      Sent {a.send_count}×
                    </span>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-stroke/60 pt-4 dark:border-strokedark/60">
                    <button
                      onClick={() => {
                        setTestEmail(defaultTestEmail || "");
                        setTestFor(a);
                      }}
                      disabled={busyId === a.id}
                      className="inline-flex items-center gap-1.5 rounded-md border border-stroke py-1.5 px-3 text-xs font-medium text-black hover:border-primary hover:text-primary disabled:opacity-50 dark:border-strokedark dark:text-white"
                    >
                      <FaFlask className="h-3 w-3" /> Test
                    </button>
                    <button
                      onClick={() => setBroadcastFor(a)}
                      disabled={busyId === a.id}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary py-1.5 px-3 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {busyId === a.id ? (
                        <FaCircleNotch className="h-3 w-3 animate-spin" />
                      ) : (
                        <FaPaperPlane className="h-3 w-3" />
                      )}
                      Broadcast
                    </button>
                    <button
                      onClick={() => openEdit(a)}
                      className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded border border-[#eee] hover:border-primary hover:bg-primary hover:text-white"
                    >
                      <FaPenToSquare className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(a.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#eee] hover:border-danger hover:bg-danger hover:text-white"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {modalOpen ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-boxdark">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {form.id ? "Edit Autoresponder" : "New Autoresponder"}
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
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Name (internal)</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Welcome email"
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Welcome to DNTrademark"
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Trigger</label>
                <select
                  value={form.trigger_event}
                  onChange={(e) => setForm({ ...form, trigger_event: e.target.value as AutoTrigger })}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                >
                  <option value="manual">{TRIGGER_LABEL.manual}</option>
                  <option value="welcome">{TRIGGER_LABEL.welcome}</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                  Broadcast audience
                </label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value as AutoAudience })}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
                >
                  <option value="emailable">{AUDIENCE_LABEL.emailable}</option>
                  <option value="all">{AUDIENCE_LABEL.all}</option>
                  <option value="admins">{AUDIENCE_LABEL.admins}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                  Email body (HTML supported)
                </label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={9}
                  className="w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 font-mono text-sm outline-none focus:border-primary dark:bg-form-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  Active
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
                {form.id ? "Save changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Test send modal */}
      {testFor ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-boxdark">
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Send test email</h3>
            <p className="mb-4 text-sm text-body dark:text-bodydark">
              Send a single copy of &quot;{testFor.name}&quot; to verify formatting.
            </p>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="you@example.com"
              className="mb-6 w-full rounded-lg border-[1.5px] border-[#ddd] py-2 px-4 outline-none focus:border-primary dark:bg-form-input"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTestFor(null)}
                className="rounded-md border border-stroke py-2 px-6 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={sendTest}
                disabled={busyId === testFor.id}
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                {busyId === testFor.id ? <FaCircleNotch className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send test
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Broadcast confirm */}
      {broadcastFor ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-boxdark">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <FaPaperPlane className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Broadcast now?</h3>
            <p className="mb-6 text-sm text-body dark:text-bodydark">
              This sends &quot;{broadcastFor.name}&quot; to <strong>{AUDIENCE_LABEL[broadcastFor.audience]}</strong>{" "}
              via Amazon SES. This cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setBroadcastFor(null)}
                className="rounded-md border border-stroke py-2 px-6 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={sendBroadcast}
                disabled={busyId === broadcastFor.id}
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
              >
                {busyId === broadcastFor.id ? <FaCircleNotch className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send broadcast
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
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Delete autoresponder?</h3>
            <p className="mb-6 text-sm text-body dark:text-bodydark">This action cannot be undone.</p>
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

export default AutoResponders;
