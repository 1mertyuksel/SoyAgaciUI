const API_URL = "http://localhost:8080/api/family";

function showError(message) {
    document.getElementById("error-message").textContent = message;
    setTimeout(() => {
        document.getElementById("error-message").textContent = "";
    }, 3000);
}

function renderTree() {
    fetch(`${API_URL}/treejs`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                showError("Aile ağacı boş.");
                return;
            }

            var treeContainer = document.getElementById("tree");
            treeContainer.innerHTML = "";

            var tree = new FamilyTree(treeContainer, {
                template: "hugo",
                nodeBinding: {
                    field_0: "name",
                    field_1: "gender"
                },
                nodes: data
            });
        })
        .catch(error => showError("Ağaç yüklenemedi: " + error.message));
}

function addRootPerson() {
    const person = {
        id: parseInt(document.getElementById("root-id").value),
        name: document.getElementById("root-name").value,
        birthDate: document.getElementById("root-birthdate").value,
        gender: document.getElementById("root-gender").value
    };

    fetch(`${API_URL}/root`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
        })
        .then(message => {
            showError(message);
            renderTree();
            printTree();
            document.getElementById("root-id").value = "";
            document.getElementById("root-name").value = "";
            document.getElementById("root-birthdate").value = "";
        })
        .catch(error => showError("Kök kişi eklenemedi: " + error.message));
}

function addSpouse() {
    const personId = parseInt(document.getElementById("spouse-person-id").value);
    const spouse = {
        id: parseInt(document.getElementById("spouse-id").value),
        name: document.getElementById("spouse-name").value,
        birthDate: document.getElementById("spouse-birthdate").value,
        gender: document.getElementById("spouse-gender").value
    };

    fetch(`${API_URL}/${personId}/spouse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spouse)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
        })
        .then(message => {
            showError(message);
            renderTree();
            printTree();
            document.getElementById("spouse-person-id").value = "";
            document.getElementById("spouse-id").value = "";
            document.getElementById("spouse-name").value = "";
            document.getElementById("spouse-birthdate").value = "";
        })
        .catch(error => showError("Eş eklenemedi: " + error.message));
}

function addChild() {
    const parentId = parseInt(document.getElementById("child-parent-id").value);
    const child = {
        id: parseInt(document.getElementById("child-id").value),
        name: document.getElementById("child-name").value,
        birthDate: document.getElementById("child-birthdate").value,
        gender: document.getElementById("child-gender").value
    };

    fetch(`${API_URL}/${parentId}/child`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(child)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
        })
        .then(message => {
            showError(message);
            renderTree();
            printTree();
            document.getElementById("child-parent-id").value = "";
            document.getElementById("child-id").value = "";
            document.getElementById("child-name").value = "";
            document.getElementById("child-birthdate").value = "";
        })
        .catch(error => showError("Çocuk eklenemedi: " + error.message));
}

function removePerson() {
    const personId = parseInt(document.getElementById("remove-id").value);

    fetch(`${API_URL}/${personId}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
        })
        .then(message => {
            showError(message);
            renderTree();
            printTree();
            document.getElementById("remove-id").value = "";
        })
        .catch(error => showError("Kişi silinemedi: " + error.message));
}

function printTree() {
    fetch(`${API_URL}/print`)
        .then(response => response.text())
        .then(text => {
            document.getElementById("text-tree-container").textContent = text || "Aile ağacı boş.";
        })
        .catch(error => showError("Ağaç yazılamadı: " + error.message));
}

document.addEventListener("DOMContentLoaded", () => {
    renderTree();
    printTree();
});
