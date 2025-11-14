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
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import * as z from "zod";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { Lanche } from "@/models/lanche.model";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { createOne, deleteById, findAll, update } from "@/app/api/crudBase";
import { FormDialog } from "@/components/dialogs/FormDialog";
import { formatDescription } from "@/utils/string";

const lancheSchema = z.object({
  nome: z.string("Nome obrigatório").min(1, "Nome obrigatório"),
  descricao: z.string("Descrição obrigatória").min(1, "Descrição obrigatória"),
  quantidadeDisponivel: z
    .number("Quantidade deve ser número")
    .min(0, "Quantidade não pode ser negativa"),
});

type LancheForm = z.infer<typeof lancheSchema>;

export default function LanchesPage() {
  const [lanches, setLanches] = useState<Lanche[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Lanche | null>(null);
  const [loading, setLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => Promise<void>>(
    async () => {}
  );

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { showSnackbar } = useSnackbar();

  const load = async () => {
    setLoading(true);

    const result = await findAll<Lanche>("lanche");

    if (!result.success) {
      showSnackbar("Erro ao buscar lanches", "error");
    }

    setLanches(result.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (lanche: Lanche) => {
    setEditing(lanche);
    setOpenDialog(true);
  };

  async function removeLanche(lancheId: number) {
    const result = await deleteById(lancheId, "lanche");

    result.success
      ? showSnackbar("Lanche excluído", "success")
      : showSnackbar("Erro ao excluir lanche", "error");

    if (result.success) load();
  }

  const handleDelete = (lanche: Lanche) => {
    setConfirmTitle("Excluir lanche");
    setConfirmMessage(
      `Tem certeza que deseja excluir o lanche "${lanche.nome}"?`
    );

    setConfirmCallback(() => async () => {
      await removeLanche(lanche.id);
    });

    setOpenConfirm(true);
  };

  const onSubmit = async (data: LancheForm) => {
    const newLanche: Lanche = {
      id: editing
        ? editing.id
        : lanches.length
        ? Math.max(...lanches.map((l) => l.id)) + 1
        : 1,
      nome: data.nome,
      descricao: data.descricao,
      quantidadeDisponivel: data.quantidadeDisponivel,
    };

    const result = editing
      ? await update(newLanche, "lanche")
      : await createOne(newLanche, "lanche");

    result.success
      ? showSnackbar(`Lanche ${editing ? "editado" : "criado"}!`, "success")
      : showSnackbar(
          `Erro ao ${editing ? "editar" : "criar"} lanche!`,
          "error"
        );

    if (!result.success) return;

    if (editing) {
      setLanches((prev) =>
        prev.map((l) =>
          l.id === editing.id
            ? {
                ...l,
                nome: data.nome,
                descricao: data.descricao,
                quantidadeDisponivel: data.quantidadeDisponivel,
              }
            : l
        )
      );

      setEditing(null);
      setOpenDialog(false);
      return;
    }

    setLanches((prev) => [...prev, newLanche]);
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
        <Typography variant="h3">Lanches</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Adicionar lanche
        </Button>
      </Box>

      <Paper variant="outlined">
        {loading ? (
          <Box p={2}>
            <Typography>Carregando lanches...</Typography>
          </Box>
        ) : (
          <List>
            {lanches.map((lanche, i) => (
              <React.Fragment key={lanche.id}>
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton onClick={() => handleOpenEdit(lanche)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(lanche)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={lanche.nome}
                    secondary={
                      <>
                        <span>{formatDescription(lanche.descricao, isMobile)}</span>
                        <span style={{ marginLeft: 16 }}>
                          Quantidade: {lanche.quantidadeDisponivel}
                        </span>
                      </>
                    }
                  />
                </ListItem>
                {i !== lanches.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {!lanches.length && !loading && (
              <Box p={2}>
                <Typography>Nenhum lanche encontrado.</Typography>
              </Box>
            )}
          </List>
        )}
      </Paper>

      <Box height={20} />

      <FormDialog
        key={editing?.id ?? "new"}
        title={editing ? "Editar Lanche" : "Criar Novo Lanche"}
        schema={lancheSchema}
        inputs={[
          { name: "nome", label: "Nome" },
          { name: "descricao", label: "Descrição" },
          {
            name: "quantidadeDisponivel",
            label: "Quantidade Disponível",
            type: "number",
          },
        ]}
        isOpen={openDialog}
        isEditing={!!editing}
        initialValues={editing ? editing : undefined}
        onClose={() => {
          setOpenDialog(false);
          setEditing(null);
        }}
        onSubmit={onSubmit}
      />
    </Container>
  );
}
