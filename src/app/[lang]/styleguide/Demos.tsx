"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import type { Dictionary } from "@/lib/dictionaries";

type Labels = Dictionary["styleguide"];

export function ButtonDemo({ s, loadingText }: { s: Labels; loadingText: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">{s.primary}</Button>
        <Button variant="secondary">{s.secondary}</Button>
        <Button variant="ghost">{s.ghost}</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">{s.small}</Button>
        <Button size="md">{s.medium}</Button>
        <Button size="lg">{s.large}</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button loading={loading} loadingLabel={loadingText}>
          {loading ? s.sending : s.loadingBtn}
        </Button>
        <Button variant="secondary" loading={loading} loadingLabel={loadingText}>
          {loading ? s.sending : s.loadingBtn}
        </Button>
        <Button disabled>{s.disabled}</Button>
        <Button variant="ghost" onClick={() => setLoading((value) => !value)}>
          {s.toggleLoading}
        </Button>
      </div>
    </div>
  );
}

export function FormDemo({ s }: { s: Labels }) {
  const [showError, setShowError] = useState(true);

  return (
    <div className="grid max-w-xl gap-5">
      <Input label={s.nameLabel} helperText={s.nameHelp} autoComplete="name" />
      <Input
        label={s.phoneLabel}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        error={showError ? s.phoneError : undefined}
      />
      <Select label={s.itemLabel} defaultValue="frame">
        <option value="frame">{s.itemFrame}</option>
        <option value="mug">{s.itemMug}</option>
        <option value="tshirt">{s.itemTshirt}</option>
      </Select>
      <Textarea label={s.messageLabel} helperText={s.messageHelp} />
      <div>
        <Button variant="secondary" onClick={() => setShowError((value) => !value)}>
          {s.validate}
        </Button>
      </div>
    </div>
  );
}

export function ModalDemo({ s, closeLabel }: { s: Labels; closeLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{s.openModal}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={s.modalTitle}
        closeLabel={closeLabel}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>{s.modalConfirm}</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {s.modalCancel}
            </Button>
          </>
        }
      >
        <p className="text-lg">{s.modalBody}</p>
      </Modal>
    </>
  );
}

export function ToastDemo({ s }: { s: Labels }) {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast.success(s.toastSuccessMsg)}>
        {s.toastSuccess}
      </Button>
      <Button variant="secondary" onClick={() => toast.error(s.toastErrorMsg)}>
        {s.toastError}
      </Button>
      <Button variant="secondary" onClick={() => toast.info(s.toastInfoMsg)}>
        {s.toastInfo}
      </Button>
    </div>
  );
}
