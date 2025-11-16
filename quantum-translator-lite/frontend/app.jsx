
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const body = req.body;

  const prompt = `
You are a Quantum Translator. 
Translate the user’s problem into:
1) Classical description (short)
2) Quantum-friendly formulation (QUBO/Ising/etc)
3) Theoretical speedup (realistic)
4) ASCII quantum circuit preview (small, <= 4 qubits)
5) Routing recommendation (good fit / maybe / not fit)

Return strict JSON fields:
{
  "classical_description": "...",
  "quantum_formulation": "...",
  "speedup": "...",
  "routing": "...",
  "circuit": "..."
}

User problem:
${body.text}
`;

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    max_output_tokens: 900
  });

  const json = JSON.parse(completion.output_text);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(json);
}
