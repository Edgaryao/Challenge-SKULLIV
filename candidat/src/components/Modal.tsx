type ModalProps = {
  titre: string;
  message: string;
  onFermer: () => void;
};

function Modal({ titre, message, onFermer }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">{titre}</h2>

        <p className="mt-3 text-slate-600">{message}</p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onFermer}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 transition"
          >
            Compris
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
