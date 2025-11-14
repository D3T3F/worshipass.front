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
import { useSnackbar } from "@/contexts/SnackbarContext";
import { Evento } from "@/models/evento.model";
import { generateTickets, setTicketsUsed } from "@/app/api/eventos";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Ticket, statusTicket } from "@/models/ticket.model";
import { createOne, deleteById, findAll, update } from "@/app/api/crudBase";
import { FormDialog } from "@/components/dialogs/FormDialog";
import { Lanche } from "@/models/lanche.model";
import { Participante } from "@/models/participante.model";
import { onlyThisFieldFilled } from "@/utils/object";
import { EventAvailable } from "@mui/icons-material";

const eventSchema = z.object({
  nome: z.string("Nome obrigatório").min(1, "Nome obrigatório"),
  dataEvento: z.coerce.date("Data obrigatória"),
  capacidadeTotal: z
    .number("Capacidade deve ser número")
    .min(1, "Capacidade obrigatória"),
  local: z.string("Local obrigatório").min(1, "Local obrigatório"),
});

const ticketSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
  dataUso: z.coerce.date().optional().nullable(),
  participante: z.string("Selecione o participante"),
  lanche: z.string("Selecione o lanche"),
});

type EventForm = z.infer<typeof eventSchema>;
type TicketForm = z.infer<typeof ticketSchema>;

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [lanches, setLanches] = useState<Lanche[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  const [openEventoDialog, setOpenEventoDialog] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => Promise<void>>(
    async () => {}
  );

  const { showSnackbar } = useSnackbar();

  async function loadEventos() {
    const result = await findAll<Evento>("evento");

    if (!result.success) {
      showSnackbar("Erro ao buscar eventos", "error");
      return;
    }

    setEventos(result.data);
  }

  async function loadParticipantes() {
    const result = await findAll<Participante>("participante");

    if (!result.success) {
      showSnackbar("Erro ao buscar participantes", "error");
      return;
    }

    setParticipantes(result.data);
  }

  async function loadLanches() {
    const result = await findAll<Lanche>("lanche");

    if (!result.success) {
      showSnackbar("Erro ao buscar lanches", "error");
      return;
    }

    setLanches(result.data);
  }

  const load = async () => {
    setLoading(true);

    loadParticipantes();
    loadLanches();
    await loadEventos();

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

  const handleOpenCreateEvento = () => {
    setEditingEvento(null);
    setOpenEventoDialog(true);
  };

  const handleOpenEditEvento = (evento: Evento) => {
    setEditingEvento(evento);
    setOpenEventoDialog(true);
  };

  const onEventoSubmit = async (data: EventForm) => {
    const newEvent: Evento = {
      id: editingEvento
        ? editingEvento.id
        : eventos.length
        ? Math.max(...eventos.map((e) => e.id)) + 1
        : 1,
      nome: data.nome,
      dataEvento: data.dataEvento,
      capacidadeTotal: data.capacidadeTotal,
      local: data.local,
      tickets: editingEvento?.tickets ?? [],
    };

    const result = editingEvento
      ? await update(newEvent, "evento")
      : await createOne(newEvent, "evento");

    if (!result.success) {
      showSnackbar("Erro ao salvar evento", "error");
      return;
    }

    showSnackbar(
      editingEvento ? "Evento atualizado!" : "Evento criado!",
      "success"
    );
    setOpenEventoDialog(false);
    setEditingEvento(null);
    load();
  };

  const handleOpenEditTicket = (ticket: Ticket, evento: Evento) => {
    setEditingTicket({ ...ticket, evento });
    setOpenTicketDialog(true);
  };

  const onTicketSubmit = async (data: TicketForm) => {
    if (!editingTicket) return;

    if (onlyThisFieldFilled(data, "participante"))
      data.status = statusTicket.reservado;

    const updatedTicket: Ticket = {
      ...editingTicket,
      status: data.status ?? editingTicket.status,
      dataUso: data.dataUso ?? editingTicket.dataUso,
      participante:
        participantes?.find((p) => p.id.toString() === data.participante) ??
        editingTicket.participante,
    };

    const result = await update(updatedTicket, "ticket");

    if (!result.success) {
      showSnackbar("Erro ao atualizar ticket", "error");
      return;
    }

    showSnackbar("Ticket atualizado com sucesso!", "success");
    setOpenTicketDialog(false);
    setEditingTicket(null);
    load();
  };

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

  async function removeEvento(eventoId: number) {
    const result = await deleteById(eventoId, "evento");
    result.success
      ? showSnackbar("Evento excluido", "success")
      : showSnackbar("Erro ao excluir evento", "error");
    if (result.success) load();
  }

  const handleDeleteEvento = (e: Evento) => {
    setConfirmTitle("Excluir evento");
    setConfirmMessage(`Tem certeza que deseja excluir o evento "${e.nome}"?`);
    setConfirmCallback(() => async () => {
      await removeEvento(e.id);
    });
    setOpenConfirm(true);
  };

  async function setTickets(eventoId: number) {
    const result = await setTicketsUsed(eventoId);

    result.success
      ? showSnackbar("Tickets gerados com sucesso", "success")
      : showSnackbar("Erro ao gerar tickets do evento", "error");

    if (result.success) load();
  }

  async function setAllTicketsUsed(evento: Evento) {
    setConfirmTitle(
      `Tem certeza que deseja definir todos os tickets para o evento "${evento.nome}"?`
    );
    setConfirmMessage(
      `Ao clicar em confirmar, todos os tickets que possuam usuários vinculados serão definidos como "Usados" e os que não possuem como "Cancelados".`
    );
    setConfirmCallback(() => async () => {
      await setTickets(evento.id);
    });
    setOpenConfirm(true);
  }

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
          onClick={handleOpenCreateEvento}
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

              const dataEvento = new Date(ev.dataEvento);

              const mesmoDia =
                dataEvento.getDate() === hoje.getDate() &&
                dataEvento.getMonth() === hoje.getMonth() &&
                dataEvento.getFullYear() === hoje.getFullYear();

              const podeDefinirTickets =
                (!ev.tickets || ev.tickets.length === 0) && dataEvento >= hoje;

              const statusDisponiveis: string[] = [
                statusTicket.disponivel,
                statusTicket.reservado,
              ];

              const podeSetarStatus =
                ev.tickets &&
                ev.tickets.length > 0 &&
                mesmoDia &&
                statusDisponiveis.includes(ev.tickets[0].status);

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
                        <IconButton onClick={() => handleOpenEditEvento(ev)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteEvento(ev)}>
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
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap={2}
                        >
                          <Typography variant="h6">
                            Tickets do Evento
                          </Typography>
                          <IconButton
                            color="primary"
                            disabled={!podeSetarStatus}
                            title="Define evento como concluído e define tickets como usados/cancelados"
                            onClick={() => setAllTicketsUsed(ev)}
                          >
                            <EventAvailable />
                          </IconButton>
                        </Box>
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
                              <TableRow
                                key={t.id}
                                hover
                                onClick={() => handleOpenEditTicket(t, ev)}
                                sx={{ cursor: "pointer" }}
                              >
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
      <Box height={20}/>
      <FormDialog
        key={`evento-${editingEvento?.id ?? "new"}`}
        title={editingEvento ? "Editar Evento" : "Criar Novo Evento"}
        schema={eventSchema}
        inputs={[
          { name: "nome", label: "Nome" },
          { name: "dataEvento", label: "Data do evento", type: "date" },
          {
            name: "capacidadeTotal",
            label: "Capacidade total",
            type: "number",
          },
          { name: "local", label: "Local" },
        ]}
        isOpen={openEventoDialog}
        isEditing={!!editingEvento}
        initialValues={editingEvento ? editingEvento : undefined}
        onClose={() => {
          setOpenEventoDialog(false);
          setEditingEvento(null);
        }}
        onSubmit={onEventoSubmit}
      />
      <FormDialog
        key={`ticket-${editingTicket?.id}`}
        title="Editar Ticket"
        schema={ticketSchema}
        inputs={[
          {
            name: "status",
            label: "Status",
            type: "select",
            options: Object.values(statusTicket).map((s) => ({
              value: s,
              label: s,
            })),
            disabled: true,
          },
          {
            name: "dataUso",
            label: "Data de Uso",
            type: "date",
            disabled: true,
          },
          {
            name: "participante",
            label: "Participante",
            type: "select",
            options:
              participantes?.length > 0
                ? participantes
                    .filter((p) => {
                      const tickets = p.tickets;

                      return (
                        !tickets?.find(
                          (t) => t?.evento?.id === editingTicket?.evento?.id
                        ) || tickets.find((t) => t.id === editingTicket?.id)
                      );
                    })
                    .map((p) => ({
                      value: p.id.toString(),
                      label: p.nomeCompleto,
                    }))
                : [{ value: "", label: "" }],
            disabled: editingTicket?.status !== statusTicket.disponivel,
          },
          {
            name: "lanche",
            label: "Lanche",
            type: "select",
            options:
              lanches?.length > 0
                ? lanches.map((l) => ({
                    value: l.id.toString(),
                    label: l.nome,
                  }))
                : [{ value: "", label: "" }],
            disabled:
              !editingTicket?.participante ||
              !!editingTicket?.resgateLanche ||
              editingTicket.status !== statusTicket.usado,
          },
        ]}
        isOpen={openTicketDialog}
        isEditing={!!editingTicket}
        initialValues={
          editingTicket
            ? {
                ...editingTicket,
                dataUso: editingTicket.dataUso
                  ? new Date(editingTicket.dataUso)
                  : null,
                participante: editingTicket?.participante?.id.toString() ?? "",
                lanche: editingTicket?.participante?.id.toString() ?? "",
              }
            : undefined
        }
        onClose={() => {
          setOpenTicketDialog(false);
          setEditingTicket(null);
        }}
        onSubmit={onTicketSubmit}
      />
    </Container>
  );
}
