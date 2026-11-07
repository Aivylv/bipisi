import ModalShell from './ModalShell';

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Ya',
  onConfirm,
  onCancel,
}) {
  return (
    <ModalShell
      title={title}
      onClose={onCancel}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </ModalShell>
  );
}