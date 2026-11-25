const botoesAbas = document.querySelectorAll(".tab-btn");
const paineisAbas = document.querySelectorAll(".tab-panel");

// Função para alternar entre abas
botoesAbas.forEach((botao) => {
    botao.addEventListener("click", async () => {
        const abaSelecionada = botao.dataset.tab;

        botoesAbas.forEach((b) => b.classList.remove("active"));
        paineisAbas.forEach((painel) => painel.classList.remove("active"));

        botao.classList.add("active");
        const painelAlvo = document.getElementById(`tab-${abaSelecionada}`);
        if (painelAlvo) {
            painelAlvo.classList.add("active");
        }

        if (abaSelecionada === "alunos" && typeof CarregarAlunos === "function") {
            await CarregarAlunos();
        }
        if (abaSelecionada === "professores" && typeof CarregarProfessores === "function") {
            await CarregarProfessores();
        }
    });
});


// Funções para professores

let formProfessores = document.getElementById("form-professores");
let inputIdProfessor = document.getElementById("professor-id");
let inputNomeProfessor = document.getElementById("professor-nome");
let inputEmailProfessor = document.getElementById("professor-email");
let inputEspecialidadeProfessor = document.getElementById("professor-especialidade");
let inputAtivoProfessor = document.getElementById("professor-ativo");

let tabelaProfessores = document.getElementById("tbody-professores");

async function CarregarProfessores() {
    const resposta = await fetch('/professores');

    if (!resposta.ok) {
        console.error('Erro ao buscar professores:', resposta.status);
        return;
    }

    const professores = await resposta.json();
    tabelaProfessores.innerHTML = '';

    professores.forEach(professor => {
        tabelaProfessores.innerHTML += `
            <tr>
                <td>${professor.id}</td>
                <td>${professor.nome}</td>
                <td>${professor.email}</td>
                <td>${professor.especialidade || '-'}</td>
                <td>${professor.ativo ? 'Sim' : 'Não'}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="editarProfessor(${professor.id})">Editar</button>
                    <button type="button" class="btn btn-danger" onclick="excluirProfessor(${professor.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

formProfessores.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = inputIdProfessor.value;
    const nome = inputNomeProfessor.value;
    const email = inputEmailProfessor.value;
    const especialidade = inputEspecialidadeProfessor.value;
    const ativo = inputAtivoProfessor.checked ? 1 : 0;

    if (id == '') {
        const resposta = await fetch('/professores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, especialidade, ativo })
        });

        if (!resposta.ok) {
            console.error('Erro ao cadastrar professor:', resposta.status);
            return;
        }
    } else {
        const resposta = await fetch(`/professores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, especialidade, ativo })
        });

        if (!resposta.ok) {
            console.error('Erro ao atualizar professor:', resposta.status);
            return;
        }
    }

    formProfessores.reset();
    inputIdProfessor.value = '';
    inputAtivoProfessor.checked = true;
    await CarregarProfessores();
});

async function editarProfessor(id) {
    const resposta = await fetch('/professores');
    if (!resposta.ok) {
        console.error('Erro ao buscar professores para edição:', resposta.status);
        return;
    }

    const professores = await resposta.json();
    const professor = professores.find(p => p.id === id);

    if (!professor) {
        console.error('Professor não encontrado:', id);
        return;
    }

    inputIdProfessor.value = professor.id;
    inputNomeProfessor.value = professor.nome;
    inputEmailProfessor.value = professor.email;
    inputEspecialidadeProfessor.value = professor.especialidade || '';
    inputAtivoProfessor.checked = Boolean(professor.ativo);
    inputNomeProfessor.focus();

}

async function excluirProfessor(id) {
    console.log('Excluir usuário com ID:', id);

    if (confirm('Tem certeza que deseja excluir este usuário?')) {

        await fetch(`/professores/${id}`, {
            method: 'DELETE'
        });

        await CarregarProfessores();
    }



}

//Funções para alunos

let formAlunos = document.getElementById("form-alunos");
let inputMatriculaAluno = document.getElementById("aluno-matricula");
let inputIdAluno = document.getElementById("aluno-id");
let inputNomeAluno = document.getElementById("aluno-nome");
let inputEmailAluno = document.getElementById("aluno-email");
let inputCursoAluno = document.getElementById("aluno-curso");
let inputAtivoAluno = document.getElementById("aluno-ativo");

let tabelaAlunos = document.getElementById("tbody-alunos");

formAlunos.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = inputIdAluno.value;
    const matricula = inputMatriculaAluno.value;
    const nome = inputNomeAluno.value;
    const email = inputEmailAluno.value;
    const curso = inputCursoAluno.value;
    const ativo = inputAtivoAluno.checked ? 1 : 0;

    if (id == '') {
        const resposta = await fetch('/alunos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matricula, nome, email, curso, ativo })
        });
        if (!resposta.ok) {
            console.error('Erro ao cadastrar aluno:', resposta.status);
            return;
        }
    } else {
        const resposta = await fetch(`/alunos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matricula, nome, email, curso, ativo })
        });
        if (!resposta.ok) {
            console.error('Erro ao atualizar aluno:', resposta.status);
            return;
        }
    }

    formAlunos.reset();
    inputIdAluno.value = '';
    inputAtivoAluno.checked = true;
    await CarregarAlunos();
});


    async function CarregarAlunos() {
        const resposta = await fetch('/alunos');
        if(!resposta.ok) {
            console.error('Erro ao buscar alunos:', resposta.status);
            return;
        }
        const alunos = await resposta.json();

        tabelaAlunos.innerHTML = ''
        alunos.forEach(aluno => {
            tabelaAlunos.innerHTML += `
                <tr>
                    <td>${aluno.id}</td>
                    <td>${aluno.matricula}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.email}</td>
                    <td>${aluno.curso}</td>
                    <td>${aluno.ativo ? 'Sim' : 'Não'}</td>
                    <td>
                        <button type="button" class="btn btn-primary" onclick="editarAluno(${aluno.id})">Editar</button>
                        <button type="button" class="btn btn-danger" onclick="excluirAluno(${aluno.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }

    async function excluirAluno(id) {
    console.log('Excluir usuário com ID:', id);

    if (confirm('Tem certeza que deseja excluir este usuário?')) {

        await fetch(`/alunos/${id}`, {
            method: 'DELETE'
        });

        await CarregarAlunos();
    }



}
    

    async function editarAluno(id) {
        const resposta = await fetch('/alunos');
        if (!resposta.ok) {
            console.error('Erro ao buscar alunos para edição:', resposta.status);
            return;
        }

        const alunos = await resposta.json();
        const aluno = alunos.find(a => a.id === id);

        if (!aluno) {
            console.error('Aluno não encontrado:', id);
            return;
        }
        inputMatriculaAluno.value = aluno.matricula;
        inputIdAluno.value = aluno.id;
        inputNomeAluno.value = aluno.nome;
        inputEmailAluno.value = aluno.email;
        inputCursoAluno.value = aluno.curso || '';
        inputAtivoAluno.checked = Boolean(aluno.ativo);
        inputNomeAluno.focus();
    }

    CarregarAlunos();
    CarregarProfessores();