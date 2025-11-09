import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function ConfirmDialog({
  open,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {message && (
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={async () => {
            await onConfirm();
            onClose();
          }}
          variant="contained"
          color="primary"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
