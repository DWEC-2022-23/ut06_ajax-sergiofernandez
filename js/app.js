document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');
  
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');

  function loadData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/invitados', true);
    xhr.onload = function () {
      const data = JSON.parse(this.responseText);
      data.forEach(invitado => {
        const li = createLI(invitado);
        ul.appendChild(li);
      });
    };
    xhr.send();
  }
  
  
  // Llamada a la función loadData
  loadData();
  
  filterLabel.textContent = "Ocultar los que no hayan respondido";
  filterCheckBox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);
  mainDiv.insertBefore(div, ul);
  filterCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const lis = ul.children;
    if(isChecked) {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        if (li.className === 'responded') {
          li.style.display = '';  
        } else {
          li.style.display = 'none';                        
        }
      }
    } else {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        li.style.display = '';
      }                                 
    }
  });
  
  function createLI(invitado) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }
  
    function appendToLI(elementName, property, value) {
      const element = createElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }
  
    const li = document.createElement('li');
    li.setAttribute('data-id', invitado.id); 
    appendToLI('span', 'textContent', invitado.nombre);
    const checkbox = appendToLI('label', 'textContent', 'Confirmed')
      .appendChild(createElement('input', 'type', 'checkbox'));
  
    if (invitado.confirmado) {
      checkbox.checked = true;
      li.className = 'responded';
    }
  
    appendToLI('button', 'textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');
    return li;
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/invitados', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', () => {
     
      const nuevoInvitado = JSON.parse(xhr.responseText);
  
      const li = createLI(nuevoInvitado);
      ul.appendChild(li);
    });
    xhr.send(JSON.stringify({nombre: text, confirmado: false }));
  });
  
    
  ul.addEventListener('change', (e) => {
    const checkbox = e.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;
    const id = listItem.getAttribute('data-id'); 
  
    listItem.className = checked ? 'responded' : ''; 
  
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:3000/invitados/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', () => {
      console.log(xhr.responseText); 
    });
    
    const invitado = {nombre: listItem.firstElementChild.textContent,confirmado: checked };
    xhr.send(JSON.stringify(invitado)); 
  });
  
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const action = button.textContent;
      const nameActions = {
        remove: () => {
          ul.removeChild(li);

          const id = li.getAttribute('data-id');

          const xhr = new XMLHttpRequest();
          xhr.open('DELETE', `http://localhost:3000/invitados/${id}`, true);
          xhr.send();
        },
        edit: () => {
          const span = li.firstElementChild;
          const name = span.textContent;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = name;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = 'save';
        },
        save: () => {
          const input = li.firstElementChild;
          const name = input.value;
          const span = document.createElement('span');
          span.textContent = name;
          li.insertBefore(span, input);
          li.removeChild(input);
          button.textContent = 'edit';
  
          const id = li.getAttribute('data-id');
  
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', `http://localhost:3000/invitados/${id}`, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.addEventListener('load', () => {
            console.log(xhr.responseText); 
          });
          const confirmado = li.classList.contains('responded');
          xhr.send(JSON.stringify({ nombre: name, confirmado: confirmado }));
        }
      };
  
      nameActions[action]();
    }
  });
  
  
});  
  
  
  
  
  
  
  
  
  