"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Paper,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import * as z from "zod";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { Participante } from "@/models/participante.model";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { createOne, deleteById, findAll, update } from "@/app/api/crudBase";
import { FormDialog } from "@/components/dialogs/FormDialog";

const participantSchema = z.object({
  nome: z
    .string("Nome obrigatório")
    .min(1, "Nome obrigatório")
    .regex(
      /^([A-ZÁÉÍÓÚÃÕÂÊÎÔÛ][a-záéíóúãõâêîôûç]+)(\s[A-ZÁÉÍÓÚÃÕÂÊÎÔÛ][a-záéíóúãõâêîôûç]+)*$/,
      "O nome deve começar com letra maiúscula e conter apenas letras válidas"
    ),

  email: z.email("E-mail inválido").min(1, "E-mail obrigatório"),

  telefone: z
    .string("Telefone obrigatório")
    .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, "Telefone inválido"),
});
type ParticipantForm = z.infer<typeof participantSchema>;

const maskTelefone = (value: string) => {
  const nums = value.replace(/\D/g, "");

  if (nums.length <= 10)
    return nums
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);

  return nums
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

export default function ParticipantesPage() {
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Participante | null>(null);
  const [loading, setLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => Promise<void>>(
    async () => {}
  );

  const { showSnackbar } = useSnackbar();

  const load = async () => {
    setLoading(true);

    const result = await findAll<Participante>("participante");

    if (!result.success) showSnackbar("Erro ao buscar participantes", "error");

    setParticipants(result.data);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleTickets = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    setEditing(null);

    setOpenDialog(true);
  };

  const handleOpenEdit = (p: Participante) => {
    setEditing(p);
    setOpenDialog(true);
  };

  async function removeParticipante(participanteId: number) {
    const result = await deleteById(participanteId, "participante");

    result.success
      ? showSnackbar("Participante excluido", "success")
      : showSnackbar("Erro ao excluir participante", "error");

    if (result.success) load();
  }

  const handleDelete = (p: Participante) => {
    setConfirmTitle("Gerar tickets");
    setConfirmMessage(
      `Tem certeza que deseja excluir o participante "${p.nomeCompleto}"?`
    );

    setConfirmCallback(() => async () => {
      await removeParticipante(p.id);
    });

    setOpenConfirm(true);
  };

  const onSubmit = async (data: ParticipantForm) => {
    const newUser: Participante = {
      id: editing
        ? editing.id
        : participants.length
        ? Math.max(...participants.map((p) => p.id)) + 1
        : 1,
      nomeCompleto: data.nome,
      email: data.email,
      telefone: data.telefone,
      tickets: editing?.tickets ?? [],
    };

    const result = editing
      ? await update(newUser, "participante")
      : await createOne(newUser, "participante");

    result.success
      ? showSnackbar(
          `Participante ${editing ? "editado" : "criado"}!`,
          "success"
        )
      : showSnackbar(
          `Erro ao ${editing ? "editar" : "criar"} participante!`,
          "error"
        );

    if (!result.success) return;

    if (editing) {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                nomeCompleto: data.nome,
                email: data.email,
                telefone: data.telefone,
              }
            : p
        )
      );

      setEditing(null);
      setOpenDialog(false);

      return;
    }

    setParticipants((prev) => [...prev, newUser]);
    setOpenDialog(false);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <ConfirmDialog
        open={openConfirm}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Confirmar"
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmCallback}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        alignItems="center"
      >
        <Typography variant="h3">Participantes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Adicionar participante
        </Button>
      </Box>

      <Paper variant="outlined">
        {loading ? (
          <Box p={2}>
            <Typography>Carregando participantes...</Typography>
          </Box>
        ) : (
          <List>
            {participants.map((p, i) => {
              const isExpanded = expandedIds.includes(p.id);
              return (
                <React.Fragment key={p.id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton onClick={() => handleToggleTickets(p.id)}>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <IconButton onClick={() => handleOpenEdit(p)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(p)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={p.nomeCompleto}
                      secondary={
                        <>
                          <span>{p.email}</span>
                          <span style={{ marginLeft: 16 }}>{p.telefone}</span>
                        </>
                      }
                    />
                  </ListItem>
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Tickets de {p.nomeCompleto}
                      </Typography>
                      {p.tickets && p.tickets.length ? (
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Evento</TableCell>
                              <TableCell>Data Evento</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {p.tickets.map((t) => (
                              <TableRow key={t.id}>
                                <TableCell>{t.evento?.nome}</TableCell>
                                <TableCell>
                                  {t.evento?.dataEvento?.toUTCString()}
                                </TableCell>
                                <TableCell>{t.status}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Nenhum ticket para este participante.
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                  {i !== participants.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
            {!participants.length && !loading && (
              <Box p={2}>
                <Typography>Nenhum participante encontrado.</Typography>
              </Box>
            )}
          </List>
        )}
      </Paper>

      <FormDialog
        key={editing?.id ?? "new"}
        schema={participantSchema}
        inputs={[
          { name: "nome", label: "Nome" },
          { name: "email", label: "Email" },
          { name: "telefone", label: "Telefone", mask: maskTelefone },
        ]}
        isOpen={openDialog}
        isEditing={!!editing}
        initialValues={
          editing
            ? {
                nome: editing.nomeCompleto,
                email: editing.email,
                telefone: editing.telefone,
              }
            : undefined
        }
        onClose={() => {
          setOpenDialog(false);
          setEditing(null);
        }}
        onSubmit={onSubmit}
      />
    </Container>
  );
}
