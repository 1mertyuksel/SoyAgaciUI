function loadFamilyTree() {
    fetch('http://localhost:8080/api/family/tree')
        .then(response => response.json())
        .then(data => {
            // Veriyi OrgChartJS formatına dönüştür
            const nodes = Object.values(data).map(person => ({
                id: person.id,
                pid: person.children.length > 0 ? null : getParentId(person.id, data), // Ebeveyn ID'sini bul
                name: person.name,
                title: person.birthDate + ' (' + person.gender + ')',
                spouse: person.spouse ? {
                    id: person.spouse.id,
                    name: person.spouse.name,
                    title: person.spouse.birthDate + ' (' + person.spouse.gender + ')'
                } : null
            }));

            // OrgChartJS'yi başlat
            new OrgChart(document.getElementById('chart-container'), {
                nodes: nodes,
                nodeBinding: {
                    field_0: 'name',
                    field_1: 'title'
                },
                enableSearch: true,
                nodeMouseClick: OrgChart.action.edit,
                spouseSeparation: 50
            });
        })
        .catch(error => console.error('Hata:', error));
}

// Ebeveyn ID'sini bulma (çocuklardan ebeveyne ulaşmak için)
function getParentId(childId, data) {
    for (let person of Object.values(data)) {
        if (person.children.some(child => child.id === childId)) {
            return person.id;
        }
    }
    return null;
}

// Kök kişi ekleme
function addRootPerson() {
    const person = {
        id: parseInt(document.getElementById('rootId').value),
        name: document.getElementById('rootName').value,
        birthDate: document.getElementById('rootBirthDate').value,
        gender: document.getElementById('rootGender').value
    };
    fetch('http://localhost:8080/api/family/root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person)
    })
        .then(response => response.text())
        .then(() => {
            alert('Kök kişi eklendi!');
            loadFamilyTree(); // Grafiği yenile
        })
        .catch(error => console.error('Hata:', error));
}

// Eş ekleme
function addSpouse() {
    const personId = parseInt(document.getElementById('personId').value);
    const spouse = {
        id: parseInt(document.getElementById('spouseId').value),
        name: document.getElementById('spouseName').value,
        birthDate: document.getElementById('spouseBirthDate').value,
        gender: document.getElementById('spouseGender').value
    };
    fetch(`http://localhost:8080/api/family/${personId}/spouse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spouse)
    })
        .then(response => response.text())
        .then(() => {
            alert('Eş eklendi!');
            loadFamilyTree(); // Grafiği yenile
        })
        .catch(error => console.error('Hata:', error));
}

// Çocuk ekleme
function addChild() {
    const parentId = parseInt(document.getElementById('parentId').value);
    const child = {
        id: parseInt(document.getElementById('childId').value),
        name: document.getElementById('childName').value,
        birthDate: document.getElementById('childBirthDate').value,
        gender: document.getElementById('childGender').value
    };
    fetch(`http://localhost:8080/api/family/${parentId}/child`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child)
    })
        .then(response => response.text())
        .then(() => {
            alert('Çocuk eklendi!');
            loadFamilyTree(); // Grafiği yenile
        })
        .catch(error => console.error('Hata:', error));
}

// Kişi silme
function removePerson() {
    const personId = parseInt(document.getElementById('removePersonId').value);
    fetch(`http://localhost:8080/api/family/${personId}`, {
        method: 'DELETE'
    })
        .then(response => response.text())
        .then(() => {
            alert('Kişi silindi!');
            loadFamilyTree(); // Grafiği yenile
        })
        .catch(error => console.error('Hata:', error));
}

// Sayfa yüklendiğinde soy ağacını getir
window.onload = loadFamilyTree;