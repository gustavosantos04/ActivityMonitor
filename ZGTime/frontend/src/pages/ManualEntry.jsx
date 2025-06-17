import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 28rem;
  margin: 1.5rem auto;
  padding: 1.5rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  border-radius: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #111;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  margin-bottom: 1rem;
  font-weight: 600;
  color: ${({ error }) => (error ? "#b91c1c" : "#15803d")}; /* vermelho escuro / verde */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  outline-offset: 2px;

  &:focus {
    outline: 2px solid #111;
  }
`;

const TextArea = styled.textarea`
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  resize: none;
  outline-offset: 2px;

  &:focus {
    outline: 2px solid #111;
  }
`;

const Button = styled.button`
  background-color: #111;
  color: #fff;
  padding: 0.6rem 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #333;
  }
`;

export default function ManualEntry() {
  const [form, setForm] = useState({
    username: "",
    date: "",
    start_time: "",
    end_time: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/manual-entries/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage("Horas manuais cadastradas com sucesso!");
        setError(false);
        setForm({
          username: "",
          date: "",
          start_time: "",
          end_time: "",
          description: "",
        });
      } else {
        setMessage("Erro ao cadastrar, tente novamente.");
        setError(true);
      }
    } catch (error) {
      setMessage("Erro na comunicação com o servidor.");
      setError(true);
    }
  }

  return (
    <Container>
      <Title>Cadastro Manual de Horas</Title>
      {message && <Message error={error}>{message}</Message>}

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="Usuário"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="off"
        />

        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <Input
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <Input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <TextArea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <Button type="submit">Salvar</Button>
      </Form>
    </Container>
  );
}
