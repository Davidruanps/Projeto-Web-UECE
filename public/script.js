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

    //Turmas
     
    let formTurmas = document.getElementById("form-turmas");
    let codigoTurmaInput = document.getElementById("turma-codigo");
    let nomeTurmaInput = document.getElementById("turma-nome");
    let periodoTurmaInput = document.getElementById("turma-periodo");
    let professorTurmaInput = document.getElementById("select-turma-professor");
    let salaTurmaInput = document.getElementById("turma-sala");
    let tabelaTurmas = document.getElementById("tbody-turmas");

    async function CarregarProfessoresParaTurmas() {
        const resposta = await fetch('/professores');
        if (!resposta.ok) {
            console.error('Erro ao buscar professores para turmas:', resposta.status);
            return;
        }

        const professores = await resposta.json();
        professorTurmaInput.innerHTML = '<option value="">Selecione um professor</option>';
        professores.forEach(professor => {
            const option = document.createElement('option');

            option.value = professor.id;
            option.textContent = professor.nome;
            professorTurmaInput.appendChild(option);
        });

    }


    // Matriculas 
    let formMatriculas = document.getElementById("form-matriculas");

    formMatriculas.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.getElementById("matricula-id").value;
        const alunoId = document.getElementById("select-matricula-aluno").value;
        const turmaId = document.getElementById("select-matricula-turma").value;
        const matriculaNotaFinal = document.getElementById("matricula-nota-final").value;
        const matriculaPctPresenca = document.getElementById("matricula-frequencia-pct").value;

        if (id == '') {
            const resposta = await fetch('/matriculas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alunoId, turmaId, matriculaNotaFinal, matriculaPctPresenca })
            });
            if (!resposta.ok) {
                console.error('Erro ao cadastrar matrícula:', resposta.status);
                return;
            }
        }else{
            const resposta = await fetch(`/matriculas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alunoId, turmaId, matriculaNotaFinal, matriculaPctPresenca })
            });
            if (!resposta.ok) {
                console.error('Erro ao atualizar matrícula:', resposta.status);
                return;
            }
        }

            

    });

    //Matriculas
  let inputIdMatricula = document.getElementById("matricula-id");
let inputAlunoMatricula = document.getElementById("select-matricula-aluno");
let inputTurmaMatricula = document.getElementById("select-matricula-turma");
let inputNotaFinalMatricula = document.getElementById("matricula-nota-final");
let inputPctPresencaMatricula = document.getElementById("matricula-frequencia-pct");
let inputStatusMatricula = document.getElementById("matricula-status");
let inputObservacaoMatricula = document.getElementById("matricula-observacao");

let tabelaMatriculas = document.getElementById("tbody-matriculas");

async function CarregarMatriculas() {
    const resposta = await fetch('/matriculas');
    if (!resposta.ok) {
        console.error('Erro ao buscar matrículas:', resposta.status);
        return;
    }

    const matriculas = await resposta.json();
    tabelaMatriculas.innerHTML = '';

    matriculas.forEach(matricula => {
        const notaFormatada =
            matricula.nota_final !== null && matricula.nota_final !== undefined
                ? Number(matricula.nota_final).toFixed(2)
                : '-';

        const freqFormatada =
            matricula.frequencia_pct !== null && matricula.frequencia_pct !== undefined
                ? `${Number(matricula.frequencia_pct).toFixed(1)}%`
                : '-';

        tabelaMatriculas.innerHTML += `
            <tr>
                <td>${matricula.id}</td>
                <td>${matricula.aluno_nome || `Aluno #${matricula.aluno_id}`}</td>
                <td>${matricula.turma_nome || matricula.turma_codigo || `Turma #${matricula.turma_id}`}</td>
                <td>${notaFormatada}</td>
                <td>${freqFormatada}</td>
                <td>${matricula.status || 'CURSANDO'}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="editarMatricula(${matricula.id})">Editar</button>
                    <button type="button" class="btn btn-danger" onclick="excluirMatricula(${matricula.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

    // Puxar as informações de alunos e professores para os selects de matrícula
    async function CarregarAlunosParaMatriculas() {
        const resposta = await fetch('/alunos');
        if (!resposta.ok) {
            console.error('Erro ao buscar alunos para matrículas:', resposta.status);
            return;
        }   
        const alunos = await resposta.json();
        const selectAluno = document.getElementById("select-matricula-aluno");
        selectAluno.innerHTML = '<option value="">Selecione um aluno</option>';
        alunos.forEach(aluno => {
            const option = document.createElement('option');
            option.value = aluno.id;
            option.textContent = aluno.nome;
            selectAluno.appendChild(option);
        });
    }

    async function cadastrarMatricula() {
        const id = inputIdMatricula.value;
        const alunoId = inputAlunoMatricula.value;
        const turmaId = inputTurmaMatricula.value;
        const notaFinal = inputNotaFinalMatricula.value;
        const pctPresenca = inputPctPresencaMatricula.value;
        const observacao = inputObservacaoMatricula.value;



        if (!alunoId || !turmaId) {
            alert('Selecione um aluno e uma turma para cadastrar a matrícula.');
            return;
        }

        if(id == '') {
            const resposta = await fetch('/matriculas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alunoId, turmaId, notaFinal, pctPresenca, observacao })
            });
            if (!resposta.ok) {
                console.error('Erro ao cadastrar matrícula:', resposta.status);
                return;
            }
        }else{
            const resposta = await fetch(`/matriculas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alunoId, turmaId, notaFinal, pctPresenca, observacao })
            });
            if (!resposta.ok) {
                console.error('Erro ao atualizar matrícula:', resposta.status);
                return;
            }
            alert('Matrícula atualizada com sucesso!');
        }

    }

    //Puxar as informações de turmas para o select de matrícula

    async function CarregarTurmasParaMatriculas() {
        const resposta = await fetch('/turmas');
        if (!resposta.ok) {
            console.error('Erro ao buscar turmas para matrículas:', resposta.status);
            return;
        }
        const turmas = await resposta.json();
        const selectTurma = document.getElementById("select-matricula-turma");
        selectTurma.innerHTML = '<option value="">Selecione uma turma</option>';
        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = `${turma.nome} - ${turma.periodo}`;
            selectTurma.appendChild(option);
        });
    }

CarregarAlunos();
CarregarProfessores();
CarregarProfessoresParaTurmas();
CarregarAlunosParaMatriculas();
CarregarTurmasParaMatriculas();
CarregarMatriculas();



   