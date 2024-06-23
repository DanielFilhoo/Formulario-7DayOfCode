document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.js-form');
    const peopleTableBody = document.querySelector('.people-table-body');
    let editIndex = null;

    // Função para carregar os dados do localStorage e exibir na tabela
    function loadPeople() {
        const people = JSON.parse(localStorage.getItem('people')) || [];
        peopleTableBody.innerHTML = ''; // Limpa a tabela
        people.forEach((person, index) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const birthDateCell = document.createElement('td');
            const emailCell = document.createElement('td');
            const serverCell = document.createElement('td');
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');

            nameCell.textContent = person.name;
            birthDateCell.textContent = person.birthDate;
            emailCell.textContent = person.email;
            serverCell.textContent = person.server;

            editButton.textContent = 'Editar';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => {
                editIndex = index;
                document.querySelector('#name').value = person.name;
                document.querySelector('#birth-date').value = person.birthDate;
                document.querySelector('#email').value = person.email;
                document.querySelector('#server').value = person.server;
            });

            deleteButton.textContent = 'Remover';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => {
                deletePerson(index);
            });

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(nameCell);
            row.appendChild(birthDateCell);
            row.appendChild(emailCell);
            row.appendChild(serverCell);
            row.appendChild(actionsCell);
            peopleTableBody.appendChild(row);
        });
    }

    // Função para validar idade
    function validateAge(birthDate) {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age >= 18;
    }

    // Função para exibir mensagem de erro
    function showError(field, message) {
        const errorSpan = document.querySelector(`.js-error-${field}`);
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }

    // Função para ocultar mensagens de erro
    function hideErrors() {
        const errorSpans = document.querySelectorAll('.error-message');
        errorSpans.forEach(span => span.style.display = 'none');
    }

    // Função para salvar ou atualizar pessoa
    function savePerson(person) {
        const people = JSON.parse(localStorage.getItem('people')) || [];
        if (editIndex !== null) {
            people[editIndex] = person;
            editIndex = null;
        } else {
            people.push(person);
        }
        localStorage.setItem('people', JSON.stringify(people));
        loadPeople();
    }

    // Função para deletar pessoa
    function deletePerson(index) {
        const people = JSON.parse(localStorage.getItem('people')) || [];
        people.splice(index, 1);
        localStorage.setItem('people', JSON.stringify(people));
        loadPeople();
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        hideErrors();

        const name = document.querySelector('#name').value;
        const birthDate = document.querySelector('#birth-date').value;
        const email = document.querySelector('#email').value;
        const server = document.querySelector('#server').value;

        if (!validateAge(birthDate)) {
            showError('birthdate', 'Você precisa ser maior de 18 anos.');
            return;
        }

        const person = { name, birthDate, email, server };
        savePerson(person);

        form.reset();
    });

    loadPeople();
});
