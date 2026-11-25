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

app.post('professores', (req, res) => {
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