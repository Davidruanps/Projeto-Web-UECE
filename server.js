const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'educacao_crud'
}); 

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados MySQL!'); 
});

//ROTAS GET
app.get('/alunos', (req, res) => {
  const query = 'SELECT * FROM alunos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar alunos:', err);
      res.status(500).send('Erro ao buscar alunos');
      return;
    }
    res.json(results);
  });
});


app.get('/professores', (req, res) => {
  const query = 'SELECT * FROM professores'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar professores:', err);
      res.status(500).send('Erro ao buscar professores');
      return;
    }
    res.json(results);
  } );
});

app.get('/turmas', (req, res) => {
  const query = 'SELECT * FROM turmas'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar turmas:', err);
      res.status(500).send('Erro ao buscar turmas');
      return;
    }
    res.json(results);
  });
});

app.get('/matriculas', (req, res) => {
  const query = 'SELECT * FROM matriculas';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar matriculas:', err);
      res.status(500).send('Erro ao buscar matriculas');
      return;
    }
    res.json(results);
  });
});

//ROTAS POST

app.use(express.json());

app.post('/professores', (req, res) => {
  const {nome, email, especialidade, ativo} = req.body;
  const query = 'INSERT INTO professores (nome, email, especialidade, ativo) VALUES (?, ?, ?, ?)';
  db.query(query, [nome, email, especialidade, ativo], (err, results) => {
    if (err) {
      console.error('Erro ao inserir professor:', err);
      res.status(500).send('Erro ao inserir professor');
      return;
    }
    res.status(201).json('Cadastro de professor realizado com sucesso!');
  });
});



app.post('/alunos', (req, res) => {
  const {matricula, nome, email, curso, ativo} = req.body;
  const query = 'INSERT INTO alunos (matricula, nome, email, curso, ativo) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [matricula, nome, email, curso, ativo], (err, results) => {
    if (err) {
      console.error('Erro ao inserir aluno:', err);
      res.status(500).send('Erro ao inserir aluno');
      return;
    }
    res.status(201).json('Cadastro de aluno realizado com sucesso!');
  });
});

app.post('/turmas', (req, res) => {
  const {codigo, nome, periodo, sala, criado_em} = req.body;
  const query = 'INSERT INTO turmas (codigo, nome, periodo, sala, criado_em) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [codigo, nome, periodo, sala, criado_em], (err, results) => {
    if (err) {
      console.error('Erro ao inserir turma:', err);
      res.status(500).send('Erro ao inserir turma');
      return;
    }
    res.status(201).json('Cadastro de turma realizado com sucesso!');
  });
});

app.post('/matriculas', (req, res) => {
  const {aluno_id, turma_id, nota_final, frequencia_pct, status, observacao, data_matricula} = req.body;
  const query = 'INSERT INTO matriculas (aluno_id, turma_id, nota_final, frequencia_pct, status, observacao, data_matricula) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [aluno_id, turma_id, nota_final, frequencia_pct, status, observacao, data_matricula], (err, results) => {
    if (err) {
      console.error('Erro ao inserir matricula:', err);
      res.status(500).send('Erro ao inserir matricula');
      return;
    }
    res.status(201).json('Cadastro de matricula realizado com sucesso!');
  });
});

//ROTAS PUT

app.put('/professores/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, especialidade, ativo } = req.body;
  const query = 'UPDATE professores SET nome = ?, email = ?, especialidade = ?, ativo = ? WHERE id = ?';
  db.query(query, [nome, email, especialidade, ativo, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar professor:', err);
      res.status(500).send('Erro ao atualizar professor');
      return;
    }
    res.json('Atualização de professor realizada com sucesso!');
  });
});

app.put('/alunos/:id', (req, res) => {
  const { id } = req.params;
  const { matricula, nome, email, curso, ativo } = req.body;
  const query = 'UPDATE alunos SET matricula = ?, nome = ?, email = ?, curso = ?, ativo = ? WHERE id = ?';
  db.query(query, [matricula, nome, email, curso, ativo, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar aluno:', err);
      res.status(500).send('Erro ao atualizar aluno');
      return;
    }
    res.json('Atualização de aluno realizada com sucesso!');
  });
});

app.put('/turmas/:id', (req, res) => {
  const { id } = req.params;
  const { codigo, nome, periodo, sala, criado_em } = req.body;
  const query = 'UPDATE turmas SET codigo = ?, nome = ?, periodo = ?, sala = ?, criado_em = ? WHERE id = ?';
  db.query(query, [codigo, nome, periodo, sala, criado_em, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar turma:', err);
      res.status(500).send('Erro ao atualizar turma');
      return;
    }
    res.json('Atualização de turma realizada com sucesso!');
  });
});

app.put('/matriculas/:id', (req, res) => {
  const { id } = req.params;
  const { aluno_id, turma_id, nota_final, frequencia_pct, status, observacao, data_matricula } = req.body;
  const query = 'UPDATE matriculas SET aluno_id = ?, turma_id = ?, nota_final = ?, frequencia_pct = ?, status = ?, observacao = ?, data_matricula = ? WHERE id = ?';
  db.query(query, [aluno_id, turma_id, nota_final, frequencia_pct, status, observacao, data_matricula, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar matricula:', err);
      res.status(500).send('Erro ao atualizar matricula');
      return;
    }
    res.json('Atualização de matricula realizada com sucesso!');
  });
});
