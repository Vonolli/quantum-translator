const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock quantum analysis function
function analyzeQuantumPotential(problemText) {
  const keywords = {
    optimization: ['optimize', 'minimize', 'maximize', 'best', 'optimal'],
    search: ['search', 'find', 'locate', 'discover'],
    simulation: ['simulate', 'model', 'predict', 'behavior'],
    cryptography: ['encrypt', 'decrypt', 'secure', 'key', 'cipher']
  };

  let category = 'general';
  let speedup = '2-4x';
  
  const lowerText = problemText.toLowerCase();
  
  if (keywords.optimization.some(kw => lowerText.includes(kw))) {
    category = 'optimization';
    speedup = '10-100x';
  } else if (keywords.search.some(kw => lowerText.includes(kw))) {
    category = 'search';
    speedup = '2-10x (quadratic speedup)';
  } else if (keywords.simulation.some(kw => lowerText.includes(kw))) {
    category = 'simulation';
    speedup = '100-1000x';
  } else if (keywords.cryptography.some(kw => lowerText.includes(kw))) {
    category = 'cryptography';
    speedup = 'Exponential (breaks RSA)';
  }

  return { category, speedup };
}

// Main translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem || problem.trim().length === 0) {
      return res.status(400).json({ error: 'Problem text is required' });
    }

    // Analyze the problem
    const { category, speedup } = analyzeQuantumPotential(problem);

    // Generate responses based on category
    const responses = {
      optimization: {
        classical: `This is a combinatorial optimization problem. Classically, you would test different combinations systematically or use heuristics like genetic algorithms or simulated annealing. For large problem spaces, this becomes exponentially slow.`,
        quantum: `Reformulate as a Quadratic Unconstrained Binary Optimization (QUBO) problem. Use quantum annealing or QAOA (Quantum Approximate Optimization Algorithm) to explore the solution space. Encode constraints in the cost function and let quantum superposition evaluate multiple solutions simultaneously.`,
        speedup: `Estimated speedup: ${speedup} for problems with 100+ variables`
      },
      search: {
        classical: `Classical search algorithms iterate through possibilities one by one or use divide-and-conquer strategies. For unsorted databases, you'd need O(N) operations on average.`,
        quantum: `Apply Grover's Algorithm to search unsorted databases. Encode search criteria into an oracle function that marks the target state. Amplitude amplification increases probability of measuring the correct answer.`,
        speedup: `Estimated speedup: ${speedup} - searching N items takes √N quantum operations`
      },
      simulation: {
        classical: `Simulating quantum systems classically requires exponential resources. Each additional quantum particle doubles the state space complexity.`,
        quantum: `Use quantum computers to directly simulate quantum systems. Map physical qubits to simulated qubits, apply Hamiltonian evolution operators, and measure observables directly.`,
        speedup: `Estimated speedup: ${speedup} for quantum chemistry and materials science problems`
      },
      cryptography: {
        classical: `Current encryption relies on the difficulty of factoring large numbers (RSA) or discrete logarithm problems. Classical computers would take millions of years to break 2048-bit RSA.`,
        quantum: `Implement Shor's Algorithm to factor large numbers efficiently. Use quantum Fourier transform and period-finding to determine factors in polynomial time.`,
        speedup: `Estimated speedup: ${speedup} encryption with sufficient qubits`
      },
      general: {
        classical: `This problem can be solved using traditional computational methods with standard algorithms and data structures.`,
        quantum: `Analyze if the problem involves: (1) searching large spaces, (2) optimization with many constraints, (3) simulation of quantum systems, or (4) number theory problems. If so, quantum approaches may help. Otherwise, classical methods may be more efficient.`,
        speedup: `Estimated speedup: ${speedup} depending on problem structure`
      }
    };

    const result = responses[category];

    res.json({
      classical: result.classical,
      quantum: result.quantum,
      speedup: result.speedup,
      category: category
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Quantum Translator API' });
});

app.listen(PORT, () => {
  console.log(`Quantum Translator API running on port ${PORT}`);
});
