import '@testing-library/jest-dom';

function addRoot() {
    const main = document.createElement('main');
    main.id = 'root';
    document.body.appendChild(main);
}

function removeRoot() {
    const root = document.getElementById('root');

    if (root) {
        return document.body.removeChild(root);
    }
}

// Keep DOM ready and clear
beforeEach(addRoot);
afterEach(removeRoot);
