"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  Divider,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { InputDefault } from "@/components/inputs/InputDefault";
import { Evento } from "@/models/evento.model";
import { generateTickets } from "@/app/api/eventos/update";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { statusTicket } from "@/models/ticket.model";
import { createOne, deleteById, findAll, update } from "@/app/api/crudBase";

const eventSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  dataEvento: z.date({ message: "Data obrigatória" }),
  capacidadeTotal: z
    .number({ message: "Capacidade deve ser número" })
    .min(1, "Capacidade obrigatória"),
  local: z.string().min(1, "Local obrigatório"),
});

type EventForm = z.infer<typeof eventSchema>;

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => Promise<void>>(
    async () => {}
  );

  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      nome: "",
      dataEvento: new Date(),
      capacidadeTotal: 0,
      local: "",
    },
  });

  const load = async () => {
    setLoading(true);

    const result = await findAll<Evento>("evento");

    setLoading(false);

    if (!result.success) {
      showSnackbar("Erro ao buscar eventos", "error");

      return;
    }

    setEventos(result.data);
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

    reset({
      nome: "",
      dataEvento: new Date(),
      capacidadeTotal: 0,
      local: "",
    });

    setOpenDialog(true);
  };

  const handleOpenEdit = (evento: Evento) => {
    setEditing(evento);

    reset({
      nome: evento.nome,
      dataEvento: new Date(evento.dataEvento),
      capacidadeTotal: evento.capacidadeTotal,
      local: evento.local,
    });

    setOpenDialog(true);
  };

  const onSubmit = handleSubmit(async (data) => {
    const newEvent: Evento = {
      id: editing
        ? editing.id
        : eventos.length
        ? Math.max(...eventos.map((e) => e.id)) + 1
        : 1,
      nome: data.nome,
      dataEvento: data.dataEvento,
      capacidadeTotal: data.capacidadeTotal,
      local: data.local,
      tickets: editing?.tickets ?? [],
    };

    const result = editing
      ? await update(newEvent, "evento")
      : await createOne(newEvent, "evento");

    if (!result.success) {
      showSnackbar("Erro ao salvar evento", "error");
      return;
    }

    if (editing) {
      setEventos((prev) =>
        prev.map((e) => (e.id === editing.id ? newEvent : e))
      );

      showSnackbar("Evento atualizado!", "success");
    } else {
      setEventos((prev) => [...prev, newEvent]);

      showSnackbar("Evento criado!", "success");
    }

    setOpenDialog(false);
    setEditing(null);
  });

  async function generateEventTickets(eventoId: number) {
    const result = await generateTickets(eventoId);

    result.success
      ? showSnackbar("Tickets gerados com sucesso", "success")
      : showSnackbar("Erro ao gerar tickets do evento", "error");

    if (result.success) load();
  }

  const handleDefinirTickets = (evento: Evento) => {
    setConfirmTitle("Gerar tickets");

    setConfirmMessage(
      `Tem certeza que deseja gerar todos os tickets para o evento "${evento.nome}"?`
    );

    setConfirmCallback(() => async () => {
      await generateEventTickets(evento.id);
    });

    setOpenConfirm(true);
  };

  async function removeEvento(participanteId: number) {
    const result = await deleteById(participanteId, "evento");

    result.success
      ? showSnackbar("Evento excluido", "success")
      : showSnackbar("Erro ao excluir evento", "error");

    if (result.success) load();
  }

  const handleDelete = (e: Evento) => {
    setConfirmTitle("Excluir evento");
    setConfirmMessage(`Tem certeza que deseja excluir o evento "${e.nome}"?`);

    setConfirmCallback(() => async () => {
      await removeEvento(e.id);
    });

    setOpenConfirm(true);
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
        <Typography variant="h3">Eventos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Adicionar evento
        </Button>
      </Box>

      <Paper variant="outlined">
        {loading ? (
          <Box p={2}>
            <Typography>Carregando eventos...</Typography>
          </Box>
        ) : (
          <List>
            {eventos?.map((ev, i) => {
              const hoje = new Date();
              const podeDefinirTickets =
                (!ev.tickets || ev.tickets.length === 0) &&
                new Date(ev.dataEvento) >= hoje;

              const isExpanded = expandedIds.includes(ev.id);
              const filteredTickets =
                ev.tickets?.filter(
                  (t) => statusFilter === "Todos" || t.status === statusFilter
                ) ?? [];

              return (
                <React.Fragment key={ev.id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton onClick={() => handleToggleTickets(ev.id)}>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        {podeDefinirTickets && (
                          <IconButton
                            onClick={() => handleDefinirTickets(ev)}
                            title="Definir tickets"
                          >
                            <ConfirmationNumberOutlinedIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => handleOpenEdit(ev)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(ev)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <Typography variant="h6" color="primary">
                          {ev.nome}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LocationPinIcon fontSize="small" /> {ev.local}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography color="textSecondary">
                          {new Date(ev.dataEvento).toLocaleDateString("pt-BR")}
                        </Typography>
                        <Typography color="textSecondary">
                          Capacidade: {ev.capacidadeTotal}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Typography variant="h6">Tickets do Evento</Typography>
                        <TextField
                          select
                          label="Filtrar por Status"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          size="small"
                          sx={{ minWidth: 150 }}
                        >
                          <MenuItem value="Todos">Todos</MenuItem>
                          {Object.values(statusTicket).map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      {filteredTickets.length > 0 ? (
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Participante</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Data Emissão</TableCell>
                              <TableCell>Data Uso</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredTickets.map((t) => (
                              <TableRow key={t.id}>
                                <TableCell>
                                  {t.participante?.nomeCompleto ?? "N/A"}
                                </TableCell>
                                <TableCell>{t.status}</TableCell>
                                <TableCell>
                                  {new Date(t.dataEmissao).toLocaleDateString(
                                    "pt-BR"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t.dataUso
                                    ? new Date(t.dataUso).toLocaleDateString(
                                        "pt-BR"
                                      )
                                    : "Não utilizado"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Nenhum ticket encontrado para este evento com o filtro
                          selecionado.
                        </Typography>
                      )}
                    </Box>
                  </Collapse>

                  {i !== eventos.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
            {!eventos?.length && !loading && (
              <Box p={2}>
                <Typography>Nenhum evento encontrado.</Typography>
              </Box>
            )}
          </List>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditing(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editing ? "Editar evento" : "Novo evento"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <Controller
              name="nome"
              control={control}
              render={({ field, fieldState }) => (
                <InputDefault
                  title="Nome"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="dataEvento"
              control={control}
              render={({ field, fieldState }) => (
                <InputDefault
                  type="date"
                  title="Data do evento"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="capacidadeTotal"
              control={control}
              render={({ field, fieldState }) => (
                <InputDefault
                  type="text"
                  title="Capacidade total"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    return field.onChange(Number(val));
                  }}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="local"
              control={control}
              render={({ field, fieldState }) => (
                <InputDefault
                  title="Local"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditing(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={isSubmitting}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
