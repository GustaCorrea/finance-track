import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import './App.css';

interface Transactions{
  id: number;
  description: string;
  value: number;
  type: string;
  created_at: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transactions[]>([]);

  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('entrada');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    fetch('http://localhost:3333/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!description || !value) return;

    if(editingId){

      await fetch(`http://localhost:3333/transactions/${editingId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ description, value: Number(value), type, created_at: date })
    });

    setEditingId(null);

    } else {

      await fetch('http://localhost:3333/transactions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ description, value: Number(value), type, created_at: date })
      
    });
    }

    setDescription('');
    setValue('');
    setType('entrada');
    setDate(new Date().toISOString().split('T')[0]);
    loadData(); 
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que quer deletar essa transaçao?")) return;

    await fetch(`http://localhost:3333/transactions/${id}`, {
      method: 'DELETE',
    });

    loadData();
  }

  function handleEdit(item: Transactions) {
  // 1. Joga os dados do item para dentro dos inputs
  setDescription(item.description);
  setValue(String(item.value)); // Converte pra string pq o input espera texto
  setType(item.type);
  setDate(item.created_at.split('T')[0]); // Garante o formato da data (YYYY-MM-DD)
  
  // 2. Avisa o React que estamos editando ESSE id especifico
  setEditingId(item.id);
  }

  const saldo = transactions.reduce((acc, item) => {
    return item.type === 'entrada' ? acc + item.value : acc - item.value;
  }, 0);

  

  return (
    <div className="container">
      <h1>💰 Controle Financeiro</h1>

      {/* MOSTRADOR DE SALDO  */}
      <div style={{ 
          background: '#202024', 
          padding: '15px', 
          marginBottom: '20px', 
          borderRadius: '5px',
          border: '1px solid #333',
          textAlign: 'center'
      }}>
         <h2 style={{ margin: 0 }}>
            Saldo Total: 
            <span style={{ color: saldo >= 0 ? 'green' : 'red', marginLeft: '10px' }}>
              R$ {saldo.toFixed(2)}
            </span>
         </h2>
      </div>

      {/* --- FORMULÁRIO --- */}
      <form onSubmit={handleSubmit} style={{  display: 'flex', gap: '10px', margin: 'auto' }}>
        <input 
          type="text" 
          placeholder="Descrição (ex: Aluguel)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        
        <input 
          type="number" 
          placeholder="Valor (R$)"
          value={value}
          onChange={e => setValue(e.target.value)}
        />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input 
          type="date" 
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Salvar Alteração" : "Adicionar"}
        </button>
      </form>

      {/* --- LISTA --- */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {transactions.map(item => (
          <li key={item.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid #ccc', 
            padding: '10px 10px' 
          }}>
            
            <div>
              <strong>{item.description}</strong>
              <br/>
              {/* Formatação da Data */}
              <small style={{ color: '#888' }}>
                {new Date(item.created_at).toLocaleDateString('pt-BR')}
              </small>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* Formatação Condicional (Verde/Vermelho) */}
              <span style={{ 
                color: item.type === 'entrada' ? 'green' : 'red', 
                fontWeight: 'bold' 
              }}>
                R$ {item.value}
              </span>
              
              <button 
                onClick={() => handleEdit(item)} 
                style={{ background: 'orange', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', marginRight: '5px' }}
              >
              ✏️
              </button>

              <button 
                onClick={() => handleDelete(item.id)}
                style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}
              >
                🗑️
              </button>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );

}

export default App;